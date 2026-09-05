# CropSakha AI — Architecture

## System Overview

CropSakha AI is an AI-powered crop health intelligence platform that provides
uncertainty-aware disease detection with explainable AI, curated knowledge, and
multilingual support.

**Core Principle:** Detect → Explain → Qualify Uncertainty → Inform → Track

```
                        USER
                         │
                         ▼
                  ┌──────────────┐
                  │  Next.js App │  (apps/web)
                  │  TypeScript  │
                  └──────┬───────┘
                         │ REST API
                         ▼
                  ┌──────────────┐
                  │   FastAPI    │  (apps/api)
                  │   Backend    │
                  └──────┬───────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    ┌───────────┐  ┌───────────┐  ┌───────────┐
    │   Auth    │  │ AI Service│  │   Data    │
    │  (JWT)    │  │           │  │  Service  │
    └───────────┘  └─────┬─────┘  └─────┬─────┘
                         │              │
                    ┌────┴────┐         ▼
                    │         │    ┌──────────┐
                    ▼         ▼    │PostgreSQL│
              ┌─────────┐ ┌─────┐ └──────────┘
              │Inference │ │XAI  │
              │ Service  │ │Grad-│
              └─────────┘ │CAM  │
                    │      └─────┘
                    ▼
              ┌─────────┐
              │Knowledge│
              │ Service │
              └─────────┘
```

---

## Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 14+ / TypeScript | SSR, file-based routing, React ecosystem |
| **Backend** | FastAPI / Python 3.11 | Async, auto-docs, ML ecosystem compatibility |
| **Database** | PostgreSQL | Production-grade, relational, extensible |
| **ORM** | SQLAlchemy 2.0 | Async support, migration tooling |
| **Migrations** | Alembic | Schema versioning |
| **ML Framework** | PyTorch (primary) | LeafVision compatibility |
| **ML Fallback** | TensorFlow/Keras | MobileNetV2 baseline |
| **Primary Model** | LeafVision DINO ViT-B/16 | Domain-specific agricultural SSL |
| **Fallback Model** | MobileNetV2 | Lightweight CPU-friendly |
| **Image Processing** | OpenCV, Pillow | Quality assessment, preprocessing |
| **Auth** | JWT (python-jose) + bcrypt | Stateless, secure |
| **i18n** | JSON translation files | Simple, maintainable |

---

## Project Structure

```
CropSakha AI/
│
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   ├── components/     # UI components
│   │   │   ├── lib/            # Utilities, API client
│   │   │   ├── i18n/           # Translations
│   │   │   └── styles/         # Design system CSS
│   │   └── public/
│   │
│   └── api/                    # FastAPI backend
│       ├── main.py             # App factory
│       ├── config.py           # Environment settings
│       ├── database.py         # PostgreSQL connection
│       ├── models/             # SQLAlchemy ORM
│       ├── schemas/            # Pydantic schemas
│       ├── routers/            # API route modules
│       └── services/           # Business logic
│
├── ml/                         # ML pipeline
│   ├── inference/              # Model inference
│   ├── preprocessing/          # Image processing
│   ├── explainability/         # Grad-CAM
│   ├── evaluation/             # Metrics
│   └── models/                 # Checkpoints + configs
│
├── data/
│   ├── demo/                   # Demo images
│   ├── knowledge/              # Disease knowledge JSON
│   └── schemas/                # Data schemas
│
├── docs/                       # Documentation
├── tests/                      # Test suites
├── docker/                     # Docker configs
├── backend/                    # [PRESERVED] Original CropGuard
└── frontend/                   # [PRESERVED] Original CropGuard
```

---

## Data Flow

### Scan Analysis Flow

```
User uploads image
        │
        ▼
┌───────────────────┐
│  Input Validation  │  MIME type, file size, format
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Quality Check     │  Blur, brightness, resolution
│  (OpenCV)          │  → PASS / FAIL with reason
└────────┬──────────┘
         │ PASS
         ▼
┌───────────────────┐
│  Preprocessing     │  Resize, normalize, color space
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Model Inference   │  LeafVision DINO (GPU/CPU)
│                    │  or MobileNetV2 (CPU fallback)
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Post-processing   │  Top-K extraction
│                    │  Confidence categorization
│                    │  Uncertainty assessment
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Explainability    │  Grad-CAM attention map
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Knowledge Lookup  │  Disease info from knowledge base
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Persist & Return  │  Store in PostgreSQL
│                    │  Return structured result
└───────────────────┘
```

---

## Compute Strategy

| Environment | Model | Framework | Notes |
|------------|-------|-----------|-------|
| Local + GPU | LeafVision DINO ViT-B/16 | PyTorch CUDA | Best quality |
| Local + CPU | MobileNetV2 | TensorFlow | Fast, lightweight |
| Google Colab | LeafVision DINO ViT-B/16 | PyTorch CUDA | For training/evaluation |

**Auto-detection logic:**
1. Check for CUDA GPU → use LeafVision DINO
2. If no GPU → prompt for Google Colab extension
3. If Colab unavailable → fall back to MobileNetV2 on CPU

---

## Database Schema (PostgreSQL)

```sql
-- Core tables
users (id, name, email, password_hash, preferred_language, role, created_at)
crops (id, user_id, name, field_name, created_at)
crop_scans (id, user_id, crop_id, image_path, model_version, primary_prediction,
            confidence, quality_score, severity_estimate, created_at)
predictions (id, scan_id, label, rank, confidence)
diseases (id, name, crop, description, symptoms, causes, favorable_conditions,
          prevention, monitoring, escalation, sources, last_reviewed)
model_versions (id, name, version, architecture, dataset_version, created_at)
feedback (id, scan_id, user_id, rating, expert_confirmed, notes, created_at)
```

---

## API Design

### Public Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | User registration |
| POST | `/auth/login` | JWT login |

### Protected Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/scans/analyze` | Upload + analyze image |
| GET | `/scans` | User's scan history |
| GET | `/scans/{id}` | Scan detail with predictions |
| GET | `/crops` | User's crops |
| POST | `/crops` | Add a crop |
| GET | `/diseases` | Disease library |
| GET | `/diseases/{id}` | Disease detail |
| GET | `/dashboard` | Dashboard summary |
| POST | `/feedback` | Submit feedback |

### Admin Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/statistics` | System statistics |
| GET | `/admin/models` | Model versions |

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#FFFFFF` |
| Primary Text | `#111111` |
| Secondary Text | `#5F6368` |
| Border | `#E5E7EB` |
| Muted Background | `#F8FAFC` |
| Accent | `#2F6B4F` (restrained green) |
| Font | Inter |
| Border Radius | 6–8px |

**Rules:** No gradients. No glassmorphism. No neon. No excessive shadows.
White-first. Information-first. Mobile-first.

---

## Security Architecture

- JWT authentication with bcrypt password hashing
- Protected API routes via FastAPI dependencies
- MIME type + magic byte validation for uploads
- File size limits (10MB)
- Secure filename generation (UUID-based)
- Environment variables for all secrets
- CORS restricted to known origins in production
- No API keys exposed to frontend
