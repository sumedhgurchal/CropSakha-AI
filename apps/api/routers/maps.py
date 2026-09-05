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
        {
            "id": "ob-1",
            "lat": 19.9975,
            "lng": 73.7898,
            "location_name": "Nashik, Maharashtra",
            "crop": "Tomato",
            "disease": "Tomato Late Blight",
            "severity": "HIGH",
            "affected_radius_km": 14.5,
            "alert_level": "Red Alert",
            "reported_cases": 84,
            "timestamp": (now - timedelta(hours=4)).isoformat() + "Z"
        },
        {
            "id": "ob-2",
            "lat": 17.6599,
            "lng": 75.9064,
            "location_name": "Solapur, Maharashtra",
            "crop": "Grape",
            "disease": "Grape Black Rot",
            "severity": "MEDIUM",
            "affected_radius_km": 8.2,
            "alert_level": "Orange Advisory",
            "reported_cases": 37,
            "timestamp": (now - timedelta(hours=11)).isoformat() + "Z"
        },
        {
            "id": "ob-3",
            "lat": 21.1458,
            "lng": 79.0882,
            "location_name": "Nagpur, Maharashtra",
            "crop": "Orange",
            "disease": "Citrus Greening (HLB)",
            "severity": "HIGH",
            "affected_radius_km": 18.0,
            "alert_level": "Red Alert",
            "reported_cases": 112,
            "timestamp": (now - timedelta(hours=18)).isoformat() + "Z"
        },
        {
            "id": "ob-4",
            "lat": 18.5204,
            "lng": 73.8567,
            "location_name": "Pune, Maharashtra",
            "crop": "Potato",
            "disease": "Potato Early Blight",
            "severity": "LOW",
            "affected_radius_km": 5.0,
            "alert_level": "Yellow Watch",
            "reported_cases": 19,
            "timestamp": (now - timedelta(days=1, hours=3)).isoformat() + "Z"
        },
        {
            "id": "ob-5",
            "lat": 16.8524,
            "lng": 74.5815,
            "location_name": "Sangli, Maharashtra",
            "crop": "Grape",
            "disease": "Grape Downy Mildew",
            "severity": "HIGH",
            "affected_radius_km": 12.0,
            "alert_level": "Red Alert",
            "reported_cases": 63,
            "timestamp": (now - timedelta(days=1, hours=7)).isoformat() + "Z"
        },
        {
            "id": "ob-6",
            "lat": 27.1767,
            "lng": 78.0081,
            "location_name": "Agra, Uttar Pradesh",
            "crop": "Potato",
            "disease": "Potato Late Blight",
            "severity": "HIGH",
            "affected_radius_km": 22.0,
            "alert_level": "Red Alert",
            "reported_cases": 140,
            "timestamp": (now - timedelta(hours=6)).isoformat() + "Z"
        },
        {
            "id": "ob-7",
            "lat": 30.9010,
            "lng": 75.8573,
            "location_name": "Ludhiana, Punjab",
            "crop": "Corn (Maize)",
            "disease": "Corn Common Rust",
            "severity": "MEDIUM",
            "affected_radius_km": 9.5,
            "alert_level": "Orange Advisory",
            "reported_cases": 42,
            "timestamp": (now - timedelta(days=2)).isoformat() + "Z"
        },
        {
            "id": "ob-8",
            "lat": 13.1367,
            "lng": 78.1291,
            "location_name": "Kolar, Karnataka",
            "crop": "Tomato",
            "disease": "Tomato Leaf Curl Virus (TYLCV)",
            "severity": "HIGH",
            "affected_radius_km": 16.0,
            "alert_level": "Red Alert",
            "reported_cases": 95,
            "timestamp": (now - timedelta(hours=14)).isoformat() + "Z"
        },
        {
            "id": "ob-9",
            "lat": 31.1048,
            "lng": 77.1734,
            "location_name": "Shimla, Himachal Pradesh",
            "crop": "Apple",
            "disease": "Apple Scab",
            "severity": "MEDIUM",
            "affected_radius_km": 7.0,
            "alert_level": "Orange Advisory",
            "reported_cases": 28,
            "timestamp": (now - timedelta(days=1, hours=16)).isoformat() + "Z"
        },
        {
            "id": "ob-10",
            "lat": 22.5645,
            "lng": 72.9289,
            "location_name": "Anand, Gujarat",
            "crop": "Squash",
            "disease": "Squash Powdery Mildew",
            "severity": "LOW",
            "affected_radius_km": 4.5,
            "alert_level": "Yellow Watch",
            "reported_cases": 15,
            "timestamp": (now - timedelta(days=2, hours=4)).isoformat() + "Z"
        }
    ]

    # Filter
    if crop and crop.lower() != "all":
        points = [p for p in points if crop.lower() in p["crop"].lower()]
    if severity and severity.lower() != "all":
        points = [p for p in points if p["severity"].lower() == severity.lower()]

    return points
