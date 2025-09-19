// backend/index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors()); // allow frontend to fetch from backend
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});
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
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
