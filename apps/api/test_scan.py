import urllib.request
import uuid
import json

boundary = "----WebKitFormBoundary" + uuid.uuid4().hex
with open("apps/web/public/demo/tomato_late_blight.jpg", "rb") as f:
    img_data = f.read()

header = f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"tomato_late_blight.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n"
footer = f"\r\n--{boundary}--\r\n"
body = header.encode("utf-8") + img_data + footer.encode("utf-8")

req = urllib.request.Request(
    "http://localhost:8000/scans/analyze",
    data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    method="POST"
)

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())
    print("STATUS: 200 OK")
    print("Crop:", data["prediction"]["crop"])
    print("Disease:", data["prediction"]["disease"])
    print("Confidence:", data["prediction"]["confidence"])
    print("Severity:", data.get("severity_label"), data.get("severity_estimate"))
    print("Heatmap attached:", bool(data.get("heatmap_base64")))
    print("Organic Treatment:", data.get("treatment_organic", [])[:1])
    print("Chemical Treatment:", data.get("treatment_chemical", [])[:1])
    print("Audio Guidance:", data.get("audio_text"))
