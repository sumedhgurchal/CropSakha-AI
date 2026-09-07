"""
CropSakha AI — Scans Router
Handles image uploads, quality checks, AI inference, XAI attention maps, and scan history.
"""
import uuid
import os
import sys
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from jose import jwt


# Ensure root path is accessible for ML imports
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, "../../.."))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from ml.inference.service import inference_service
from ml.preprocessing.quality import assess_image_quality
try:
    from ..database import get_db
    from ..models import ConfidenceLevel, CropScan, Prediction, User, Disease
    from ..schemas import ScanResponseSchema, QualityCheckSchema, PredictionResultSchema, TopPredictionSchema, ScanHistoryItemSchema
    from ..config import settings
    from ..dependencies import get_current_user
except (ImportError, ValueError):
    from database import get_db
    from models import ConfidenceLevel, CropScan, Prediction, User, Disease
    from schemas import ScanResponseSchema, QualityCheckSchema, PredictionResultSchema, TopPredictionSchema, ScanHistoryItemSchema
    from config import settings
    from dependencies import get_current_user
    from ml.quality.service import assess_image_quality
from ml.inference.service import inference_service
from ml.biomass.service import crop_biomass_estimator
from apps.api.services.gemini_service import gemini_service


router = APIRouter(prefix="/scans", tags=["Scans"])


def determine_confidence_level(confidence: float) -> str:
    """Categorize confidence into HIGH, MEDIUM, LOW."""
    if confidence >= settings.ml_confidence_high:
        return ConfidenceLevel.HIGH
    elif confidence >= settings.ml_confidence_medium:
        return ConfidenceLevel.MEDIUM
    else:
        return ConfidenceLevel.LOW


async def resolve_user(request: Request, db: AsyncSession) -> Optional[User]:
    """Attempt to resolve user from Bearer token, or fallback to demo user."""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
            user_id_str = payload.get("sub")
            if user_id_str:
                user = await db.get(User, uuid.UUID(user_id_str))
                if user:
                    return user
        except Exception:
            pass

    # Fallback to demo user so guest scans are also visible on demo dashboard
    res = await db.execute(select(User).where(User.email == "demo@cropsakha.ai"))
    return res.scalar_one_or_none()


@router.post("/analyze", response_model=ScanResponseSchema)
async def analyze_crop(
    request: Request,
    file: UploadFile = File(...),
    crop: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload a crop leaf image for disease detection, explainability, and agronomic cure guidance.
    """
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/bmp"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type ({file.content_type}). Allowed: {', '.join(allowed_types)}"
        )

    image_bytes = await file.read()
    if len(image_bytes) > settings.max_image_size_bytes:
        raise HTTPException(status_code=400, detail="File too large. Max allowed is 10MB.")

    # 1. Quality Check
    quality_result = assess_image_quality(image_bytes)
    if not quality_result["quality_pass"] and quality_result["quality_score"] == 0.0:
        raise HTTPException(status_code=400, detail="Image quality check failed entirely. Please provide a valid leaf image.")

    # 2. Real Deep Learning Inference & Explainable AI (Grad-CAM)
    try:
        colab_url = request.headers.get("x-colab-url") or settings.inference_service_url
        inference_result = inference_service.predict(
            image_bytes, 
            filename=file.filename or "", 
            crop_hint=crop or "", 
            top_k=3,
            colab_url=colab_url
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")


    primary = inference_result["primary"]
    top_k = inference_result["top_k"]
    is_healthy = primary.get("is_healthy", "healthy" in primary["disease"].lower())

    # 3. Look up curated disease treatment knowledge
    disease_info = None
    try:
        res = await db.execute(select(Disease).where(Disease.name == primary["class_name"]))
        disease_info = res.scalar_one_or_none()
    except Exception:
        pass

    display_name = disease_info.display_name if disease_info else primary["disease"].replace("_", " ")
    description = disease_info.description if disease_info else f"Detected on {primary['crop']} foliage."
    prevention = (disease_info.prevention or []) if disease_info else [
        "Ensure good field drainage and avoid overhead sprinkler watering.",
        "Prune lower canopy leaves to minimize soil-splash inoculation."
    ]
    symptoms = (disease_info.symptoms or []) if disease_info else []
    regional_names = (disease_info.regional_names or {}) if disease_info else {}

    # Gemini Dual-Action Prescriptions (Multilingual)
    severity_label = inference_result.get("severity_label", "moderate")
    prescriptions = await gemini_service.generate_prescriptions(
        crop=primary["crop"],
        disease=display_name,
        severity=severity_label
    )
    
    treatment_organic = [prescriptions.get("english", {}).get("biological", "Apply botanical neem oil.")]
    treatment_chemical = [prescriptions.get("english", {}).get("chemical", "Apply recommended protective fungicide.")]
    
    # Store the multilingual payload for the frontend to use in TTS
    multilingual_prescriptions = prescriptions

    # 4. Construct voice audio guidance text
    if is_healthy:
        audio_text = (
            f"Diagnosis complete. The {primary['crop']} plant appears healthy and vigorous "
            f"with {round(primary['confidence'] * 100)} percent confidence. No pathogen infection detected. "
            f"Continue routine irrigation and preventive monitoring."
        )
    else:
        org_cure = treatment_organic[0] if treatment_organic else "Apply botanical neem oil."
        chem_cure = treatment_chemical[0] if treatment_chemical else "Apply recommended protective fungicide."
        audio_text = (
            f"Crop Health Alert. Detected {display_name} on {primary['crop']} "
            f"with {round(primary['confidence'] * 100)} percent confidence. "
            f"Severity level is {inference_result.get('severity_label', 'moderate')}. "
            f"Recommended organic solution: {org_cure}. "
            f"Chemical control: {chem_cure}."
        )

    scan_id = uuid.uuid4()

    # 5. Persist scan in DB
    try:
        active_user = await resolve_user(request, db)
        if active_user:
            crop_scan = CropScan(
                id=scan_id,
                user_id=active_user.id,
                image_path=f"/demo/{file.filename or 'sample_leaf.jpg'}",
                image_original_name=file.filename or "uploaded_leaf.jpg",
                model_version="LeafVision 2.0",
                model_architecture=inference_result.get("model_used", "LeafVision CV Engine"),
                primary_prediction=primary["class_name"],
                primary_crop=primary["crop"],
                primary_disease=primary["disease"],
                confidence=primary["confidence"],
                confidence_level=ConfidenceLevel.HIGH if primary["confidence"] > 0.8 else ConfidenceLevel.MEDIUM,
                is_healthy=is_healthy,
                quality_score=quality_result["quality_score"],
                quality_pass=quality_result["quality_pass"],
                quality_issues=quality_result["quality_issues"],
                severity_estimate=inference_result.get("severity_estimate", 0.0),
                severity_label=inference_result.get("severity_label", "Normal"),
            )
            db.add(crop_scan)
            await db.flush()

            for p in top_k:
                pred = Prediction(
                    id=uuid.uuid4(),
                    scan_id=scan_id,
                    label=p["class_name"],
                    crop_name=p["crop"],
                    disease_name=p["disease"],
                    rank=p["rank"],
                    confidence=p["confidence"]
                )
                db.add(pred)

            await db.commit()
    except Exception as e:
        print(f"Notice: Failed to persist scan to DB: {e}")

    # Build response
    prediction_schema = PredictionResultSchema(
        crop=primary["crop"],
        disease=primary["disease"],
        class_name=primary["class_name"],
        confidence=primary["confidence"],
        is_healthy=is_healthy
    )

    top_predictions_schema = [
        TopPredictionSchema(
            crop=p["crop"], disease=p["disease"], confidence=p["confidence"], rank=p["rank"]
        ) for p in top_k
    ]

    quality_schema = QualityCheckSchema(
        quality_score=quality_result["quality_score"],
        quality_pass=quality_result["quality_pass"],
        quality_issues=quality_result["quality_issues"]
    )

    # 6. CSIRO Image2Biomass & Crop Weight Estimation
    try:
        base_biomass = crop_biomass_estimator.estimate_biomass(
            image_bytes=image_bytes,
            crop_name=primary["crop"],
            severity_score=inference_result.get("severity_estimate", 0.0) or 0.0
        )
        biomass_data = await gemini_service.enhance_biomass_estimation(primary["crop"], base_biomass)
    except Exception as e:
        print(f"Biomass estimation notice: {e}")
        biomass_data = None

    return ScanResponseSchema(
        id=scan_id,
        success=True,
        prediction=prediction_schema,
        top_predictions=top_predictions_schema,
        quality=quality_schema,
        severity_estimate=inference_result.get("severity_estimate"),
        severity_label=inference_result.get("severity_label"),
        affected_area_percentage=inference_result.get("affected_area_percentage"),
        heatmap_base64=inference_result.get("heatmap_base64"),
        display_name=display_name,
        description=description,
        treatment_organic=treatment_organic,
        treatment_chemical=treatment_chemical,
        prevention=prevention,
        symptoms=symptoms,
        audio_text=audio_text,
        regional_names=regional_names,
        biomass=biomass_data,
        gemini_prescriptions=multilingual_prescriptions
    )



@router.get("/history", response_model=List[ScanHistoryItemSchema])
async def get_scan_history(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Get the authenticated user's scan history (or demo user scans for guest)."""
    user = await resolve_user(request, db)
    if not user:
        return []

    stmt = (
        select(CropScan)
        .where(CropScan.user_id == user.id)
        .order_by(desc(CropScan.created_at))
        .limit(50)
    )
    result = await db.execute(stmt)
    scans = result.scalars().all()

    history = []
    for s in scans:
        history.append(ScanHistoryItemSchema(
            id=s.id,
            created_at=s.created_at,
            image_url=s.image_path or "/demo/sample_leaf.jpg",
            primary_crop=s.primary_crop or "Unknown",
            primary_disease=s.primary_disease or "Unknown",
            confidence=s.confidence or 0.0,
            is_healthy=s.is_healthy
        ))

    return history
