"""
CropSakha AI — Diseases Knowledge Base Router
Provides disease encyclopedia information, symptoms, and cure protocols.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from typing import List, Optional
import uuid

from ..database import get_db
from ..models import Disease
from ..schemas import DiseaseSchema

router = APIRouter(prefix="/diseases", tags=["diseases"])


@router.get("/", response_model=List[DiseaseSchema])
async def get_all_diseases(
    crop: Optional[str] = Query(None, description="Filter by crop name"),
    search: Optional[str] = Query(None, description="Search by disease or symptom"),
    db: AsyncSession = Depends(get_db)
):
    """Get the full disease library with optional crop and search filters."""
    stmt = select(Disease).order_by(Disease.crop, Disease.display_name)

    if crop and crop.lower() != "all":
        stmt = stmt.where(func.lower(Disease.crop).contains(crop.lower()))

    if search:
        search_pattern = f"%{search.lower()}%"
        stmt = stmt.where(
            or_(
                func.lower(Disease.name).contains(search_pattern),
                func.lower(Disease.display_name).contains(search_pattern),
                func.lower(Disease.crop).contains(search_pattern),
                func.lower(Disease.description).contains(search_pattern)
            )
        )

    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{disease_id}", response_model=DiseaseSchema)
async def get_disease(disease_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Get detailed information for a specific disease."""
    disease = await db.get(Disease, disease_id)
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")
    return disease


@router.get("/by-name/{name}", response_model=DiseaseSchema)
async def get_disease_by_name(name: str, db: AsyncSession = Depends(get_db)):
    """Get detailed information for a specific disease by its system name."""
    stmt = select(Disease).where(Disease.name == name)
    result = await db.execute(stmt)
    disease = result.scalar_one_or_none()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")
    return disease
