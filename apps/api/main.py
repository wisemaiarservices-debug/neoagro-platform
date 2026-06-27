from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class Metric(BaseModel):
    label: str
    value: float | int | str
    unit: str = ""
    trend: str = "stable"


class Recommendation(BaseModel):
    id: str
    title: str
    priority: str
    confidence: float = Field(ge=0, le=1)
    explanation: str
    expected_impact: dict[str, Any]
    status: str = "operator_review"


app = FastAPI(
    title="NeoAgro API",
    version="0.1.0",
    description="NOVA Agriculture API for agrivoltaic intelligence.",
)

origins = os.getenv("NEOAGRO_ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def demo_site() -> dict[str, Any]:
    return {
        "id": "site-solarhub-agro-001",
        "name": "Agrivoltaic Operations Site",
        "type": "agrivoltaic_pilot",
        "country": "Tunisia",
        "status": "demo_ready",
        "health_score": 86,
        "last_updated": now_iso(),
    }


def demo_kpis() -> list[Metric]:
    return [
        Metric(label="Site Health", value=86, unit="%", trend="up"),
        Metric(label="Crop Health", value=82, unit="%", trend="stable"),
        Metric(label="Soil Moisture", value=31, unit="%", trend="down"),
        Metric(label="Solar Production", value=42.6, unit="kW", trend="up"),
        Metric(label="Water Use Today", value=18.4, unit="m3", trend="down"),
        Metric(label="Carbon Avoided", value=126, unit="kgCO2e", trend="up"),
    ]


def demo_recommendations() -> list[Recommendation]:
    return [
        Recommendation(
            id="rec-evening-irrigation-001",
            title="Shift irrigation to evening window",
            priority="high",
            confidence=0.87,
            explanation=(
                "Heatwave risk and declining soil moisture increase crop stress. "
                "Evening irrigation reduces evaporation and can coordinate with lower energy demand."
            ),
            expected_impact={
                "water_saved_m3": 3.2,
                "yield_risk_reduction_pct": 11,
                "energy_shifted_kwh": 18,
                "carbon_reduction_kg": 7.5,
            },
        ),
        Recommendation(
            id="rec-sensor-check-001",
            title="Check soil sensor node A3",
            priority="medium",
            confidence=0.78,
            explanation=(
                "Sensor A3 reports intermittent telemetry. Maintenance before the heatwave improves data reliability."
            ),
            expected_impact={
                "data_reliability_gain_pct": 8,
                "maintenance_risk_reduction_pct": 14,
            },
        ),
    ]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "neoagro-api", "time": now_iso()}


@app.get("/api/v1/sites/demo")
def get_demo_site() -> dict[str, Any]:
    return demo_site()


@app.get("/api/v1/dashboard/summary")
def dashboard_summary() -> dict[str, Any]:
    return {
        "site": demo_site(),
        "scenario": "Heatwave agrivoltaic optimization",
        "workflow": ["Observe", "Analyze", "Forecast", "Recommend", "Simulate", "Optimize", "Measure Impact"],
        "kpis": [metric.model_dump() for metric in demo_kpis()],
        "recommendations": [rec.model_dump() for rec in demo_recommendations()],
        "forecast": {
            "weather_risk": "high_heat",
            "max_temperature_c": 39,
            "water_demand_delta_pct": 18,
            "solar_production_delta_pct": -6,
            "yield_risk": "medium_high",
        },
        "impact": {
            "expected_water_savings_m3": 3.2,
            "expected_carbon_reduction_kg": 7.5,
            "expected_yield_risk_reduction_pct": 11,
            "expected_resilience_gain_pct": 9,
        },
        "generated_at": now_iso(),
    }


@app.post("/api/v1/recommendations/run")
def run_recommendations() -> dict[str, Any]:
    return {
        "status": "completed",
        "recommendations": [rec.model_dump() for rec in demo_recommendations()],
        "generated_at": now_iso(),
    }
