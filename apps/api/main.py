"""
CropSakha AI — FastAPI Main App
"""
import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure root path and apps/api path are accessible
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, "../.."))
if project_root not in sys.path:
    sys.path.insert(0, project_root)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

try:
    from .config import settings
    from .database import init_db, close_db, async_session
    from .routers import scans, auth, dashboard, diseases, maps, weather
except ImportError:
    from config import settings
    from database import init_db, close_db, async_session
    from routers import scans, auth, dashboard, diseases, maps, weather

from ml.inference.service import inference_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    # Startup
    print(f"Starting CropSakha AI in {settings.app_env} mode...")
    
    # Initialize DB schema
    await init_db()
    
    # Auto-seed if database is empty
    try:
        from apps.api.scripts.seed_diseases import seed
        await seed()
    except Exception as e:
        print(f"Startup seeding notice: {e}")
    
    # Initialize ML Models
    print(f"Initializing ML Inference Service (Target: {settings.ml_model_type})...")
    inference_service.initialize()
    
    yield
    
    # Shutdown
    print("Shutting down CropSakha AI...")
    await close_db()


app = FastAPI(
    title="CropSakha AI API",
    description="Early Detection and Management of Crop Diseases",
    version="2.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(scans.router)
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(diseases.router)
app.include_router(maps.router)
app.include_router(weather.router)
try:
    from .routers import assistant
    app.include_router(assistant.router)
except ImportError:
    from routers import assistant
    app.include_router(assistant.router)

@app.get("/")
async def root():
    return {"message": "Welcome to CropSakha AI API"}

@app.get("/health")
async def health_check():
    """Health check showing system and model status."""
    return {
        "status": "ok",
        "environment": settings.app_env,
        "database": "configured",
        "ml": {
            "model_loaded": getattr(inference_service, "model", None) is not None,
            "active_model": inference_service.active_model_name,
            "gpu_available": inference_service.is_gpu_available,
            "classes_loaded": len(inference_service.class_labels) if inference_service.class_labels else 0
        }
    }
