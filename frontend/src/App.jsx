import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

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
          const { temperature, humidity, air_quality, timestamp } = res.data;

          setSensorData({ temperature, humidity, air_quality });

          setTemperatureHistory((prev) => [...prev.slice(-9), temperature]);
          setHumidityHistory((prev) => [...prev.slice(-9), humidity]);
          setAirQualityHistory((prev) => [...prev.slice(-9), air_quality]);
          setTimestamps((prev) => [
            ...prev.slice(-9),
            new Date(timestamp).toLocaleTimeString(),
          ]);
        })
        .catch((err) => console.error("Error fetching sensor data:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // refresh every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Smart Environment Monitoring</h1>

      {sensorData ? (
        <div className="card">
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
      <div className="chart-container">
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
      <div className="chart-container">
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
      <div className="chart-container">
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
