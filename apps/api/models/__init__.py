"""
CropSakha AI — SQLAlchemy ORM Models
"""

import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, DateTime, 
    ForeignKey, Enum as SQLEnum, JSON
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from ..database import Base


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class ConfidenceLevel(str, enum.Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    preferred_language = Column(String(5), default="en")  # en, hi, mr
    role = Column(SQLEnum(UserRole), default=UserRole.USER)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    crops = relationship("Crop", back_populates="user", cascade="all, delete-orphan")
    scans = relationship("CropScan", back_populates="user", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")


class Crop(Base):
    __tablename__ = "crops"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    field_name = Column(String(200), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="crops")
    scans = relationship("CropScan", back_populates="crop", cascade="all, delete-orphan")


class CropScan(Base):
    __tablename__ = "crop_scans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    crop_id = Column(UUID(as_uuid=True), ForeignKey("crops.id"), nullable=True)
    image_path = Column(String(500), nullable=False)
    image_original_name = Column(String(255), nullable=True)

    # Model info
    model_version = Column(String(100), nullable=True)
    model_architecture = Column(String(100), nullable=True)

    # Primary prediction
    primary_prediction = Column(String(200), nullable=True)
    primary_crop = Column(String(100), nullable=True)
    primary_disease = Column(String(200), nullable=True)
    confidence = Column(Float, nullable=True)
    confidence_level = Column(SQLEnum(ConfidenceLevel), nullable=True)
    is_healthy = Column(Boolean, default=False)

    # Quality
    quality_score = Column(Float, nullable=True)
    quality_pass = Column(Boolean, default=True)
    quality_issues = Column(JSON, nullable=True)  # List of quality issue strings

    # Explainability
    attention_map_path = Column(String(500), nullable=True)
    severity_estimate = Column(Float, nullable=True)
    severity_label = Column(String(50), nullable=True)  # mild, moderate, severe

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="scans")
    crop = relationship("Crop", back_populates="scans")
    predictions = relationship("Prediction", back_populates="scan", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="scan", cascade="all, delete-orphan")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(UUID(as_uuid=True), ForeignKey("crop_scans.id"), nullable=False)
    label = Column(String(200), nullable=False)
    crop_name = Column(String(100), nullable=True)
    disease_name = Column(String(200), nullable=True)
    rank = Column(Integer, nullable=False)  # 1, 2, 3 etc.
    confidence = Column(Float, nullable=False)

    # Relationships
    scan = relationship("CropScan", back_populates="predictions")


class Disease(Base):
    __tablename__ = "diseases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False, unique=True)
    display_name = Column(String(200), nullable=False)
    crop = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    symptoms = Column(JSON, nullable=True)  # List of symptom strings
    causes = Column(Text, nullable=True)
    favorable_conditions = Column(Text, nullable=True)
    prevention = Column(JSON, nullable=True)  # List of prevention tips
    management = Column(JSON, nullable=True)  # List of management strategies
    treatment_organic = Column(JSON, nullable=True)  # Organic remedies
    treatment_chemical = Column(JSON, nullable=True)  # Chemical remedies with dosage
    regional_names = Column(JSON, nullable=True)  # Hindi and Marathi names
    monitoring = Column(Text, nullable=True)
    escalation = Column(Text, nullable=True)
    sources = Column(JSON, nullable=True)  # List of source URLs/citations
    last_reviewed = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)



class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    version = Column(String(50), nullable=False)
    architecture = Column(String(100), nullable=False)
    framework = Column(String(50), nullable=False)  # pytorch, tensorflow
    dataset_version = Column(String(100), nullable=True)
    accuracy = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(UUID(as_uuid=True), ForeignKey("crop_scans.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    is_correct = Column(Boolean, nullable=True)
    correct_disease = Column(String(200), nullable=True)
    notes = Column(Text, nullable=True)
    expert_confirmed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    scan = relationship("CropScan", back_populates="feedbacks")
    user = relationship("User", back_populates="feedbacks")
