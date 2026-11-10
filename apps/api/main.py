from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Metric(BaseModel):
    label: str
    value: float | int | str | None = None
    unit: str = ""
    trend: str = "not_assessed"
    data_classification: str = "unavailable_until_verified"


class Recommendation(BaseModel):
    id: str
    title: str
    priority: str = "review_required"
    confidence: float | None = None
    explanation: str
    expected_impact: dict[str, Any]
    status: str = "review_required"
    requires_operator_review: bool = True


app = FastAPI(
    title="NeoAgro API",
    version="0.2.0",
    description="NOVA Agriculture API. V1 provides provenance-aware demo contracts and review-only screening.",
)

origins = [
    origin.strip()
    for origin in os.getenv("NEOAGRO_ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Accept", "Content-Type"],
)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def provenance() -> dict[str, Any]:
    return {
        "data_mode": "synthetic_demo",
        "source_classification": "illustrative_ui_fixture",
        "site_telemetry_connected": False,
        "provider_data_connected": False,
        "caller_supplied_data_verified": False,
        "note": (
            "This API currently serves demonstration metadata only. No live field sensors, "
            "crop observations, irrigation meters, weather provider or energy meters are connected."
        ),
    }


def methodology() -> dict[str, Any]:
    return {
        "type": "no_forecast_or_impact_model",
        "version": "neoagro-api-v0.2",
        "calibrated_model": False,
        "trained_machine_learning": False,
        "forecast_available": False,
        "impact_accounting_available": False,
        "limitations": [
            "No site-specific crop, cultivar, soil, phenology or irrigation calibration is available.",
            "No validated weather or field telemetry feed is connected.",
            "No measured baseline or intervention outcome data is available.",
            "No irrigation prescription or autonomous actuation is issued.",
        ],
    }


def demo_site() -> dict[str, Any]:
    return {
        "id": "demo-site-neoagro-001",
        "name": "Illustrative Agrivoltaic Demo Site",
        "type": "conceptual_demo",
        "country": None,
        "status": "synthetic_demo",
        "health_score": None,
        "last_updated": now_iso(),
        "data_provenance": provenance(),
    }


def demo_kpis() -> list[Metric]:
    return [
        Metric(label="Site health", value=None, unit="score"),
        Metric(label="Crop health", value=None, unit="score"),
        Metric(label="Soil moisture", value=None, unit="%"),
        Metric(label="Solar production", value=None, unit="kW"),
        Metric(label="Water use", value=None, unit="m3"),
        Metric(label="Carbon impact", value=None, unit="kgCO2e"),
    ]


def review_recommendations() -> list[Recommendation]:
    return [
        Recommendation(
            id="neoagro-review-field-data-001",
            title="Verify crop, soil, root-zone and sensor data before irrigation assessment",
            explanation=(
                "NeoAgro has no verified crop profile, soil-water calibration, root-zone measurements "
                "or recent field observations. No irrigation schedule or quantitative impact is generated."
            ),
            expected_impact={
                "water_saved_m3": None,
                "yield_risk_reduction_pct": None,
                "energy_shifted_kwh": None,
                "carbon_reduction_kg": None,
            },
        ),
        Recommendation(
            id="neoagro-review-source-data-002",
            title="Connect weather, irrigation meter and energy sources with provenance",
            explanation=(
                "Register source ownership, units, timestamps, calibration and data completeness "
                "before enabling forecast or optimization workflows."
            ),
            expected_impact={
                "data_reliability_gain_pct": None,
                "maintenance_risk_reduction_pct": None,
            },
        ),
    ]


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "neoagro-api",
        "mode": "demo_contract_only",
        "time": now_iso(),
    }


@app.get("/api/v1/sites/demo")
def get_demo_site() -> dict[str, Any]:
    return demo_site()


@app.get("/api/v1/dashboard/summary")
def dashboard_summary() -> dict[str, Any]:
    return {
        "site": demo_site(),
        "scenario": "Illustrative agrivoltaic workflow · no live telemetry",
        "workflow": [
            "Register sources",
            "Verify observations",
            "Validate methods",
            "Review screening",
            "Approve field action",
            "Measure outcomes",
        ],
        "kpis": [metric.model_dump() for metric in demo_kpis()],
        "recommendations": [rec.model_dump() for rec in review_recommendations()],
        "forecast": {
            "status": "not_assessed",
            "weather_risk": None,
            "max_temperature_c": None,
            "water_demand_delta_pct": None,
            "solar_production_delta_pct": None,
            "yield_risk": None,
        },
        "impact": {
            "status": "not_estimable_without_verified_baseline",
            "expected_water_savings_m3": None,
            "expected_carbon_reduction_kg": None,
            "expected_yield_risk_reduction_pct": None,
            "expected_resilience_gain_pct": None,
        },
        "data_provenance": provenance(),
        "methodology": methodology(),
        "generated_at": now_iso(),
    }


@app.post("/api/v1/recommendations/run")
def run_recommendations() -> dict[str, Any]:
    return {
        "status": "review_required",
        "recommendations": [rec.model_dump() for rec in review_recommendations()],
        "data_provenance": provenance(),
        "methodology": methodology(),
        "generated_at": now_iso(),
    }
