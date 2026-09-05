import os
import subprocess
import sys

def download_plantvillage():
    dataset_dir = os.path.dirname(os.path.abspath(__file__))
    target_dir = os.path.join(dataset_dir, "PlantVillage-Dataset")

    if not os.path.exists(target_dir):
        print("🌾 Downloading full PlantVillage dataset from GitHub mirror...")
        try:
            subprocess.run(
                ["git", "clone", "https://github.com/spMohanty/PlantVillage-Dataset.git"],
                cwd=dataset_dir,
                check=True
            )
            print(f"🪷 Full PlantVillage dataset ready at: {target_dir}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to download dataset: {e}")
            sys.exit(1)
    else:
        print(f"🪷 Dataset already exists at: {target_dir}")

if __name__ == "__main__":
    print("Initializing Dataset Download...")
    download_plantvillage()
