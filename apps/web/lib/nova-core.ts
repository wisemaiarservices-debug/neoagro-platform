export type NovaCoreState = {
  site_id: string;
  temperature_c: number;
  soil_moisture_pct: number;
  solar_kw: number;
  battery_soc_pct: number;
  water_use_m3_today: number;
  gateway_health_pct: number;
  data_classification: 'verified_field_observation' | 'attributed_provider_data';
  source_ids: string[];
  observed_at: string;
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
    status: 'not_assessed',
    heat_risk: null,
    water_demand_delta_pct: null,
    solar_production_delta_pct: null,
    yield_risk: null,
  },
  recommendation: {
    title: 'Verify registered site data before operational screening',
    priority: 'review_required',
    confidence: null,
    explanation: 'No verified field observation or attributed provider dataset has been supplied to NOVA Core. No operational recommendation or quantitative impact is generated.',
    expected_impact: {
      water_saved_m3: null,
      energy_shifted_kwh: null,
      carbon_reduction_kg: null,
      yield_risk_reduction_pct: null,
    },
  },
  simulation: {
    status: 'not_available',
    reason: 'A verified baseline and validated model are required.',
    baseline: null,
    optimized: null,
  },
  explanation: {
    what_is_happening: 'No verified site observations are currently available.',
    why_it_matters: 'Unverified or illustrative values must not be used to drive field decisions.',
    what_happens_next: 'Register a real site and source, then submit timestamped observations with provenance.',
    what_to_do: 'Complete source registration and data-quality review.',
  },
};

function hasEligibleEvidence(state: NovaCoreState): boolean {
  if (!state.site_id.trim() || !Array.isArray(state.source_ids) || state.source_ids.length === 0) return false;
  if (state.source_ids.some((source) => typeof source !== 'string' || !source.trim())) return false;
  if (!['verified_field_observation', 'attributed_provider_data'].includes(state.data_classification)) return false;
  const observedAt = Date.parse(state.observed_at);
  if (!Number.isFinite(observedAt) || observedAt > Date.now() + 5 * 60 * 1000) return false;
  return [
    state.temperature_c,
    state.soil_moisture_pct,
    state.solar_kw,
    state.battery_soc_pct,
    state.water_use_m3_today,
    state.gateway_health_pct,
  ].every((value) => typeof value === 'number' && Number.isFinite(value));
}

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

/**
 * No default/demo state is sent to NOVA Core. A caller must provide a complete,
 * timestamped evidence envelope and identify its registered source(s). This
 * client-side contract is a guardrail, not a substitute for Core-side auth,
 * source ownership, calibration or verification.
 */
export async function getNovaCoreInsight(state?: NovaCoreState): Promise<NovaCoreInsight> {
  if (!state || !hasEligibleEvidence(state)) return fallbackInsight;

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
