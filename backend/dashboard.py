import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
import random
import time

# =============================
# PAGE CONFIGURATION & STYLING
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
# SIMULATE SENSOR DATA
# =============================
def generate_data(n=20):
    now = datetime.now()
    data = []
    for i in range(n):
        data.append({
            "timestamp": now - timedelta(minutes=5 * i),
            "temperature": round(random.uniform(25, 38), 1),
            "humidity": round(random.uniform(40, 75), 1),
            "air_quality": round(random.uniform(40, 220), 1),
            "light": random.randint(100, 700)
        })
    return pd.DataFrame(data)

# =============================
# MAIN DASHBOARD
# =============================
st.title("🌍 Smart Environment Monitoring & Alert System")
st.markdown("### Real-time Environmental Insights and AI-driven Predictions")
st.write("---")

# Sidebar for refresh speed
refresh_interval = st.sidebar.slider("⏱️ Auto-refresh interval (seconds)", 5, 30, 10)

# Dynamic placeholder for live refresh
placeholder = st.empty()

while True:
    with placeholder.container():
        df = generate_data()
        latest = df.iloc[0]

        # =============================
        # LIVE ALERTS SECTION
        # =============================
        st.subheader("🚨 Live Alerts")
        alert_placeholder = st.empty()

        if latest["temperature"] > 35:
            alert_placeholder.error(f"🔥 High Temperature Alert: {latest['temperature']} °C")
        elif latest["air_quality"] > 150:
            alert_placeholder.warning(f"⚠️ Poor Air Quality Detected: AQI {latest['air_quality']}")
        elif latest["humidity"] > 70:
            alert_placeholder.info(f"💧 High Humidity Levels: {latest['humidity']} %")
        else:
            alert_placeholder.success("✅ Environment Stable — No Alerts")

        st.write("")

        # =============================
        # METRIC CARDS
        # =============================
        col1, col2, col3, col4 = st.columns(4)
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
        # ADDITIONAL VISUALS
        # =============================
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
        # FOOTER
        # =============================
        st.write("---")
        st.caption("Built by Derek, Bhavesh, Kanish and Mayank | © 2025 Smart Environment System")

    # Refresh automatically
    time.sleep(refresh_interval)
    st.rerun()
