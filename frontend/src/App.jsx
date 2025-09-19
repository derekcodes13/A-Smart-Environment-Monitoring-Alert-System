// frontend/src/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [emissions, setEmissions] = useState([]);
  const [recycling, setRecycling] = useState([]);
  const [transport, setTransport] = useState([]);

  useEffect(() => {
    // Fetch emissions
    axios
      .get("http://localhost:4000/api/emissions")
      .then((res) => setEmissions(res.data))
      .catch((err) => console.error("Error fetching emissions:", err));

    // Fetch recycling
    axios
      .get("http://localhost:4000/api/recycling")
      .then((res) => setRecycling(res.data))
      .catch((err) => console.error("Error fetching recycling:", err));

    // Fetch transport
    axios
      .get("http://localhost:4000/api/transport")
      .then((res) => setTransport(res.data))
      .catch((err) => console.error("Error fetching transport:", err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>🌍 Smart Environment Monitoring</h1>

      {/* Emissions Line Chart */}
      <h2>📈 Emissions Over Years</h2>
      {emissions.length > 0 ? (
        <div style={{ width: "650px", margin: "0 auto" }}>
          <Line
            data={{
              labels: emissions.map((e) => e.year),
              datasets: [
                {
                  label: "Emissions",
                  data: emissions.map((e) => e.value),
                  borderColor: "red",
                  backgroundColor: "rgba(255, 0, 0, 0.3)",
                  fill: true,
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
      ) : (
        <p>Loading emissions data...</p>
      )}

      {/* Recycling Bar Chart */}
      <h2>♻️ Recycling Data</h2>
      {recycling.length > 0 ? (
        <div style={{ width: "650px", margin: "0 auto" }}>
          <Bar
            data={{
              labels: recycling.map((r) => r.material),
              datasets: [
                {
                  label: "Recycling %",
                  data: recycling.map((r) => r.percent),
                  backgroundColor: ["green", "orange", "blue"],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
      ) : (
        <p>Loading recycling data...</p>
      )}

      {/* Transport Line Chart */}
      <h2>🚛 Transport Distances</h2>
      {transport.length > 0 ? (
        <div style={{ width: "650px", margin: "0 auto" }}>
          <Line
            data={{
              labels: transport.map((t) => t.mode),
              datasets: [
                {
                  label: "Distance (km)",
                  data: transport.map((t) => t.distance),
                  borderColor: "blue",
                  backgroundColor: "rgba(0, 0, 255, 0.3)",
                  fill: true,
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
      ) : (
        <p>Loading transport data...</p>
      )}
    </div>
  );
}

export default App;
