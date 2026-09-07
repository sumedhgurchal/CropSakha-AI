"""
CropSakha AI — Pydantic Schemas
"""
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from uuid import UUID
from ..models import ConfidenceLevel

# --- Prediction & Scan Schemas ---

class TopPredictionSchema(BaseModel):
    crop: str
    disease: str
    confidence: float
    rank: int

class PredictionResultSchema(BaseModel):
    crop: str
    disease: str
    class_name: str
    confidence: float
    is_healthy: bool

class QualityCheckSchema(BaseModel):
    quality_score: float
    quality_pass: bool
    quality_issues: List[str] = []

class ScanResponseSchema(BaseModel):
    id: UUID
    success: bool = True
    prediction: PredictionResultSchema
    top_predictions: List[TopPredictionSchema]
    quality: QualityCheckSchema
    severity_estimate: Optional[float] = None
    severity_label: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class ScanHistoryItemSchema(BaseModel):
    id: UUID
    created_at: datetime
    image_url: str  # Note: normally we'd return a URL, but we'll mock this for now or construct it
    primary_crop: str
    primary_disease: str
    confidence: float
    is_healthy: bool
    
    model_config = ConfigDict(from_attributes=True)

# --- Crop Schemas ---

class CropSchema(BaseModel):
    id: UUID
    name: str
    field_name: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class CropCreateSchema(BaseModel):
    name: str
    field_name: Optional[str] = None
    notes: Optional[str] = None

# --- Disease Knowledge Schemas ---

class DiseaseSchema(BaseModel):
    id: UUID
    name: str
    display_name: str
    crop: str
    description: Optional[str] = None
    symptoms: List[str] = []
    prevention: List[str] = []
    management: List[str] = []
    
    model_config = ConfigDict(from_attributes=True)

# --- General System Schemas ---

class HealthCheckSchema(BaseModel):
    status: str
    model_loaded: bool
    labels_loaded: bool
    num_classes: int
    environment: str

class ErrorResponseSchema(BaseModel):
    detail: str
