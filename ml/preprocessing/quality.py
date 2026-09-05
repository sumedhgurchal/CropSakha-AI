"""
CropSakha AI — Image Quality Service
Assesses images for blur, brightness, and resolution before sending to the model.
"""
import io
import cv2
import numpy as np
from PIL import Image

def assess_image_quality(image_bytes: bytes) -> dict:
    """
    Check image quality. 
    Returns dict with score (0-1), pass status, and list of issues.
    """
    issues = []
    
    # 1. Convert bytes to OpenCV format
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {"quality_score": 0.0, "quality_pass": False, "quality_issues": ["Invalid image format"]}
            
        # 2. Resolution check
        h, w = img.shape[:2]
        if w < 224 or h < 224:
            issues.append(f"Image resolution too low ({w}x{h}). Minimum is 224x224.")
            
        # 3. Blur detection (Variance of Laplacian)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        # Threshold depends on image type, ~100 is standard for photos
        if laplacian_var < 50:
            issues.append("Image appears significantly blurred.")
            
        # 4. Brightness check
        mean_brightness = np.mean(gray)
        if mean_brightness < 40:
            issues.append("Image is too dark.")
        elif mean_brightness > 240:
            issues.append("Image is overexposed (too bright).")
            
    except Exception as e:
        issues.append(f"Error analyzing quality: {str(e)}")
        
    # Calculate dummy score based on issues
    score = 1.0 - (len(issues) * 0.25)
    score = max(0.0, score)
    
    return {
        "quality_score": score,
        "quality_pass": len(issues) == 0,
        "quality_issues": issues
    }
