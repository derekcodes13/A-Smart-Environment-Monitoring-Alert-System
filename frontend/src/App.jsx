import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";

// ✅ Base URL for your Render backend
const BASE_URL =
  "https://a-smart-environment-monitoring-alert-miqv.onrender.com";

function App() {
  const [emissions, setEmissions] = useState([]);
  const [recycling, setRecycling] = useState([]);
  const [transport, setTransport] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [history, setHistory] = useState([]);
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [airQuality, setAirQuality] = useState("");
  const [lightIntensity, setLightIntensity] = useState("");
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const emissionsRes = await axios.get(`${BASE_URL}/api/emissions`);
      const recyclingRes = await axios.get(`${BASE_URL}/api/recycling`);
      const transportRes = await axios.get(`${BASE_URL}/api/transport`);
      const sensorRes = await axios.get(`${BASE_URL}/api/sensor`);
      const historyRes = await axios.get(`${BASE_URL}/api/sensor/history`);

      setEmissions(emissionsRes.data);
      setRecycling(recyclingRes.data);
      setTransport(transportRes.data);
      setSensorData(sensorRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handlePredict = async () => {
    try {
      const res = await fetch(`${BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: [
            parseFloat(temperature),
            parseFloat(humidity),
            parseFloat(airQuality),
            parseFloat(lightIntensity),
          ],
        }),
      });

      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      console.error("Error predicting:", err);
    }
  };

  return (
    <div className="App">
      <h1>🌍 Smart Environment Monitoring & Alert System</h1>

      <section className="charts">
        <div className="chart">
          <h2>CO₂ Emissions</h2>
          <Bar
            data={{
              labels: emissions.map((e) => e.country),
              datasets: [
                {
                  label: "Emissions (tons)",
                  data: emissions.map((e) => e.value),
                },
              ],
            }}
          />
        </div>

        <div className="chart">
          <h2>Recycling Rate</h2>
          <Line
            data={{
              labels: recycling.map((r) => r.year),
              datasets: [
                {
                  label: "Recycling (%)",
                  data: recycling.map((r) => r.value),
                },
              ],
            }}
          />
        </div>
      </section>

      <section className="sensor-section">
        <h2>Real-Time Sensor Data</h2>
        <ul>
          {sensorData.map((data, index) => (
            <li key={index}>
              🌡️ {data.temperature}°C | 💧 {data.humidity}% | 🌫️ AQI:{" "}
              {data.airQuality} | 💡 Light: {data.lightIntensity} lux
            </li>
          ))}
        </ul>
      </section>

      <section className="history-section">
        <h2>Sensor History</h2>
        <Line
          data={{
            labels: history.map((h) => h.timestamp),
            datasets: [
              {
                label: "Temperature (°C)",
                data: history.map((h) => h.temperature),
              },
              {
                label: "Humidity (%)",
                data: history.map((h) => h.humidity),
              },
            ],
          }}
        />
      </section>

      <section className="prediction-section">
        <h2>AI Prediction Model</h2>
        <input
          type="number"
          placeholder="Temperature (°C)"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
        />
        <input
          type="number"
          placeholder="Humidity (%)"
          value={humidity}
          onChange={(e) => setHumidity(e.target.value)}
        />
        <input
          type="number"
          placeholder="Air Quality (AQI)"
          value={airQuality}
          onChange={(e) => setAirQuality(e.target.value)}
        />
        <input
          type="number"
          placeholder="Light Intensity (lux)"
          value={lightIntensity}
          onChange={(e) => setLightIntensity(e.target.value)}
        />
        <button onClick={handlePredict}>Predict</button>

        {prediction && (
          <h3>🌤️ Predicted Environmental Category: {prediction}</h3>
        )}
      </section>
    </div>
  );
}

export default App;
