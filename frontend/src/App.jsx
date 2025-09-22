// frontend/src/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";

function App() {
  const [sensorLatest, setSensorLatest] = useState(null);
  const [sensorHistory, setSensorHistory] = useState([]);
  const [emissions, setEmissions] = useState([]);
  const [recycling, setRecycling] = useState([]);
  const [transport, setTransport] = useState([]);

  // fetch static datasets once
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/emissions")
      .then((r) => setEmissions(r.data))
      .catch(console.error);
    axios
      .get("http://localhost:4000/api/recycling")
      .then((r) => setRecycling(r.data))
      .catch(console.error);
    axios
      .get("http://localhost:4000/api/transport")
      .then((r) => setTransport(r.data))
      .catch(console.error);
  }, []);

  // fetch sensor latest + history every 3s
  useEffect(() => {
    const fetchSensor = () => {
      // get latest reading (this endpoint appends a new simulated reading)
      axios
        .get("http://localhost:4000/api/sensor")
        .then((res) => {
          setSensorLatest(res.data);
        })
        .catch((err) => console.error("sensor latest:", err));

      // get history (last N readings)
      axios
        .get("http://localhost:4000/api/sensor/history")
        .then((res) => {
          setSensorHistory(res.data || []);
        })
        .catch((err) => console.error("sensor history:", err));
    };

    fetchSensor();
    const id = setInterval(fetchSensor, 3000);
    return () => clearInterval(id);
  }, []);

  // prepare chart data
  const historyLabels = sensorHistory.map((h) =>
    new Date(h.timestamp).toLocaleTimeString()
  );
  const tempData = sensorHistory.map((h) => h.temperature);
  const humData = sensorHistory.map((h) => h.humidity);
  const aqiData = sensorHistory.map((h) => h.air_quality);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>🌍 Smart Environment Monitoring</h1>

      <div className="card" style={{ maxWidth: 800, margin: "0 auto 20px" }}>
        {sensorLatest ? (
          <>
            <p>
              <strong>🌡️ Temperature:</strong> {sensorLatest.temperature} °C
            </p>
            <p>
              <strong>💧 Humidity:</strong> {sensorLatest.humidity} %
            </p>
            <p>
              <strong>🌍 Air Quality (AQI):</strong> {sensorLatest.air_quality}
            </p>
            <p>
              <small>
                Timestamp: {new Date(sensorLatest.timestamp).toLocaleString()}
              </small>
            </p>
          </>
        ) : (
          <p>Loading sensor data...</p>
        )}
      </div>

      <h2>📊 Live Sensor History</h2>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Line
          data={{
            labels: historyLabels,
            datasets: [
              {
                label: "Temp (°C)",
                data: tempData,
                borderColor: "red",
                fill: false,
              },
              {
                label: "Humidity (%)",
                data: humData,
                borderColor: "blue",
                fill: false,
              },
              {
                label: "AQI",
                data: aqiData,
                borderColor: "green",
                fill: false,
              },
            ],
          }}
        />
      </div>

      <h2 style={{ marginTop: 30 }}>📈 Emissions</h2>
      {emissions.length > 0 ? (
        <div style={{ maxWidth: 700, margin: "10px auto" }}>
          <Line
            data={{
              labels: emissions.map((e) => e.year),
              datasets: [
                {
                  label: "Emissions",
                  data: emissions.map((e) => e.value),
                  borderColor: "orange",
                  fill: true,
                },
              ],
            }}
          />
        </div>
      ) : (
        <p>Loading emissions...</p>
      )}

      <h2 style={{ marginTop: 30 }}>♻️ Recycling</h2>
      {recycling.length > 0 ? (
        <div style={{ maxWidth: 700, margin: "10px auto" }}>
          <Bar
            data={{
              labels: recycling.map((r) => r.material),
              datasets: [
                {
                  label: "Recycling %",
                  data: recycling.map((r) => r.percent),
                  backgroundColor: ["#6ab04c", "#f6b93b", "#54a0ff"],
                },
              ],
            }}
          />
        </div>
      ) : (
        <p>Loading recycling...</p>
      )}

      <h2 style={{ marginTop: 30 }}>🚛 Transport Distances</h2>
      {transport.length > 0 ? (
        <div style={{ maxWidth: 700, margin: "10px auto 40px" }}>
          <Line
            data={{
              labels: transport.map((t) => t.mode),
              datasets: [
                {
                  label: "Distance (km)",
                  data: transport.map((t) => t.distance),
                  borderColor: "#2d98da",
                  fill: true,
                },
              ],
            }}
          />
        </div>
      ) : (
        <p>Loading transport...</p>
      )}
    </div>
  );
}

export default App;
