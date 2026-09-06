import json

with open('CropSakha_AI_LeafVision_SIH.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

summary = []
for i, cell in enumerate(nb['cells']):
    source = ''.join(cell.get('source', []))
    summary.append(f"Cell {i} [{cell['cell_type']}]: {source[:100].encode('unicode_escape').decode('utf-8')}")

with open('nb_summary.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(summary))
