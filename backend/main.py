# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Enable CORS (so frontend can access API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to ["http://localhost:5173"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Root route for quick testing
@app.get("/")
def root():
    return {"message": "Backend (FastAPI) is working 🚀"}

# ✅ Sample emission data
@app.get("/api/emissions")
def get_emissions():
    return [
        {"year": 2020, "value": 120},
        {"year": 2021, "value": 150},
        {"year": 2022, "value": 180},
    ]

# ✅ Sample recycling data
@app.get("/api/recycling")
def get_recycling():
    return [
        {"material": "Aluminium", "percent": 65},
        {"material": "Copper", "percent": 45},
        {"material": "Steel", "percent": 70},
    ]

# ✅ Sample transport data
@app.get("/api/transport")
def get_transport():
    return [
        {"mode": "Truck", "distance": 320},
        {"mode": "Rail", "distance": 220},
        {"mode": "Ship", "distance": 150},
    ]
