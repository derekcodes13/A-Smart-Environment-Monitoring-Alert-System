import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
import random

# =============================
# CONFIGURATION & PAGE STYLING
# =============================
st.set_page_config(
    page_title="Smart Environment Monitoring Dashboard",
    page_icon="🌍",
    layout="wide"
)

st.markdown(
    """
    <style>
    body {
        background: linear-gradient(135deg, #0078D7, #00BCD4);
        color: white;
        font-family: 'Poppins', sans-serif;
    }
    .stMetric {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 1rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .block-container {
        padding-top: 2rem;
    }
    h1, h2, h3 {
        color: white !important;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# =============================
# SIMULATED SENSOR DATA
# =============================

def generate_data(n=20):
    """Generate fake live sensor data for display"""
    now = datetime.now()
    data = []
    for i in range(n):
        data.append({
            "timestamp": now - timedelta(minutes=5 * i),
            "temperature": round(random.uniform(25, 35), 1),
            "humidity": round(random.uniform(45, 70), 1),
            "air_quality": round(random.uniform(50, 200), 1),
            "light": random.randint(100, 600)
        })
    return pd.DataFrame(data)

df = generate_data()

# =============================
# HEADER
# =============================
st.title("🌍 Smart Environment Monitoring & Alert System")
st.markdown("### Real-time Environmental Insights and AI-driven Predictions")
st.write("---")

# =============================
# METRIC CARDS
# =============================

col1, col2, col3, col4 = st.columns(4)
latest = df.iloc[0]

with col1:
    st.metric("🌡️ Temperature (°C)", f"{latest['temperature']} °C")

with col2:
    st.metric("💧 Humidity (%)", f"{latest['humidity']} %")

with col3:
    st.metric("🌫️ Air Quality Index", f"{latest['air_quality']} AQI")

with col4:
    st.metric("💡 Light Intensity", f"{latest['light']} lux")

# =============================
# CHARTS SECTION
# =============================
st.write("")

c1, c2 = st.columns(2)

with c1:
    fig_temp = px.line(
        df,
        x="timestamp",
        y="temperature",
        title="Temperature Trend (°C)",
        color_discrete_sequence=["#FFD700"]
    )
    fig_temp.update_layout(
        plot_bgcolor="rgba(255,255,255,0.1)",
        paper_bgcolor="rgba(0,0,0,0)",
        font_color="white"
    )
    st.plotly_chart(fig_temp, use_container_width=True)

with c2:
    fig_hum = px.line(
        df,
        x="timestamp",
        y="humidity",
        title="Humidity Trend (%)",
        color_discrete_sequence=["#00FFCC"]
    )
    fig_hum.update_layout(
        plot_bgcolor="rgba(255,255,255,0.1)",
        paper_bgcolor="rgba(0,0,0,0)",
        font_color="white"
    )
    st.plotly_chart(fig_hum, use_container_width=True)

# =============================
# ADDITIONAL DATA VISUALS
# =============================
st.write("")
c3, c4 = st.columns(2)

with c3:
    fig_aqi = px.bar(
        df,
        x="timestamp",
        y="air_quality",
        title="Air Quality Index (AQI) Levels",
        color_discrete_sequence=["#FF6B6B"]
    )
    fig_aqi.update_layout(
        plot_bgcolor="rgba(255,255,255,0.1)",
        paper_bgcolor="rgba(0,0,0,0)",
        font_color="white"
    )
    st.plotly_chart(fig_aqi, use_container_width=True)

with c4:
    fig_light = px.area(
        df,
        x="timestamp",
        y="light",
        title="Light Intensity (Lux)",
        color_discrete_sequence=["#4CC9F0"]
    )
    fig_light.update_layout(
        plot_bgcolor="rgba(255,255,255,0.1)",
        paper_bgcolor="rgba(0,0,0,0)",
        font_color="white"
    )
    st.plotly_chart(fig_light, use_container_width=True)

# =============================
# AI PREDICTION SECTION
# =============================
st.write("---")
st.header("🤖 AI-Based Environmental Category Prediction")

col5, col6, col7, col8 = st.columns(4)

temp = col5.number_input("Temperature (°C)", value=latest["temperature"])
hum = col6.number_input("Humidity (%)", value=latest["humidity"])
aqi = col7.number_input("Air Quality Index", value=latest["air_quality"])
light = col8.number_input("Light Intensity (lux)", value=latest["light"])

if st.button("🔍 Predict Environmental Category"):
    # Simple rule-based fake AI logic for demo
    if aqi > 150 or temp > 34:
        result = "⚠️ Poor Air Quality Environment"
        color = "red"
    elif hum > 65:
        result = "🌧️ Humid & Cloudy Conditions"
        color = "blue"
    else:
        result = "🌤️ Normal & Stable Environment"
        color = "green"

    st.success(result)

st.write("---")
st.caption("Built by Derek, Bhavesh, Kanish and Mayank | © 2025 All Rights Reserved") 
