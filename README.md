<div align="center">
  <img src="apps/web/public/logo.jpg" alt="CropSakha Logo" width="200" height="200" style="border-radius: 20px;">
  <h1>CropSakha AI</h1>
  <p><strong>Clinical Precision for Crop Health & Disease Surveillance</strong></p>
  <p><i>Where Ancient Indian Wisdom meets Cutting-Edge Artificial Intelligence.</i></p>
</div>

---

## 🪔 Vision & Philosophy

**CropSakha AI** is an advanced agricultural intelligence platform built for Indian farmers. The interface is intentionally designed with an **Ancient Indian Aesthetic**, utilizing sacred symbols (🪔 Diya, ☸️ Dharma, 🛕 Temple, 🌾 Harvest) to create a culturally resonant, intuitive experience while leveraging the most powerful deep learning vision models available.

Built around the core principle: **Detect → Explain → Qualify Uncertainty → Inform → Track**.

---

## ☸️ The Architecture (Hybrid Cloud + Colab)

CropSakha uses a unique hybrid architecture to deliver GPU-accelerated deep learning without heavy cloud hosting costs:

1. **Frontend (Next.js 16 App Router):** A lightning-fast, responsive web UI with text-to-speech accessibility.
2. **Backend API (FastAPI):** High-performance Python backend managing authentication, telemetry, and agricultural databases.
3. **Deep Learning Engine & AI (Gemini + ResNet50):** A massive 38-class LeafVision ResNet-50 model powers the vision, while **Google Gemini** powers the botanical reasoning, Dual-Action Prescriptions, multilingual translations, and interactive chat assistant. 
4. **Google Colab One-Click Fullstack:** The entire project can be spun up inside a free Google Colab instance using Localtunnel to expose the Next.js UI to the public web.

---

## 👁️ Key Features

1. **Vision Leaf Disease Detection**: Rapid classification across 38 PlantVillage crop-disease classes (Tomato, Potato, Corn, Apple, Grape, Pepper, Peach, Orange, Squash, etc.).
2. **Explainable AI (Grad-CAM)**: Generates OpenCV lesion saliency heatmaps overlaid directly onto leaf photos, showing farmers exactly *where* the AI identified pathogen damage.
3. **Dual-Action Prescriptions**: Detailed biological/organic remedies (Neem oil, Trichoderma) and chemical fungicide protocols with exact dilution dosages vetted by agricultural standards.
4. **Multilingual Voice Guidance (Text-To-Speech)**: Inclusive speech audio synthesis reading diagnoses and treatments aloud in **English**, **हिन्दी (Hindi)**, or **मराठी (Marathi)**.
5. **Geospatial Outbreak Telemetry**: Real-time Leaflet radar visualizing active disease clusters across agricultural belts.

---

## 🚀 Quick Start Guide

### 1. One-Click Fullstack Execution (Google Colab)
If you want to run the entire Next.js UI, Python Backend, and Deep Learning model smoothly without setting anything up on your PC, use our Colab launcher!
1. Open [`CropSakha_AI_LeafVision_SIH.ipynb`](./CropSakha_AI_LeafVision_SIH.ipynb) in Google Colab (Ensure Hardware Accelerator is set to T4 GPU).
2. Scroll down to the **"🚀 Run Fullstack Application"** section.
3. In the setup cell, paste your `GEMINI_API_KEY`.
4. Run all cells (`Runtime -> Run all`).
5. Scroll to the very bottom, click the `loca.lt` link, type in the Endpoint IP provided in the cell, and start using the full application!

---

### 2. Run Locally (PC/Mac)

#### 2a. Run the Backend API (FastAPI)
```powershell
# From the project root:
apps\api\.venv\Scripts\python.exe -m uvicorn apps.api.main:app --host 0.0.0.0 --port 8000
```
- API server runs at: `http://localhost:8000`

### 3. Run the Frontend UI (Next.js)
```powershell
cd apps\web
npm run dev
```
- Web application runs at: `http://localhost:3000`

### 2c. Connect the Pipeline
1. Add `GEMINI_API_KEY=your_key` to `apps/api/.env`.
2. Go to `http://localhost:3000/scan`.
3. Upload a leaf image, and witness the power of CropSakha AI and Gemini!