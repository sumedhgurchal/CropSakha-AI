import json
import os

NOTEBOOK_PATH = "CropSakha_AI_LeafVision_SIH.ipynb"

def main():
    with open(NOTEBOOK_PATH, "r", encoding="utf-8") as f:
        nb = json.load(f)

    # Find and update the API Key cell
    for cell in nb['cells']:
        if cell['cell_type'] == 'code' and any("GEMINI_API_KEY =" in line for line in cell['source']):
            cell['source'] = [
                "# 2. Setup Gemini API Key\n",
                "import os\n",
                "try:\n",
                "    from google.colab import userdata\n",
                "    print(\"🔑 Fetching GEMINI_API_KEY from Google Colab Secrets...\")\n",
                "    GEMINI_API_KEY = userdata.get('GEMINI_API_KEY')\n",
                "except Exception:\n",
                "    import getpass\n",
                "    print(\"🔑 Enter your Gemini API Key (Required for Dual-Action Prescriptions):\")\n",
                "    GEMINI_API_KEY = getpass.getpass()\n",
                "\n",
                "# Write to the FastAPI environment file\n",
                "os.makedirs(\"apps/api\", exist_ok=True)\n",
                "with open(\"apps/api/.env\", \"w\") as f:\n",
                "    f.write(f\"GEMINI_API_KEY={GEMINI_API_KEY}\\n\")\n",
                "    \n",
                "print(\"✅ API Key Configured!\")"
            ]
            break

    with open(NOTEBOOK_PATH, "w", encoding="utf-8") as f:
        json.dump(nb, f, indent=1)

if __name__ == "__main__":
    main()
