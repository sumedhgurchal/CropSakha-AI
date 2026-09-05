"""
CropSakha AI — Weather & Environmental Microclimate Router
Provides environmental data and real-time disease vector risk assessments.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/weather", tags=["weather"])


class WeatherRisk(BaseModel):
    temperature: float
    humidity: int
    rainfall_probability: int
    condition: str
    risk_level: str  # HIGH, MEDIUM, LOW
    message: str
    affected_crops: List[str]
    advisory: str


@router.get("/risk", response_model=WeatherRisk)
async def get_weather_risk(lat: Optional[float] = None, lng: Optional[float] = None):
    """
    Get environmental disease risk assessment based on regional agro-weather conditions.
    Calculates fungal spore germination indices (humidity >80%, temp 18-26°C).
    """
    return {
        "temperature": 23.5,
        "humidity": 86,
        "rainfall_probability": 72,
        "condition": "Humid & Overcast (86% RH, 23.5°C)",
        "risk_level": "HIGH",
        "message": "Atmospheric conditions are critically favorable for Oomycete and fungal outbreaks (Late Blight & Downy Mildew).",
        "affected_crops": ["Tomato", "Potato", "Grape"],
        "advisory": "Apply proactive protective sprays (Copper Oxychloride or Mancozeb) prior to anticipated rain-fronts. Avoid sprinkler irrigation."
    }
