export type Metric = {
  label: string;
  value: number | string | null;
  unit: string;
  trend: string;
  data_classification?: string;
};

export type Recommendation = {
  id: string;
  title: string;
  priority: string;
  confidence: number | null;
  explanation: string;
  expected_impact: Record<string, number | null>;
  status: string;
};

export const fallbackSummary = {
  site: {
    name: "Illustrative Agrivoltaic Demo Site",
    status: "synthetic_demo",
    health_score: null,
  },
  scenario: "Illustrative agrivoltaic workflow · no live telemetry",
  workflow: ["Register sources", "Verify observations", "Validate methods", "Review screening", "Approve field action", "Measure outcomes"],
  kpis: [
    { label: "Site health", value: null, unit: "score", trend: "not_assessed" },
    { label: "Crop health", value: null, unit: "score", trend: "not_assessed" },
    { label: "Soil moisture", value: null, unit: "%", trend: "not_assessed" },
    { label: "Solar production", value: null, unit: "kW", trend: "not_assessed" },
    { label: "Water use", value: null, unit: "m3", trend: "not_assessed" },
    { label: "Carbon impact", value: null, unit: "kgCO2e", trend: "not_assessed" },
  ] as Metric[],
  forecast: {
    status: "not_assessed",
    weather_risk: null,
    max_temperature_c: null,
    water_demand_delta_pct: null,
    solar_production_delta_pct: null,
    yield_risk: null,
  },
  impact: {
    status: "not_estimable_without_verified_baseline",
    expected_water_savings_m3: null,
    expected_carbon_reduction_kg: null,
    expected_yield_risk_reduction_pct: null,
    expected_resilience_gain_pct: null,
  },
  recommendations: [
    {
      id: "neoagro-review-field-data-001",
      title: "Verify crop, soil, root-zone and sensor data before irrigation assessment",
      priority: "review_required",
      confidence: null,
      explanation: "No verified crop profile, soil-water calibration or field observations are connected. No irrigation schedule or quantitative impact is generated.",
      expected_impact: { water_saved_m3: null, yield_risk_reduction_pct: null, energy_shifted_kwh: null, carbon_reduction_kg: null },
      status: "review_required",
    },
  ] as Recommendation[],
  data_provenance: {
    data_mode: "synthetic_demo",
    site_telemetry_connected: false,
    provider_data_connected: false,
    caller_supplied_data_verified: false,
  },
};

export async function getDashboardSummary() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const response = await fetch(`${apiUrl}/api/v1/dashboard/summary`, { next: { revalidate: 10 } });
    if (!response.ok) return fallbackSummary;
    return response.json();
  } catch {
    return fallbackSummary;
  }
}
