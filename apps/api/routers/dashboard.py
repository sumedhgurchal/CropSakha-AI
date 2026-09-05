"""
CropSakha AI — Dashboard Router
Provides aggregate statistics, health KPIs, and recent activity overview.
"""
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from jose import jwt
import uuid

from ..database import get_db
from ..models import User, CropScan
from ..config import settings

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


async def resolve_dashboard_user(request: Request, db: AsyncSession) -> User:
    """Resolve user from token or return default demo farmer."""
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

    # Fallback to demo user
    res = await db.execute(select(User).where(User.email == "demo@cropsakha.ai"))
    user = res.scalar_one_or_none()
    if user:
        return user

    # Fallback first user
    first_user_res = await db.execute(select(User).limit(1))
    return first_user_res.scalar_one_or_none()


@router.get("/summary")
async def get_dashboard_summary(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Get aggregate statistics for the user's dashboard."""
    current_user = await resolve_dashboard_user(request, db)

    if not current_user:
        return {
            "total_scans": 12,
            "healthy_crops": 8,
            "action_needed": 4,
            "healthy_rate_pct": 67.0,
            "critical_alerts": 2,
            "top_crop": "Tomato",
            "recent_scans": []
        }

    # Total scans
    stmt_total = select(func.count(CropScan.id)).where(CropScan.user_id == current_user.id)
    total_result = await db.execute(stmt_total)
    total_scans = total_result.scalar_one() or 0

    # Healthy crops
    stmt_healthy = select(func.count(CropScan.id)).where(
        CropScan.user_id == current_user.id,
        CropScan.is_healthy == True
    )
    healthy_result = await db.execute(stmt_healthy)
    healthy_crops = healthy_result.scalar_one() or 0

    action_needed = max(0, total_scans - healthy_crops)
    healthy_rate = round((healthy_crops / max(1, total_scans)) * 100, 1)

    # Recent scans list
    stmt_recent = (
        select(CropScan)
        .where(CropScan.user_id == current_user.id)
        .order_by(desc(CropScan.created_at))
        .limit(5)
    )
    recent_res = await db.execute(stmt_recent)
    recent_scans_data = [
        {
            "id": str(s.id),
            "crop": s.primary_crop or "Unknown",
            "disease": (s.primary_disease or "Unknown").replace("_", " "),
            "confidence": round((s.confidence or 0.0) * 100, 1),
            "is_healthy": s.is_healthy,
            "severity_label": s.severity_label or ("Healthy" if s.is_healthy else "Moderate"),
            "created_at": s.created_at.strftime("%b %d, %Y") if s.created_at else "Recent"
        }
        for s in recent_res.scalars().all()
    ]

    return {
        "user_name": current_user.name,
        "total_scans": total_scans,
        "healthy_crops": healthy_crops,
        "action_needed": action_needed,
        "healthy_rate_pct": healthy_rate,
        "critical_alerts": sum(1 for s in recent_scans_data if not s["is_healthy"]),
        "top_crop": recent_scans_data[0]["crop"] if recent_scans_data else "Tomato",
        "recent_scans": recent_scans_data
    }
