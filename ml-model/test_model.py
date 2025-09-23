# test_model.py
import joblib
import numpy as np

# Load the trained model
model = joblib.load("model.joblib")

# Example input (change based on your dataset features)
# If your model was trained on [temperature, humidity, AQI]
sample_input = np.array([[25, 60, 120]])  # Example: 25°C, 60% humidity, AQI 120

# Predict
prediction = model.predict(sample_input)

print("Sample Input:", sample_input)
print("Predicted Output:", prediction)
