# CropSakha AI 🌿

![CropSakha AI Hero](https://via.placeholder.com/1200x400/059669/FFFFFF?text=CropSakha+AI+-+Global+Agricultural+Intelligence)

**CropSakha AI** is an advanced, globally scaled Agricultural Intelligence platform. It leverages state-of-the-art Deep Learning (PyTorch ResNet-50) alongside Computer Vision (OpenCV) morphological fallback engines to diagnose crop diseases, estimate plant biomass, and track geopolitical pathogen outbreaks in real-time.

### 🌐 Live MVP Deployment
The application is connected to Vercel. You can view the live deployment URL directly from your Vercel Dashboard:
**[View your Vercel Dashboard](https://vercel.com/dashboard)**

## ✨ Core Features
- **Comprehensive 24 Indian Languages Support**: The UI and diagnosis engine dynamically adapt to all 24 official Indian languages (Schedule VIII) allowing for truly localized agricultural guidance.
- **Multilingual Voice Interaction (STT & TTS)**: Farmers can click a microphone to speak their symptoms directly (Voice Input) and listen to agronomic advice read back to them in their native language using the Web Speech API.
- **Dual-Engine Disease Classification**: Utilizes a PyTorch ResNet-50 deep neural network backed by a morphological HSV lesion-detection fallback to accurately diagnose 38+ crop conditions.
- **Glassmorphic Modern UI**: Beautifully designed Next.js frontend with Tailwind CSS featuring dynamic blurs, soft glows, and highly responsive auto-fit grid interactions.
- **Gemini 1.5 Pro Botanist Assistant**: Intelligent AI chat module offering tailored, region-specific, biological, and chemical prescriptions for detected diseases.
- **CSIRO Image2Biomass**: Advanced heuristic analysis estimating plant dry/wet matter, chlorophyll levels, and projected yields directly from standard optical imagery.
- **Explainable AI (Grad-CAM)**: Generates heatmaps highlighting the exact necrotized or chlorotic regions of the leaf the neural network is focusing on.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, React 18, Leaflet (Maps), Recharts, TailwindCSS
- **Backend**: FastAPI (Python), SQLAlchemy, SQLite
- **AI / ML**: PyTorch, Transformers, OpenCV, Google Gemini 1.5 API
- **Deployment**: Vercel (Frontend), Cloudflare Tunnels (Backend Proxy)

## 📊 Open Source Datasets
CropSakha AI was built and validated using numerous open-source agricultural datasets:
1. [PlantVillage Dataset (Mendeley)](https://data.mendeley.com/datasets/tywbtsjrjv/1)
2. [PlantDoc Dataset](https://github.com/pratikkayal/PlantDoc-Dataset)
3. [Plant Pathology 2020 FGVC7 (Kaggle)](https://www.kaggle.com/c/plant-pathology-2020-fgvc7/data)
4. [Cassava Leaf Disease Classification](https://www.kaggle.com/competitions/cassava-leaf-disease-classification/data)
5. [Rice Leaf Diseases (Mendeley)](https://data.mendeley.com/datasets/3f83gxmv57/2)
6. [Rice Leaf Diseases (Kaggle)](https://www.kaggle.com/datasets/vbookshelf/rice-leaf-diseases)
7. [DeepWeeds](https://www.kaggle.com/datasets/imsparsh/deepweeds)
8. [PlantifyDR Dataset](https://www.kaggle.com/datasets/lavaman151/plantifydr-dataset)
9. [Cucumber Plant Diseases](https://www.kaggle.com/datasets/kareem3egm/cucumber-plant-diseases-dataset)
10. [Plant Disease Classification Matrix](https://www.kaggle.com/code/vad13irt/plant-disease-classification/input)

## 🚀 Getting Started

### 1. Start the FastAPI Backend
```bash
cd apps/api
# Ensure your .env file is populated with your GEMINI_API_KEY
python launch_server.py
```
The backend will boot up at `http://localhost:8000`.

### 2. Run the Next.js Frontend
```bash
cd apps/web
npm run dev
```
Access the application at `http://localhost:3000`.

---
*Built to empower farmers worldwide with accessible, high-precision agronomic data.*