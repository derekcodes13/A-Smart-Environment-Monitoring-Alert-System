// frontend/src/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

import { Chart as ChartJS } from "chart.js/auto";

function App() {
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [airQualityHistory, setAirQualityHistory] = useState([]);

  const [timestamps, setTimestamps] = useState([]);
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:8000/")
        .then((res) => {
          const { temperature, humidity, air_quality } = res.data;
          setSensorData({ temperature, humidity, air_quality });
          setAirQualityHistory((prev) => [...prev.slice(-9), air_quality]);

          setTemperatureHistory((prev) => [...prev.slice(-9), temperature]);
          setHumidityHistory((prev) => [...prev.slice(-9), humidity]);
          setTimestamps((prev) => [
            ...prev.slice(-9),
            new Date().toLocaleTimeString(),
          ]);
        })
        .catch((err) => console.error("Error details:", err));
    };
    fetchData();
    const interval = setInterval(fetchData, 3000); // refresh every 3s
    return () => clearInterval(interval);
  }, []);

  // submit features to ML model
  const handlePredict = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:4000/predict", {
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
      console.error("Prediction error:", err);
    }
  };

  // prepare live sensor chart data
  const historyLabels = sensorHistory.map((h) =>
    new Date(h.timestamp).toLocaleTimeString()
  );
  const tempData = sensorHistory.map((h) => h.temperature);
  const humData = sensorHistory.map((h) => h.humidity);
  const aqiData = sensorHistory.map((h) => h.air_quality);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Smart Environment Monitoring</h1>
      {sensorData ? (
        <div>
          <p>
            <strong>🌡️ Temperature:</strong> {sensorData.temperature} °C
          </p>
          <p>
            <strong>💧 Humidity:</strong> {sensorData.humidity} %
          </p>
          <p>
            <strong>🌍 Air Quality:</strong> {sensorData.air_quality}
          </p>
        </div>
      ) : (
        <p>Loading sensor data...</p>
      )}

      {/* Temperature Chart */}
      <div style={{ width: "600px", margin: "20px auto" }}>
        <h2>Temperature Trend</h2>
        <Line
          data={{
            labels: timestamps,
            datasets: [
              {
                label: "Temperature (°C)",
                data: temperatureHistory,
                borderColor: "red",
                fill: false,
              },
            ],
          }}
        />
      </div>

      {/* Humidity Chart */}
      <div style={{ width: "600px", margin: "20px auto" }}>
        <h2>Humidity Trend</h2>
        <Line
          data={{
            labels: timestamps,
            datasets: [
              {
                label: "Humidity (%)",
                data: humidityHistory,
                borderColor: "blue",
                fill: false,
              },
            ],
          }}
        />
      </div>
      {/* Air Quality Chart */}
      <div style={{ width: "600px", margin: "20px auto" }}>
        <h2>Air Quality Trend</h2>
        <Line
          data={{
            labels: timestamps,
            datasets: [
              {
                label: "Air Quality Index",
                data: airQualityHistory,
                borderColor: "green",
                fill: false,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

export default App;
