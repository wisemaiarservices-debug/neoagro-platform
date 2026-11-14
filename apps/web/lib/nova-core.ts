export type NovaCoreState = {
  site_id: string;
  temperature_c?: number;
  soil_moisture_pct?: number;
  solar_kw?: number;
  battery_soc_pct?: number;
  water_use_m3_today?: number;
  gateway_health_pct?: number;
  /**
   * Client-side evidence gate only. The current Core SiteState API does not
   * accept or independently verify these fields; they are deliberately not
   * forwarded as extra JSON properties.
   */
  data_classification: 'verified_field_observation' | 'attributed_provider_data';
  source_ids: string[];
  observed_at: string;
};

type CoreSiteState = Pick<NovaCoreState, 'site_id'> &
  Partial<Pick<NovaCoreState,
    'temperature_c' | 'soil_moisture_pct' | 'solar_kw' |
    'battery_soc_pct' | 'water_use_m3_today' | 'gateway_health_pct'>>;

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
    explanation: 'No eligible, timestamped site evidence has been supplied. No operational recommendation or quantitative impact is generated.',
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
    what_is_happening: 'No eligible site observations are currently available.',
    why_it_matters: 'Unverified or illustrative values must not be used to drive field decisions.',
    what_happens_next: 'Register a real site and source, then submit timestamped observations with provenance.',
    what_to_do: 'Complete source registration and data-quality review.',
  },
};

const MEASUREMENT_FIELDS = [
  'temperature_c',
  'soil_moisture_pct',
  'solar_kw',
  'battery_soc_pct',
  'water_use_m3_today',
  'gateway_health_pct',
] as const;

function hasEligibleEvidence(state: NovaCoreState): boolean {
  if (typeof state.site_id !== 'string' || !state.site_id.trim()) return false;
  if (!Array.isArray(state.source_ids) || state.source_ids.length === 0) return false;
  if (state.source_ids.some((source) => typeof source !== 'string' || !source.trim())) return false;
  if (!['verified_field_observation', 'attributed_provider_data'].includes(state.data_classification)) return false;
  if (typeof state.observed_at !== 'string') return false;
  const observedAt = Date.parse(state.observed_at);
  if (!Number.isFinite(observedAt) || observedAt > Date.now() + 5 * 60 * 1000) return false;
  return MEASUREMENT_FIELDS.some((field) =>
    typeof state[field] === 'number' && Number.isFinite(state[field])
  ) && MEASUREMENT_FIELDS.every((field) =>
    state[field] === undefined || (typeof state[field] === 'number' && Number.isFinite(state[field]))
  );
}

/**
 * The current Core SiteState contract is strict (extra=forbid): forward only
 * site_id and measurements it actually accepts. Evidence metadata above is a
 * client-side gate, not trusted Core provenance. Core will still label values
 * caller_supplied_unverified until a source-aware authenticated endpoint exists.
 */
function toCoreSiteState(state: NovaCoreState): CoreSiteState {
  const payload: CoreSiteState = { site_id: state.site_id.trim() };
  for (const field of MEASUREMENT_FIELDS) {
    const value = state[field];
    if (value !== undefined) payload[field] = value;
  }
  return payload;
}

async function postJson(baseUrl: string, path: string, body: CoreSiteState) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

/**
 * No default/demo state is sent to NOVA Core. A caller must provide at least
 * one finite measurement, timestamp and registered source reference. Partial
 * measurements are valid; missing values remain unknown.
 */
export async function getNovaCoreInsight(state?: NovaCoreState): Promise<NovaCoreInsight> {
  if (!state || !hasEligibleEvidence(state)) return fallbackInsight;

  const baseUrl = process.env.NOVA_CORE_API_URL || process.env.NEXT_PUBLIC_NOVA_CORE_API_URL;
  if (!baseUrl) return fallbackInsight;

  const coreState = toCoreSiteState(state);
  try {
    const [forecast, recommendationResponse, simulation, explanation] = await Promise.all([
      postJson(baseUrl, '/api/v1/forecast/run', coreState),
      postJson(baseUrl, '/api/v1/recommendations/run', coreState),
      postJson(baseUrl, '/api/v1/scenarios/simulate', coreState),
      postJson(baseUrl, '/api/v1/assistant/explain', coreState),
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
