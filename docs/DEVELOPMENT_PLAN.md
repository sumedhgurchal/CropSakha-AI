# CropSakha AI — Development Plan

**SIH26131: Early Detection and Management of Crop Diseases and Pest Infestations**

---

## Build Strategy

Multi-session incremental development with 4 stages.
Each stage produces a working, testable application.

---

## Stage 1 — Foundation

**Goal:** Working AI pipeline with professional scan UI

**Deliverables:**
1. Project restructure (monorepo layout)
2. Next.js frontend with design system
3. Scan page (crop selector + image upload + quality check)
4. Scan result page (prediction + top-K + confidence badge)
5. FastAPI backend with modular routers
6. PostgreSQL database with core schema
7. LeafVision DINO inference service (with MobileNetV2 CPU fallback)
8. Image quality assessment

**Exit Criteria:**
- Upload image → quality check → AI prediction → result displayed
- Confidence categorized as HIGH/MEDIUM/LOW
- Low-confidence warning shown when appropriate
- Top-3 predictions displayed
- White/minimal clinical UI matching design specification

---

## Stage 2 — Product Features

**Goal:** Complete product with auth, history, knowledge, i18n

**Deliverables:**
1. JWT authentication (register, login, protected routes)
2. Dashboard page (stats, recent scans)
3. Scan history (timeline, filtering, search)
4. My Crops page (crop management)
5. Disease knowledge base (curated JSON-seeded data)
6. Multilingual support (EN / हिं / मर)
7. Feedback system

**Exit Criteria:**
- Full user journey: Register → Login → Dashboard → Scan → History
- Disease information shows curated, cited knowledge
- Language switching works across all pages
- Scan history persists and is filterable

---

## Stage 3 — Differentiation

**Goal:** Explainability, severity, admin panel

**Deliverables:**
1. Grad-CAM / attention visualization
2. Severity estimation (experimental, pixel-ratio method)
3. Admin panel (stats, feedback review, model management)
4. Model versioning (every prediction stores model version)
5. Disease library with search and filtering

**Exit Criteria:**
- Attention map displayed alongside prediction
- Severity marked as "experimental" if using estimation
- Admin can view system statistics and user feedback
- Model version recorded with every scan

---

## Stage 4 — SIH Polish

**Goal:** Demo-ready, documented, tested

**Deliverables:**
1. Demo mode (pre-loaded images, guided flow)
2. Complete documentation suite
3. ML evaluation pipeline (per-class metrics)
4. Test suites (unit, API, inference, frontend)
5. Browser QA (desktop, tablet, mobile)
6. Security hardening
7. Error state UI for all failure modes

**Exit Criteria:**
- 3–5 minute SIH demo executable
- All documentation complete
- Tests passing
- Professional error handling throughout
- Mobile-responsive UI verified

---

## Compute Strategy

```
┌──────────────────────────────────────┐
│           GPU Detection              │
│                                      │
│  CUDA available? ──── YES ──▶ LeafVision DINO ViT-B/16
│       │                       (PyTorch + CUDA)
│       NO
│       │
│  Google Colab ──── YES ──▶ LeafVision DINO ViT-B/16
│  Extension?           (Remote GPU)
│       │
│       NO
│       │
│       ▼
│  MobileNetV2 (TensorFlow, CPU)
│  Lightweight fallback
└──────────────────────────────────────┘
```

---

## Dataset Strategy

| Dataset | Role | When to Use |
|---------|------|------------|
| PlantVillage | Baseline training / benchmark | Stage 1 |
| PlantDoc | Real-world validation | Stage 3 |
| PlantSeg | Disease region segmentation | Stage 3 (if stable) |
| Own field images | Final real-world evaluation | Stage 4 |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| LeafVision weights unavailable | MobileNetV2 fallback always available |
| No local GPU | Google Colab extension OR CPU MobileNetV2 |
| PostgreSQL not running | Docker Compose for local dev |
| Overfit to PlantVillage | PlantDoc validation + field images |
| Fabricated disease facts | Curated JSON knowledge base only |
| Scope creep | 4-stage build with clear exit criteria |

---

## Deployment

- **Development:** Local (localhost)
- **Database:** PostgreSQL via Docker Compose or local install
- **Frontend:** `npm run dev` (Next.js dev server, port 3000)
- **Backend:** `uvicorn` (FastAPI, port 8000)
- **Production path:** Docker Compose with nginx reverse proxy (future)
