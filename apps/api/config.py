"""
CropSakha AI — Configuration
Environment-based settings via pydantic-settings.
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    database_url: str = "sqlite+aiosqlite:///./cropsakha.db"

    # JWT Authentication
    jwt_secret_key: str = "change-this-to-a-random-secret-key-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 1440  # 24 hours

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_cors_origins: str = "http://localhost:3000"

    # ML Model
    ml_model_type: str = "auto"  # auto | leafvision | mobilenet
    ml_confidence_high: float = 0.80
    ml_confidence_medium: float = 0.50
    ml_confidence_low: float = 0.30

    # Image Upload
    max_image_size_mb: int = 10
    upload_dir: str = "./uploads"

    # App
    app_env: str = "development"
    app_debug: bool = True

    # Paths
    project_root: Optional[str] = None

    # API Keys
    gemini_api_key: Optional[str] = None

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.api_cors_origins.split(",")]

    @property
    def max_image_size_bytes(self) -> int:
        return self.max_image_size_mb * 1024 * 1024


settings = Settings()
