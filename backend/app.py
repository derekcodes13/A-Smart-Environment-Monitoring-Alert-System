from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SensorData, SessionLocal

import random

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    db = SessionLocal()

    # Simulate sensor data (replace later with real sensor inputs)
    temperature = round(random.uniform(20, 40), 2)
    humidity = round(random.uniform(30, 90), 2)
    air_quality = random.choice(["Good", "Moderate", "Poor"])

    # Save to DB
    new_entry = SensorData(
        temperature=temperature,
        humidity=humidity,
        air_quality=air_quality
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return {
        "message": "Backend is running successfully 🚀",
        "temperature": temperature,
        "humidity": humidity,
        "air_quality": air_quality,
        "timestamp": new_entry.timestamp
    }
@app.get("/history")
def get_history():
    db = SessionLocal()
    data = db.query(SensorData).order_by(SensorData.timestamp.desc()).limit(20).all()
    return [
        {
            "temperature": d.temperature,
            "humidity": d.humidity,
            "air_quality": d.air_quality,
            "timestamp": d.timestamp
        }
        for d in data
    ]

