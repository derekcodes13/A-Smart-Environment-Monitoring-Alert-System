from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    # Generate fake sensor data
    temperature = round(random.uniform(20.0, 35.0), 2)  # °C
    humidity = round(random.uniform(40.0, 80.0), 2)    # %
    air_quality = random.randint(50, 150)  # AQI

    return {
        "temperature": temperature,
        "humidity": humidity,
        "air_quality": air_quality
    }
