# CropSakha AI — Codebase Audit

**Audit Date:** 2026-08-31
**Source Repository:** [ajinesh703/crop-disease-detection](https://github.com/ajinesh703/crop-disease-detection)
**Original Name:** CropGuard AI

---

## 1. Existing Repository Structure

```
crop-disease-detection/
├── backend/
│   ├── main.py                 # FastAPI server (single file, 193 lines)
│   ├── train_model.py          # MobileNetV2 training script (2-phase)
│   ├── crop_disease_model.h5   # Trained model (26.3 MB)
│   ├── class_labels.json       # 38 class index → crop/disease mapping
│   ├── download_images.py      # Bing image downloader utility
│   ├── requirements.txt        # Python dependencies
│   └── PlantVillage-Dataset/   # Dataset directory (cloned separately)
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Main React component (338 lines, single-file app)
│   │   ├── App.css             # All styles (12.8 KB)
│   │   ├── index.css           # CSS variables + global styles (3.3 KB)
│   │   └── main.tsx            # React entry point
│   ├── package.json            # Vite + React + TypeScript
│   ├── vite.config.ts
│   └── tsconfig.json
├── screenshots/                # UI screenshots
├── README.md                   # Project documentation
└── screenshot_home.png         # Hero screenshot
```

---

## 2. Frontend Technology

| Attribute | Value |
|-----------|-------|
| Framework | React 18 |
| Language | TypeScript 5.x |
| Build Tool | Vite |
| Styling | Vanilla CSS (dark theme) |
| Components | Single `App.tsx` (monolith) |
| State | React useState hooks |
| Routing | None (single page) |
| API Client | Native fetch |
| i18n | None |
| Testing | None configured |

### Frontend Observations

- **Single-file architecture**: Entire app in one `App.tsx` — upload, result display, crops listing
- **Dark theme**: CSS variables define a dark background + gradient aesthetic
- **Drag-and-drop**: File upload with type/size validation (10MB max)
- **Top-3 predictions**: Displays alternative predictions with confidence bars
- **Low confidence guard**: Handled via backend response, displayed as error
- **No routing**: No page navigation — everything on one page
- **No authentication**: No user system
- **No persistence**: Results not stored

---

## 3. Backend Technology

| Attribute | Value |
|-----------|-------|
| Framework | FastAPI 0.104.1 |
| Language | Python 3.11 |
| Server | Uvicorn 0.24.0 |
| ML Framework | TensorFlow 2.15.0 |
| Image Processing | Pillow 10.1.0 |
| Database | None |
| Authentication | None |
| File Storage | None (in-memory processing) |

### Backend Observations

- **Single-file API**: All logic in `main.py` (193 lines)
- **Global model loading**: Model loaded once at startup via lifespan
- **3 endpoints**: `/health`, `/crops`, `/predict`
- **CORS**: Wide open (`allow_origins=["*"]`)
- **No database**: Predictions not stored
- **No authentication**: No user system
- **Image validation**: MIME type check only (no quality assessment)

---

## 4. Current Model Architecture

| Attribute | Value |
|-----------|-------|
| Architecture | MobileNetV2 (transfer learning) |
| Framework | TensorFlow/Keras |
| Input Size | 224×224×3 |
| Output Classes | 38 |
| Model File | `crop_disease_model.h5` (26.3 MB) |
| Training | 2-phase (10 epochs frozen + 10 epochs fine-tuned top 30 layers) |
| Claimed Accuracy | 96%+ validation accuracy |
| Confidence Threshold | 0.5 (50%) |

### Model Input Requirements

- RGB image
- Resized to 224×224
- Normalized to [0, 1] range
- Batch dimension added

---

## 5. Class Labels

38 classes covering **14 crop species** and **26 diseases + healthy states**:

| Crop | Disease Classes |
|------|----------------|
| Apple | Apple_scab, Black_rot, Cedar_apple_rust, healthy |
| Blueberry | healthy |
| Cherry | Powdery_mildew, healthy |
| Corn (maize) | Cercospora_leaf_spot, Common_rust, Northern_Leaf_Blight, healthy |
| Grape | Black_rot, Esca_(Black_Measles), Leaf_blight, healthy |
| Orange | Haunglongbing_(Citrus_greening) |
| Peach | Bacterial_spot, healthy |
| Pepper (bell) | Bacterial_spot, healthy |
| Potato | Early_blight, Late_blight, healthy |
| Raspberry | healthy |
| Soybean | healthy |
| Squash | Powdery_mildew |
| Strawberry | Leaf_scorch, healthy |
| Tomato | Bacterial_spot, Early_blight, Late_blight, Leaf_Mold, Septoria_leaf_spot, Spider_mites, Target_Spot, Yellow_Leaf_Curl_Virus, Tomato_mosaic_virus, healthy |

---

## 6. Existing Datasets

- **PlantVillage**: ~54,000 leaf images, 38 classes, laboratory-controlled conditions
- **Limitation**: Lab images only — does not represent real-world farmer photographs

---

## 7. API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check + model status |
| GET | `/crops` | All supported crops and diseases |
| POST | `/predict` | Upload image → disease prediction |

---

## 8. Database

**None.** No persistence layer exists.

---

## 9. Image Storage

**None.** Images are processed in memory and discarded.

---

## 10. Current UI

- Dark gradient background
- Single-page application
- Drag-and-drop upload zone
- Side-by-side preview + result layout
- Confidence bar visualization
- Top-3 predictions list
- Crops/diseases listing section

---

## 11. Existing Features

- [x] Image upload (drag-and-drop + file picker)
- [x] File type validation (MIME)
- [x] File size validation (10MB)
- [x] MobileNetV2 inference
- [x] Top-3 predictions with confidence
- [x] Low-confidence rejection (< 50%)
- [x] Supported crops listing
- [x] Health check endpoint

---

## 12. Existing Limitations

1. **No image quality assessment** — no blur, brightness, or resolution checks
2. **No uncertainty quantification** — raw softmax confidence only
3. **No explainability** — no Grad-CAM or attention visualization
4. **No disease information** — predictions have no associated knowledge
5. **No scan history** — results are ephemeral
6. **No authentication** — no user system
7. **No multilingual support** — English only
8. **No database** — no persistence
9. **No model versioning** — model version not tracked with predictions
10. **Single-page UI** — no navigation, dashboard, or separate views
11. **Lab-only training data** — PlantVillage does not represent field conditions
12. **MobileNetV2 only** — no domain-specific pretrained model
13. **No severity estimation** — confidence ≠ severity
14. **No admin panel** — no system management interface
15. **Overclaims accuracy** — "96%+ accuracy" without proper evaluation context

---

## 13. Existing Tests

**None.** No test files exist in the repository.

---

## 14. Security Concerns

1. CORS allows all origins
2. No authentication or authorization
3. No rate limiting
4. No input sanitization beyond MIME check
5. No secure file handling (filenames not sanitized)
6. API keys/secrets not managed via environment variables
7. Model file served from application directory

---

## 15. License Information

- **Repository**: No LICENSE file found in the cloned repository
- **PlantVillage dataset**: Generally considered public domain / CC0
- **TensorFlow/MobileNetV2**: Apache 2.0
- **FastAPI**: MIT
- **React**: MIT
- **Vite**: MIT

> [!WARNING]
> The original CropGuard repository does not include an explicit LICENSE file. Attribution should be maintained regardless.

---

## 16. Recommended Upgrade Plan

### Preserve
- Class labels taxonomy (38 classes)
- API response structure (top-3 predictions)
- Backend inference pattern (load once, serve many)
- MobileNetV2 model as fallback

### Replace
- Frontend: React/Vite → Next.js + TypeScript
- UI: Dark theme → White/minimal clinical design
- ML: Add LeafVision DINO ViT-B/16 as primary model
- Backend: Single-file → modular FastAPI with routers
- Database: None → PostgreSQL
- Auth: None → JWT authentication

### Add
- Image quality assessment (blur, brightness, resolution)
- Uncertainty quantification (HIGH/MEDIUM/LOW)
- Explainable AI (Grad-CAM / attention maps)
- Disease knowledge base
- Scan history + crop tracking
- Multilingual support (EN/HI/MR)
- Admin panel
- Model versioning
- Demo mode
- Comprehensive documentation
