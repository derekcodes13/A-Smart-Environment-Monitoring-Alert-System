import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/sensor");
        setSensorData(res.data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // refresh every 3s

    return () => clearInterval(interval);
  }, []);

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
    </div>
  );
}

export default App;
