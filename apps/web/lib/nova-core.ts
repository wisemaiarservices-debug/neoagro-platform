export type NovaCoreState = {
  site_id: string;
  temperature_c: number;
  soil_moisture_pct: number;
  solar_kw: number;
  battery_soc_pct: number;
  water_use_m3_today: number;
  gateway_health_pct: number;
};

export type NovaCoreInsight = {
  connected: boolean;
  forecast: Record<string, any>;
  recommendation: Record<string, any>;
  simulation: Record<string, any>;
  explanation: Record<string, any>;
};

const defaultState: NovaCoreState = {
  site_id: 'site-solarhub-agro-001',
  temperature_c: 39,
  soil_moisture_pct: 31,
  solar_kw: 42.6,
  battery_soc_pct: 67,
  water_use_m3_today: 18.4,
  gateway_health_pct: 91,
};

const fallbackInsight: NovaCoreInsight = {
  connected: false,
  forecast: {
    heat_risk: 'high',
    water_demand_delta_pct: 18,
    solar_production_delta_pct: -6,
    yield_risk: 'medium_high',
  },
  recommendation: {
    title: 'Shift irrigation to evening window',
    priority: 'high',
    confidence: 0.87,
    explanation: 'Fallback NOVA logic: heat and low moisture indicate irrigation timing should move to the evening window.',
    expected_impact: {
      water_saved_m3: 3.2,
      energy_shifted_kwh: 18,
      carbon_reduction_kg: 7.5,
      yield_risk_reduction_pct: 11,
    },
  },
  simulation: {
    baseline: { water_use_m3: 18.4, grid_dependency: 'medium', yield_risk: 'medium_high' },
    optimized: { water_use_m3: 15.2, grid_dependency: 'lower', yield_risk: 'medium' },
  },
  explanation: {
    what_is_happening: 'The site is entering a high-heat operating window with declining soil moisture.',
    why_it_matters: 'Crop stress and evaporation risk are increasing while energy timing can still be optimized.',
    what_happens_next: 'Water demand is expected to increase by 18%.',
    what_to_do: 'Shift irrigation to evening window',
  },
};

async function postJson(baseUrl: string, path: string, body: NovaCoreState) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    next: { revalidate: 10 },
  });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

export async function getNovaCoreInsight(state: NovaCoreState = defaultState): Promise<NovaCoreInsight> {
  const baseUrl = process.env.NOVA_CORE_API_URL || process.env.NEXT_PUBLIC_NOVA_CORE_API_URL;
  if (!baseUrl) return fallbackInsight;

  try {
    const [forecast, recommendationResponse, simulation, explanation] = await Promise.all([
      postJson(baseUrl, '/api/v1/forecast/run', state),
      postJson(baseUrl, '/api/v1/recommendations/run', state),
      postJson(baseUrl, '/api/v1/scenarios/simulate', state),
      postJson(baseUrl, '/api/v1/assistant/explain', state),
    ]);

    return {
      connected: true,
      forecast,
      recommendation: recommendationResponse.recommendation ?? recommendationResponse,
      simulation,
      explanation,
    };
  } catch {
    return fallbackInsight;
  }
}
