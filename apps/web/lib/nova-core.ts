export type NovaCoreState = {
  site_id?: string;
  temperature_c?: number;
  soil_moisture_pct?: number;
  solar_kw?: number;
  battery_soc_pct?: number;
  water_use_m3_today?: number;
  gateway_health_pct?: number;
};

export type NovaCoreInsight = {
  connected: boolean;
  forecast: Record<string, any>;
  recommendation: Record<string, any>;
  simulation: Record<string, any>;
  explanation: Record<string, any>;
};

const fallbackInsight: NovaCoreInsight = {
  connected: false,
  forecast: {
    status: "not_assessed",
    forecast: null,
    reason: "NOVA Core API is not connected. No forecast is available in local fallback mode.",
  },
  recommendation: {
    title: "Verify site inputs and provenance before operational screening",
    priority: "review_required",
    confidence: null,
    explanation: "Local fallback mode does not generate crop-specific irrigation advice, forecasts or quantitative impacts.",
    expected_impact: {
      water_saved_m3: null,
      energy_shifted_kwh: null,
      carbon_reduction_kg: null,
      yield_risk_reduction_pct: null,
    },
    requires_operator_review: true,
  },
  simulation: {
    status: "not_estimable",
    baseline: null,
    optimized: null,
    impact: null,
    reason: "A verified baseline and intervention data are required before comparison.",
  },
  explanation: {
    what_is_happening: "NOVA Core is not connected.",
    why_it_matters: "Unverified or synthetic inputs must not be presented as field observations.",
    what_happens_next: "Connect the NOVA Core API and verify site data sources before requesting screening.",
    what_to_do: "Verify data provenance and field conditions.",
  },
};

async function postJson(baseUrl: string, path: string, body: NovaCoreState) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    next: { revalidate: 10 },
  });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

export async function getNovaCoreInsight(state: NovaCoreState = {}): Promise<NovaCoreInsight> {
  const baseUrl = process.env.NOVA_CORE_API_URL || process.env.NEXT_PUBLIC_NOVA_CORE_API_URL;
  if (!baseUrl) return fallbackInsight;

  try {
    // Send an empty object by default so NOVA Core can identify its own defaults as synthetic.
    // Do not pre-fill the request with demo values and accidentally label them caller-supplied.
    const [forecast, recommendationResponse, simulation, explanation] = await Promise.all([
      postJson(baseUrl, "/api/v1/forecast/run", state),
      postJson(baseUrl, "/api/v1/recommendations/run", state),
      postJson(baseUrl, "/api/v1/scenarios/simulate", state),
      postJson(baseUrl, "/api/v1/assistant/explain", state),
    ]);

    return {
      connected: true,
      forecast,
      recommendation: recommendationResponse.recommendation ?? recommendationResponse.recommendations?.[0] ?? recommendationResponse,
      simulation,
      explanation,
    };
  } catch {
    return fallbackInsight;
  }
}
