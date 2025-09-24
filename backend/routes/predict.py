from fastapi import APIRouter
import joblib
import numpy as np
import os

router = APIRouter()

# Path to model.joblib (go 1 folder up from backend/, then into ml-model/)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../ml-model/model.joblib")

# Load model
model = joblib.load(MODEL_PATH)

@router.post("/predict")
def predict(data: dict):
    """
    Example request JSON:
    {
        "features": [25, 60, 120]
    }
    """
    features = np.array(data["features"]).reshape(1, -1)
    prediction = model.predict(features)
    return {"prediction": int(prediction[0])}
