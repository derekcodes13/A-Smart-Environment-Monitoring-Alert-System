from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from datetime import datetime

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory history store
history = []

@app.get("/")
def read_root():
    # Generate fake sensor data
    temperature = round(random.uniform(20.0, 35.0), 2)  # °C
    humidity = round(random.uniform(40.0, 80.0), 2)    # %
    air_quality = random.randint(50, 150)  # AQI

    data = {
        "temperature": temperature,
        "humidity": humidity,
        "air_quality": air_quality,
        "timestamp": datetime.now().isoformat()
    }

    # Store last 10 readings in history
    history.append(data)
    if len(history) > 10:
        history.pop(0)

    return data

@app.get("/history")
def get_history():
    return history
