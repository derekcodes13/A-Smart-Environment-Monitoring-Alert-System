// frontend/src/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";

function App() {
  const [sensorLatest, setSensorLatest] = useState(null);
  const [sensorHistory, setSensorHistory] = useState([]);

  const [emissions, setEmissions] = useState(null);
  const [recycling, setRecycling] = useState(null);
  const [transport, setTransport] = useState(null);

  // input states for ML prediction
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [airQuality, setAirQuality] = useState("");
  const [lightIntensity, setLightIntensity] = useState("");
  const [prediction, setPrediction] = useState(null);

  // fetch static datasets once
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/emissions")
      .then((r) => {
        const raw = r.data;
        const chartData = {
          labels: Object.keys(raw),
          datasets: [
            {
              label: "Emissions",
              data: Object.values(raw),
              borderColor: "orange",
              backgroundColor: "rgba(255,165,0,0.5)",
              fill: true,
            },
          ],
        };
        setEmissions(chartData);
      })
      .catch(console.error);

    axios
      .get("http://localhost:4000/api/recycling")
      .then((r) => {
        const raw = r.data;
        const chartData = {
          labels: Object.keys(raw),
          datasets: [
            {
              label: "Recycling %",
              data: Object.values(raw),
              backgroundColor: ["#6ab04c", "#f6b93b", "#54a0ff", "#e056fd"],
            },
          ],
        };
        setRecycling(chartData);
      })
      .catch(console.error);

    axios
      .get("http://localhost:4000/api/transport")
      .then((r) => {
        const raw = r.data;
        const chartData = {
          labels: Object.keys(raw),
          datasets: [
            {
              label: "Distance (km)",
              data: Object.values(raw),
              borderColor: "#2d98da",
              backgroundColor: "rgba(45,152,218,0.5)",
              fill: true,
            },
          ],
        };
        setTransport(chartData);
      })
      .catch(console.error);
  }, []);

  // fetch sensor latest + history every 3s
  useEffect(() => {
    const fetchSensor = () => {
      axios
        .get("http://localhost:4000/api/sensor")
        .then((res) => setSensorLatest(res.data))
        .catch((err) => console.error("sensor latest:", err));

      axios
        .get("http://localhost:4000/api/sensor/history")
        .then((res) => setSensorHistory(res.data || []))
        .catch((err) => console.error("sensor history:", err));
    };

    fetchSensor();
    const id = setInterval(fetchSensor, 3000);
    return () => clearInterval(id);
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
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>🌍 Smart Environment Monitoring</h1>

      {/* Latest Sensor Card */}
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

      {/* History Line Chart */}
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

      {/* Emissions */}
      <h2 style={{ marginTop: 30 }}>📈 Emissions</h2>
      {emissions ? (
        <div style={{ maxWidth: 700, margin: "10px auto" }}>
          <Bar data={emissions} />
        </div>
      ) : (
        <p>Loading emissions...</p>
      )}

      {/* Recycling */}
      <h2 style={{ marginTop: 30 }}>♻️ Recycling</h2>
      {recycling ? (
        <div style={{ maxWidth: 700, margin: "10px auto" }}>
          <Bar data={recycling} />
        </div>
      ) : (
        <p>Loading recycling...</p>
      )}

      {/* Transport */}
      <h2 style={{ marginTop: 30 }}>🚛 Transport Distances</h2>
      {transport ? (
        <div style={{ maxWidth: 700, margin: "10px auto 40px" }}>
          <Line data={transport} />
        </div>
      ) : (
        <p>Loading transport...</p>
      )}

      {/* Prediction Form */}
      <h2 style={{ marginTop: 30 }}>🤖 ML Prediction</h2>
      <form
        onSubmit={handlePredict}
        style={{ margin: "20px auto", maxWidth: 400 }}
      >
        <input
          type="number"
          step="any"
          placeholder="Temperature"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
          step="any"
          placeholder="Humidity"
          value={humidity}
          onChange={(e) => setHumidity(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
          step="any"
          placeholder="Air Quality"
          value={airQuality}
          onChange={(e) => setAirQuality(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
          step="any"
          placeholder="Light Intensity"
          value={lightIntensity}
          onChange={(e) => setLightIntensity(e.target.value)}
          required
        />
        <br />
        <button type="submit" style={{ marginTop: 10 }}>
          Predict
        </button>
      </form>

      {prediction !== null && (
        <div style={{ marginTop: 20 }}>
          <h3>Prediction Result: {prediction}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
