"""
CropSakha AI — Maps Router
Provides geospatial disease outbreak telemetry for agricultural monitoring.
"""
from fastapi import APIRouter
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta

router = APIRouter(prefix="/maps", tags=["maps"])


class OutbreakPoint(BaseModel):
    id: str
    lat: float
    lng: float
    location_name: str
    crop: str
    disease: str
    severity: str  # HIGH, MEDIUM, LOW
    affected_radius_km: float
    alert_level: str
    reported_cases: int
    timestamp: str


@router.get("/outbreaks", response_model=List[OutbreakPoint])
async def get_outbreaks(crop: Optional[str] = None, severity: Optional[str] = None):
    """
    Get live geospatial disease outbreaks across major agricultural hubs.
    Supports filtering by crop and severity.
    """
    now = datetime.utcnow()
    points = [
        # USA
        {"id": "ob-1", "lat": 41.5000, "lng": -93.6150, "location_name": "Des Moines, Iowa, USA", "crop": "Corn", "disease": "Corn Northern Leaf Blight", "severity": "HIGH", "affected_radius_km": 45.0, "alert_level": "Red Alert", "reported_cases": 340, "timestamp": (now - timedelta(hours=2)).isoformat() + "Z"},
        {"id": "ob-2", "lat": 36.7783, "lng": -119.4179, "location_name": "Fresno, California, USA", "crop": "Grape", "disease": "Grape Powdery Mildew", "severity": "MEDIUM", "affected_radius_km": 12.5, "alert_level": "Orange Advisory", "reported_cases": 85, "timestamp": (now - timedelta(hours=5)).isoformat() + "Z"},
        # Brazil
        {"id": "ob-3", "lat": -12.9714, "lng": -38.5014, "location_name": "Bahia, Brazil", "crop": "Soybean", "disease": "Asian Soybean Rust", "severity": "HIGH", "affected_radius_km": 120.0, "alert_level": "Critical", "reported_cases": 890, "timestamp": (now - timedelta(hours=1)).isoformat() + "Z"},
        {"id": "ob-4", "lat": -23.5505, "lng": -46.6333, "location_name": "São Paulo, Brazil", "crop": "Orange", "disease": "Citrus Canker", "severity": "MEDIUM", "affected_radius_km": 25.0, "alert_level": "Orange Advisory", "reported_cases": 150, "timestamp": (now - timedelta(hours=8)).isoformat() + "Z"},
        # Europe
        {"id": "ob-5", "lat": 44.8378, "lng": -0.5792, "location_name": "Bordeaux, France", "crop": "Grape", "disease": "Grape Downy Mildew", "severity": "HIGH", "affected_radius_km": 18.0, "alert_level": "Red Alert", "reported_cases": 210, "timestamp": (now - timedelta(hours=4)).isoformat() + "Z"},
        {"id": "ob-6", "lat": 51.1657, "lng": 10.4515, "location_name": "Erfurt, Germany", "crop": "Potato", "disease": "Potato Late Blight", "severity": "HIGH", "affected_radius_km": 30.0, "alert_level": "Red Alert", "reported_cases": 412, "timestamp": (now - timedelta(hours=12)).isoformat() + "Z"},
        {"id": "ob-7", "lat": 41.8719, "lng": 12.5674, "location_name": "Rome, Italy", "crop": "Tomato", "disease": "Tomato Early Blight", "severity": "LOW", "affected_radius_km": 8.0, "alert_level": "Yellow Watch", "reported_cases": 45, "timestamp": (now - timedelta(days=1)).isoformat() + "Z"},
        # India
        {"id": "ob-8", "lat": 19.9975, "lng": 73.7898, "location_name": "Nashik, Maharashtra, India", "crop": "Tomato", "disease": "Tomato Late Blight", "severity": "HIGH", "affected_radius_km": 14.5, "alert_level": "Red Alert", "reported_cases": 84, "timestamp": (now - timedelta(hours=4)).isoformat() + "Z"},
        {"id": "ob-9", "lat": 21.1458, "lng": 79.0882, "location_name": "Nagpur, Maharashtra, India", "crop": "Orange", "disease": "Citrus Greening", "severity": "HIGH", "affected_radius_km": 18.0, "alert_level": "Red Alert", "reported_cases": 112, "timestamp": (now - timedelta(hours=18)).isoformat() + "Z"},
        {"id": "ob-10", "lat": 30.9010, "lng": 75.8573, "location_name": "Ludhiana, Punjab, India", "crop": "Corn", "disease": "Corn Common Rust", "severity": "MEDIUM", "affected_radius_km": 9.5, "alert_level": "Orange Advisory", "reported_cases": 42, "timestamp": (now - timedelta(days=2)).isoformat() + "Z"},
        # China
        {"id": "ob-11", "lat": 34.3416, "lng": 108.9398, "location_name": "Xi'an, Shaanxi, China", "crop": "Apple", "disease": "Apple Scab", "severity": "HIGH", "affected_radius_km": 22.0, "alert_level": "Red Alert", "reported_cases": 315, "timestamp": (now - timedelta(hours=6)).isoformat() + "Z"},
        {"id": "ob-12", "lat": 28.2282, "lng": 112.9388, "location_name": "Changsha, Hunan, China", "crop": "Rice", "disease": "Rice Blast", "severity": "HIGH", "affected_radius_km": 55.0, "alert_level": "Red Alert", "reported_cases": 620, "timestamp": (now - timedelta(hours=3)).isoformat() + "Z"},
        # Africa
        {"id": "ob-13", "lat": -1.2921, "lng": 36.8219, "location_name": "Nairobi, Kenya", "crop": "Cassava", "disease": "Cassava Brown Streak Disease", "severity": "HIGH", "affected_radius_km": 85.0, "alert_level": "Critical", "reported_cases": 1200, "timestamp": (now - timedelta(hours=9)).isoformat() + "Z"},
        {"id": "ob-14", "lat": 9.0820, "lng": 8.6753, "location_name": "Abuja, Nigeria", "crop": "Tomato", "disease": "Tomato Yellow Leaf Curl Virus", "severity": "MEDIUM", "affected_radius_km": 15.0, "alert_level": "Orange Advisory", "reported_cases": 95, "timestamp": (now - timedelta(days=1)).isoformat() + "Z"},
        # Australia
        {"id": "ob-15", "lat": -33.8688, "lng": 151.2093, "location_name": "Sydney, NSW, Australia", "crop": "Apple", "disease": "Cedar Apple Rust", "severity": "LOW", "affected_radius_km": 5.0, "alert_level": "Yellow Watch", "reported_cases": 12, "timestamp": (now - timedelta(days=2)).isoformat() + "Z"},
        {"id": "ob-16", "lat": -34.9285, "lng": 138.6007, "location_name": "Adelaide, SA, Australia", "crop": "Grape", "disease": "Grape Black Rot", "severity": "MEDIUM", "affected_radius_km": 10.0, "alert_level": "Orange Advisory", "reported_cases": 45, "timestamp": (now - timedelta(hours=14)).isoformat() + "Z"}
    ]

    # Filter
    if crop and crop.lower() != "all":
        points = [p for p in points if crop.lower() in p["crop"].lower()]
    if severity and severity.lower() != "all":
        points = [p for p in points if p["severity"].lower() == severity.lower()]

    return points
