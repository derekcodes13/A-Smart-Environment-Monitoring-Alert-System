# backend/app.py
from fastapi import FastAPI, Request
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
import csv, time
import joblib, os

app = FastAPI()
MSG_COUNTER = Counter('ingest_messages_total', 'Number of ingest messages received')

MODEL_PATH = "ml-model/model.joblib"
model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)

@app.post("/ingest")
async def ingest(req: Request):
    payload = await req.json()
    MSG_COUNTER.inc()
    t = time.time()
    with open("data.csv","a") as f:
        writer = csv.writer(f)
        writer.writerow([t, payload.get("temp"), payload.get("hum"), payload.get("mq")])
    # optional: predict risk using model if present
    if model:
        features = [[payload.get("temp"), payload.get("hum"), payload.get("mq")]]
        pred = int(model.predict(features)[0])
    else:
        pred = None
    return {"status":"ok", "pred": pred}

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
