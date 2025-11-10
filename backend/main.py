from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from datetime import datetime, timedelta
import sqlite3, datetime
from fastapi import BackgroundTasks
import datetime


DB_FILE = "data.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    # Table 1: sensor data
    c.execute('''
        CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            temperature REAL,
            humidity REAL,
            air_quality REAL,
            light REAL,
            timestamp TEXT
        )
    ''')

    # Table 2: alerts
    c.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT,
            level TEXT,
            created_at TEXT
        )
    ''')

    conn.commit()
    conn.close()

init_db()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Example API endpoints
# ----------------------------
@app.get("/")
def read_root():
    return {"message": "Server is running!"}

@app.get("/api/emissions")
def get_emissions():
    # Replace with your real logic
    return {"co2": 123, "methane": 45}

@app.get("/api/transport")
def get_transport():
    # Replace with your real logic
    return {"cars": 50, "buses": 10}

@app.get("/api/recycling")
def get_recycling():
    # Replace with your real logic
    return {"plastic": 30, "paper": 20}

# ----------------------------
# Dummy Sensor Data Endpoints
# ----------------------------
@app.get("/api/sensor")
def get_sensor():
    # Latest sensor readings (dummy)
    return {
        "temperature": 25.3,
        "humidity": 60,
        "air_quality_index": 42,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/sensor/history")
def get_sensor_history():
    # Last 10 sensor readings (dummy)
    history = []
    now = datetime.now()
    for i in range(10):
        history.append({
            "temperature": 25 + i*0.1,
            "humidity": 60 - i*0.5,
            "air_quality_index": 40 + i,
            "timestamp": (now - timedelta(minutes=i*5)).isoformat()
        })
    return history

# ----------------------------
# Commented out ML /predict endpoint
# ----------------------------
"""
import pickle

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

from pydantic import BaseModel

class PredictRequest(BaseModel):
    features: list

@app.post("/predict")
def predict(data: PredictRequest):
    try:
        features = np.array(data.features).reshape(1, -1)
        prediction = model.predict(features)
        return {"prediction": prediction.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
"""
