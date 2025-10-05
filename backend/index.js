// backend/index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

<<<<<<< HEAD
app.use(cors()); // allow frontend to fetch from backend
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});
=======
app.use(cors());
app.use(express.json());

// Simple in-memory sensor history (last 20 readings)
const sensorHistory = [];

// Helper: generate a fake sensor reading
function generateSensorReading() {
  const temperature = +(20 + Math.random() * 15).toFixed(2); // 20-35°C
  const humidity = +(35 + Math.random() * 50).toFixed(2); // 35-85%
  const air_quality = Math.floor(50 + Math.random() * 150); // 50-200 AQI
  const timestamp = new Date().toISOString();
  return { temperature, humidity, air_quality, timestamp };
}

// Root route
app.get("/", (req, res) => {
  res.send("Backend (Express) is working 🚀");
});

// Sensor endpoints
app.get("/api/sensor", (req, res) => {
  // Create a new simulated reading and push to history
  const reading = generateSensorReading();
  sensorHistory.push(reading);
  if (sensorHistory.length > 20) sensorHistory.shift();
  res.json(reading);
});

app.get("/api/sensor/history", (req, res) => {
  // Return last readings (oldest -> newest)
  res.json(sensorHistory.slice());
});

>>>>>>> dev
// Sample emission data
app.get("/api/emissions", (req, res) => {
  res.json([
    { year: 2020, value: 120 },
    { year: 2021, value: 150 },
    { year: 2022, value: 180 },
  ]);
});

// Sample recycling data
app.get("/api/recycling", (req, res) => {
  res.json([
    { material: "Aluminium", percent: 65 },
    { material: "Copper", percent: 45 },
    { material: "Steel", percent: 70 },
  ]);
});

// Sample transport data
app.get("/api/transport", (req, res) => {
  res.json([
    { mode: "Truck", distance: 320 },
    { mode: "Rail", distance: 220 },
    { mode: "Ship", distance: 150 },
  ]);
});

app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`✅ Backend running on http://localhost:${PORT}`);
=======
  console.log(`✅ Express backend running on http://localhost:${PORT}`);
>>>>>>> dev
});
