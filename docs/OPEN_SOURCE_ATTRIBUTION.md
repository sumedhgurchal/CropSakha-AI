# Open-Source Attribution

CropSakha AI is built upon and acknowledges the following open-source projects, datasets, and research.

---

## Application Foundation

### CropGuard AI
- **Repository:** [ajinesh703/crop-disease-detection](https://github.com/ajinesh703/crop-disease-detection)
- **Author:** ajinesh703
- **License:** Not explicitly specified in repository
- **What we use:** Application architecture patterns, class label taxonomy, API structure
- **Significant changes:** Complete UI redesign, backend restructure, new ML pipeline, database integration, authentication, i18n, explainability
- **Attribution required:** Yes — original project acknowledged as foundation

---

## AI Foundation Model

### LeafVision
- **Repository:** [LABA-SNU/LeafVision](https://github.com/LABA-SNU/LeafVision)
- **Authors:** Yunseok Han, Woosang Jeon, Taehyeong Kim (Seoul National University)
- **License:** To be verified
- **Description:** Self-supervised agricultural vision foundation model pretrained on 540,013 leaf images using DINO across ResNets, EfficientNets, and ViTs
- **What we use:** DINO ViT-B/16 pretrained checkpoint for feature extraction
- **Citation:** Han, Y., Jeon, W., & Kim, T. LeafVision: Self-Supervised Agricultural Vision Foundation Models for Plant Disease Classification.

---

## Datasets

### PlantVillage
- **Repository:** [spMohanty/PlantVillage-Dataset](https://github.com/spMohanty/PlantVillage-Dataset)
- **License:** CC0 / Public Domain (commonly referenced)
- **Description:** ~54,000 leaf images, 14 crop species, 38 classes
- **What we use:** Baseline training and controlled benchmark
- **Citation:** Hughes, D. P., & Salathé, M. (2015). An open access repository of images on plant health to enable the development of mobile disease diagnostics.

### PlantDoc
- **Repository:** [pratikkayal/PlantDoc-Dataset](https://github.com/pratikkayal/PlantDoc-Dataset)
- **License:** CC BY 4.0
- **Description:** 2,598 real-world plant disease images, 13 species, 17 classes
- **What we use:** Real-world validation, robustness testing
- **Attribution required:** Yes — CC BY 4.0 requires attribution
- **Citation:** Singh, D., Jain, N., Jain, P., Kayal, P., Kumawat, S., & Batra, N. (2020). PlantDoc: A Dataset for Visual Plant Disease Detection. CODS-COMAD 2020.

### PlantSeg (planned)
- **Repository:** [tqwei05/PlantSeg](https://github.com/tqwei05/PlantSeg)
- **License:** To be verified
- **Description:** 11,400+ in-the-wild images covering 115 plant diseases with segmentation annotations
- **What we use:** Disease region segmentation (Stage 3)
- **Note:** Not the SNZLab/PlantSeg microscopy project

---

## Software Dependencies

| Package | License | Usage |
|---------|---------|-------|
| FastAPI | MIT | Backend API framework |
| Next.js | MIT | Frontend framework |
| React | MIT | UI library |
| TypeScript | Apache-2.0 | Type safety |
| PyTorch | BSD-3-Clause | ML framework (primary) |
| TensorFlow | Apache-2.0 | ML framework (fallback) |
| OpenCV | Apache-2.0 | Image processing |
| Pillow | PIL Software License | Image I/O |
| SQLAlchemy | MIT | Database ORM |
| Alembic | MIT | Database migrations |
| asyncpg | Apache-2.0 | PostgreSQL driver |
| uvicorn | BSD-3-Clause | ASGI server |
| python-jose | MIT | JWT authentication |
| passlib | BSD | Password hashing |
| NumPy | BSD-3-Clause | Numerical computing |

---

## Important Notes

1. **No code was directly copied** from external repositories without modification and attribution.
2. **Disease knowledge** in the knowledge base is curated from publicly available agricultural sources and cited per entry.
3. **Model weights** are loaded from published pretrained checkpoints; no proprietary models are redistributed.
4. **License compliance** must be verified for LeafVision and PlantSeg before final SIH submission — create `docs/LICENSE_AUDIT.md` when licenses are confirmed.

---

*Last updated: 2026-08-31*
