import json
import os

NOTEBOOK_PATH = "CropSakha_AI_LeafVision_SIH.ipynb"

def main():
    with open(NOTEBOOK_PATH, "r", encoding="utf-8") as f:
        nb = json.load(f)

    # 1. We will keep cells 0 to 16 (the original ML demo up to the standalone FastAPI server).
    # Actually, let's check if the user wants the ML demo. "analye the .ipynb why there are 2 run fullstack application... Please keep the .ipynb file crystal clear. And must be optimize for colab."
    
    cells = nb['cells']
    
    # Let's find where the first fullstack section starts (Cell 17)
    # We will delete everything from Cell 17 to the end.
    ml_cells = cells[:17]
    
    # Now we build the new, optimized, crystal clear Fullstack Section
    fullstack_cells = []
    
    # --- Cell 1: Markdown Header ---
    fullstack_cells.append({
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "---\n",
            "# 🚀 FULLSTACK APPLICATION RUNNER\n",
            "\n",
            "This final section spins up the entire **CropSakha AI** platform (Next.js UI + FastAPI Backend) right inside this Colab notebook!\n",
            "\n",
            "**Instructions:**\n",
            "1. Configure your API key in the first cell.\n",
            "2. Run all cells sequentially.\n",
            "3. Click the Localtunnel link at the very end to view the live site."
        ]
    })
    
    # --- Cell 2: Essential Inputs (API Keys) ---
    fullstack_cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# 1. 🔑 ESSENTIAL INPUTS: Configure API Keys\n",
            "import os\n",
            "from IPython.display import display, HTML\n",
            "\n",
            "print(\"Checking for GEMINI_API_KEY...\")\n",
            "try:\n",
            "    from google.colab import userdata\n",
            "    GEMINI_API_KEY = userdata.get('GEMINI_API_KEY')\n",
            "    print(\"✅ Successfully loaded GEMINI_API_KEY from Colab Secrets!\")\n",
            "except Exception:\n",
            "    import getpass\n",
            "    print(\"\\n⚠️ No secret found. Please enter your Gemini API Key manually:\")\n",
            "    GEMINI_API_KEY = getpass.getpass()\n",
            "\n",
            "# We will write this to the backend .env file after we clone the repo in the next step.\n",
            "os.environ['TEMP_GEMINI_API_KEY'] = GEMINI_API_KEY\n"
        ]
    })

    # --- Cell 3: Clone & Install Dependencies ---
    fullstack_cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# 2. 📦 CLONE REPOSITORY & INSTALL DEPENDENCIES\n",
            "import os\n",
            "\n",
            "print(\"📥 Cloning Repository...\")\n",
            "if not os.path.exists(\"CropSakha-AI\"):\n",
            "    !git clone -q https://github.com/sumedhgurchal/CropSakha-AI.git\n",
            "else:\n",
            "    print(\"Repository already exists, pulling latest changes...\")\n",
            "    !cd CropSakha-AI && git pull -q\n",
            "\n",
            "%cd CropSakha-AI\n",
            "\n",
            "# Save the API key to the backend env\n",
            "os.makedirs(\"apps/api\", exist_ok=True)\n",
            "with open(\"apps/api/.env\", \"w\") as f:\n",
            "    f.write(f\"GEMINI_API_KEY={os.environ.get('TEMP_GEMINI_API_KEY', '')}\\n\")\n",
            "\n",
            "print(\"\\n📦 Installing Backend Dependencies (FastAPI)...\")\n",
            "!pip install -q fastapi uvicorn python-dotenv google-generativeai pydantic pydantic-settings sqlalchemy alembic python-multipart aiosqlite Pillow numpy opencv-python\n",
            "\n",
            "print(\"\\n📦 Installing Frontend Dependencies (Next.js)... This takes ~1 minute.\")\n",
            "!cd apps/web && npm install --silent\n",
            "!npm install -g localtunnel --silent\n",
            "\n",
            "print(\"\\n✅ All Dependencies Installed!\")\n"
        ]
    })

    # --- Cell 4: Start Servers & Localtunnel ---
    fullstack_cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# 3. 🚀 START SERVERS & EXPOSE TO BROWSER\n",
            "import subprocess\n",
            "import time\n",
            "import urllib.request\n",
            "\n",
            "# Kill existing processes to prevent 'port in use' errors if run multiple times\n",
            "!fuser -k 8000/tcp >/dev/null 2>&1\n",
            "!fuser -k 3000/tcp >/dev/null 2>&1\n",
            "\n",
            "print(\"🟢 Starting FastAPI Backend (Port 8000)...\")\n",
            "backend = subprocess.Popen(\n",
            "    [\"python\", \"-m\", \"uvicorn\", \"apps.api.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"],\n",
            "    stdout=subprocess.DEVNULL,\n",
            "    stderr=subprocess.DEVNULL\n",
            ")\n",
            "\n",
            "print(\"🟢 Building & Starting Next.js UI (Port 3000)... This takes ~1-2 minutes.\")\n",
            "!cd apps/web && npm run build\n",
            "frontend = subprocess.Popen(\n",
            "    [\"npm\", \"start\"],\n",
            "    cwd=\"apps/web\",\n",
            "    stdout=subprocess.DEVNULL,\n",
            "    stderr=subprocess.DEVNULL\n",
            ")\n",
            "\n",
            "time.sleep(5) # Allow servers to bind to ports\n",
            "\n",
            "# Fetch Colab Endpoint IP for Localtunnel Security Checkpoint\n",
            "endpoint_ip = urllib.request.urlopen('https://ipv4.icanhazip.com').read().decode('utf8').strip('\\n')\n",
            "\n",
            "print(\"\\n\" + \"=\"*75)\n",
            "print(\"            🎉 APPLICATION IS LIVE! 🎉\")\n",
            "print(\"=\"*75)\n",
            "print(\"\\n1️⃣  COPY THIS ENDPOINT IP ADDRESS:  \\033[1m\\033[92m\" + endpoint_ip + \"\\033[0m\")\n",
            "print(\"2️⃣  CLICK THE LINK BELOW\")\n",
            "print(\"3️⃣  PASTE THE IP INTO THE TUNNEL WARNING PAGE\")\n",
            "print(\"\\n\" + \"=\"*75 + \"\\n\")\n",
            "\n",
            "# Block execution and keep tunnel open\n",
            "!lt --port 3000\n"
        ]
    })
    
    nb['cells'] = ml_cells + fullstack_cells

    with open(NOTEBOOK_PATH, "w", encoding="utf-8") as f:
        json.dump(nb, f, indent=1)

if __name__ == "__main__":
    main()
