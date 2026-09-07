"""
🪷 CropSakha AI — Server Launcher
Starts the FastAPI backend with correct Python package context.
This ensures all relative imports (from ..database, from ..models, etc.) work properly.

Usage (from project root):
    python launch_server.py
"""
import uvicorn
import os
import sys

# Ensure project root is in Python path
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Change to project root so .env relative paths work
os.chdir(os.path.join(project_root, "apps", "api"))

if __name__ == "__main__":
    uvicorn.run(
        "apps.api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info",
    )
