import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";

const BASE_URL = "http://localhost:8000";

function App() {
  const [emissions, setEmissions] = useState([]);
  const [recycling, setRecycling] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [history, setHistory] = useState([]);
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [airQuality, setAirQuality] = useState("");
  const [lightIntensity, setLightIntensity] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [emissionsRes, recyclingRes, sensorRes, historyRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/emissions`),
        axios.get(`${BASE_URL}/api/recycling`),
        axios.get(`${BASE_URL}/api/sensor`),
        axios.get(`${BASE_URL}/api/sensor/history`),
      ]);

      setEmissions(Array.isArray(emissionsRes.data) ? emissionsRes.data : []);
      setRecycling(Array.isArray(recyclingRes.data) ? recyclingRes.data : []);
      setSensorData(Array.isArray(sensorRes.data) ? sensorRes.data : []);
      setHistory(Array.isArray(historyRes.data) ? historyRes.data : []);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    try {
      const res = await fetch(`${BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: [
            parseFloat(temperature || 0),
            parseFloat(humidity || 0),
            parseFloat(airQuality || 0),
            parseFloat(lightIntensity || 0),
          ],
        }),
      });

      const data = await res.json();
      setPrediction(data.prediction || JSON.stringify(data));
    } catch (err) {
      console.error("Error predicting:", err);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0078D7, #00BCD4)",
          color: "white",
          fontFamily: "Poppins, sans-serif",
          fontSize: "1.5rem",
        }}
      >
        🔄 Loading data, please wait...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0078D7, #00BCD4)",
        color: "white",
        padding: "2rem",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "2.8rem", marginBottom: "1rem" }}>
        🌍 Smart Environment Monitoring & Alert System
      </h1>

      <p style={{ textAlign: "center", fontSize: "1.1rem", opacity: 0.9 }}>
        Real-time environmental data visualization & AI predictions
      </p>

      {/* Live Sensor Data Cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {sensorData.length > 0 ? (
          <>
            <MetricCard title="🌡️ Temperature" value={`${sensorData[0].temperature} °C`} />
            <MetricCard title="💧 Humidity" value={`${sensorData[0].humidity} %`} />
            <MetricCard title="🌫️ Air Quality" value={`${sensorData[0].air_quality || 0}`} />
            <MetricCard
              title="💡 Light"
              value={`${sensorData[0].light || sensorData[0].lightIntensity || "N/A"} lux`}
            />
          </>
        ) : (
          <p style={{ fontSize: "1.2rem", textAlign: "center" }}>No live data yet.</p>
        )}
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "2rem",
          marginTop: "3rem",
        }}
      >
        <ChartCard title="CO₂ Emissions">
          <Bar
            data={{
              labels: (emissions || []).map((e) => e.country || "N/A"),
              datasets: [
                {
                  label: "Emissions (tons)",
                  data: (emissions || []).map((e) => e.value || 0),
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 10,
                },
              ],
            }}
            options={{
              plugins: { legend: { labels: { color: "white" } } },
              scales: {
                x: { ticks: { color: "white" } },
                y: { ticks: { color: "white" } },
              },
            }}
          />
        </ChartCard>

        <ChartCard title="Recycling Rate">
          <Line
            data={{
              labels: (recycling || []).map((r) => r.year || "N/A"),
              datasets: [
                {
                  label: "Recycling (%)",
                  data: (recycling || []).map((r) => r.value || 0),
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.3)",
                  fill: true,
                  tension: 0.3,
                },
              ],
            }}
            options={{
              plugins: { legend: { labels: { color: "white" } } },
              scales: {
                x: { ticks: { color: "white" } },
                y: { ticks: { color: "white" } },
              },
            }}
          />
        </ChartCard>

        <ChartCard title="Sensor History (Temperature & Humidity)">
          <Line
            data={{
              labels: (history || []).map((h) => h.timestamp || ""),
              datasets: [
                {
                  label: "Temperature (°C)",
                  data: (history || []).map((h) => h.temperature || 0),
                  borderColor: "#FFD700",
                  tension: 0.3,
                  fill: false,
                },
                {
                  label: "Humidity (%)",
                  data: (history || []).map((h) => h.humidity || 0),
                  borderColor: "#00FFCC",
                  tension: 0.3,
                  fill: false,
                },
              ],
            }}
            options={{
              plugins: { legend: { labels: { color: "white" } } },
              scales: {
                x: { ticks: { color: "white" } },
                y: { ticks: { color: "white" } },
              },
            }}
          />
        </ChartCard>
      </div>

      {/* Prediction */}
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          padding: "2rem",
          borderRadius: "1.5rem",
          marginTop: "3rem",
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>🤖 AI Prediction Model</h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", justifyContent: "center" }}>
          <input className="input" type="number" placeholder="Temperature" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
          <input className="input" type="number" placeholder="Humidity" value={humidity} onChange={(e) => setHumidity(e.target.value)} />
          <input className="input" type="number" placeholder="Air Quality" value={airQuality} onChange={(e) => setAirQuality(e.target.value)} />
          <input className="input" type="number" placeholder="Light Intensity" value={lightIntensity} onChange={(e) => setLightIntensity(e.target.value)} />
        </div>

        <button
          onClick={handlePredict}
          style={{
            marginTop: "1.5rem",
            background: "#FFD700",
            color: "#000",
            border: "none",
            padding: "0.8rem 1.5rem",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Predict
        </button>

        {prediction && (
          <h3 style={{ textAlign: "center", marginTop: "1rem", color: "#fff" }}>
            🌤️ Predicted Environmental Category: <span style={{ color: "#FFD700" }}>{prediction}</span>
          </h3>
        )}
      </div>
    </div>
  );
}

const MetricCard = ({ title, value }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.2)",
      padding: "1.5rem",
      borderRadius: "1rem",
      minWidth: "160px",
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      backdropFilter: "blur(6px)",
    }}
  >
    <h3 style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>{title}</h3>
    <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FFD700" }}>{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.15)",
      padding: "1.5rem",
      borderRadius: "1rem",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    }}
  >
    <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{title}</h2>
    {children}
  </div>
);

export default App;
