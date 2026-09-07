import google.generativeai as genai
import json
import logging
from typing import Dict, Any

from apps.api.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.is_configured = bool(self.api_key)
        if self.is_configured:
            genai.configure(api_key=self.api_key)
            # Use gemini-1.5-pro for complex reasoning
            self.model = genai.GenerativeModel('gemini-1.5-pro-latest')
            self.flash_model = genai.GenerativeModel('gemini-1.5-flash-latest')
        else:
            logger.warning("GEMINI_API_KEY is not set. Gemini features will be disabled.")

    async def generate_prescriptions(self, crop: str, disease: str, severity: str) -> Dict[str, Any]:
        """
        Generates Dual-Action Prescriptions (Biological and Chemical) in multiple languages.
        """
        if not self.is_configured:
            return self._get_fallback_prescriptions(crop, disease)

        prompt = f"""
        You are an expert botanical pathologist and agronomist in India.
        A farmer has scanned their {crop} crop and the AI detected '{disease}' with a severity of '{severity}'.
        
        Provide a highly accurate, Dual-Action Prescription.
        Return the output EXACTLY as a JSON object with this structure:
        {{
            "english": {{
                "biological": "Organic/Biological remedy details with dosage",
                "chemical": "Chemical fungicide/pesticide details with exact dilution dosages"
            }},
            "hindi": {{
                "biological": "...",
                "chemical": "..."
            }},
            "marathi": {{
                "biological": "...",
                "chemical": "..."
            }}
        }}
        Make sure the language translations are completely fluent and use appropriate agricultural terminology.
        Do NOT wrap the output in markdown code blocks, just raw JSON.
        """
        
        try:
            response = self.model.generate_content(prompt)
            # Clean up potential markdown formatting from Gemini response
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:]
            if text.startswith('```'):
                text = text[3:]
            if text.endswith('```'):
                text = text[:-3]
                
            return json.loads(text.strip())
        except Exception as e:
            logger.error(f"Gemini prescription generation failed: {e}")
            return self._get_fallback_prescriptions(crop, disease)

    async def enhance_biomass_estimation(self, crop: str, base_metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Uses Gemini to validate and enhance OpenCV heuristic biomass calculations for realism.
        """
        if not self.is_configured:
            return base_metrics

        prompt = f"""
        You are an expert agronomist AI utilizing a CSIRO-inspired Image2Biomass algorithm.
        Here are the baseline heuristic metrics calculated from a leaf scan of {crop}:
        {json.dumps(base_metrics, indent=2)}

        Based on these metrics, validate and adjust the biomass, yield projection, and plant health numbers to make them realistically accurate for a typical field environment.
        Ensure the output values make logical sense for a '{crop}'.
        
        Return the output EXACTLY as a JSON object matching the input structure, but with your adjusted values and an added field "ai_insight" explaining your adjustments briefly.
        Do NOT wrap the output in markdown code blocks, just raw JSON.
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:]
            if text.startswith('```'):
                text = text[3:]
            if text.endswith('```'):
                text = text[:-3]
                
            enhanced_metrics = json.loads(text.strip())
            enhanced_metrics["biomass_model_benchmark"] = "Gemini Enhanced CSIRO-inspired Model"
            return enhanced_metrics
        except Exception as e:
            logger.error(f"Gemini biomass enhancement failed: {e}")
            return base_metrics

    async def chat(self, message: str, context: str) -> str:
        """
        Interactive AI chat assistant logic.
        """
        if not self.is_configured:
            return "Gemini AI is currently not configured. Please add your API key."
            
        prompt = f"""
        Context: {context}
        User: {message}
        
        You are CropSakha AI, an expert agricultural assistant. Answer the user's question concisely and accurately based on the context provided.
        """
        try:
            response = self.flash_model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini chat failed: {e}")
            return "I'm having trouble connecting to my AI brain right now."

    def _get_fallback_prescriptions(self, crop: str, disease: str) -> Dict[str, Any]:
        return {
            "english": {
                "biological": "Apply Neem oil (10,000 ppm) at 2ml/litre water. Spray early morning.",
                "chemical": "Spray Copper Oxychloride 50% WP at 2.5g/litre water if symptoms persist."
            },
            "hindi": {
                "biological": "नीम का तेल (10,000 ppm) 2ml/लीटर पानी में मिलाकर सुबह जल्दी छिड़काव करें।",
                "chemical": "यदि लक्षण बने रहते हैं तो कॉपर ऑक्सीक्लोराइड 50% WP का 2.5g/लीटर पानी में छिड़काव करें।"
            },
            "marathi": {
                "biological": "निंबोळी अर्क (10,000 ppm) 2 मिली/लिटर पाण्यात मिसळून सकाळी लवकर फवारणी करा.",
                "chemical": "लक्षणे राहिल्यास कॉपर ऑक्सीक्लोराईड ५०% WP २.५ ग्रॅम/लिटर पाण्यात मिसळून फवारा."
            }
        }

gemini_service = GeminiService()
