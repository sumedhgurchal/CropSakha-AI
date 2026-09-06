import json

with open('CropSakha_AI_LeafVision_SIH.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for i in range(15, 26):
    print(f"--- CELL {i} ---")
    source = "".join(nb['cells'][i].get('source', []))
    print(source.encode('unicode_escape').decode('utf-8'))
