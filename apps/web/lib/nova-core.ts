export type NovaCoreForecast = {
  title: string;
  risk: string;
  horizon: string;
  confidence: number;
  signals: string[];
};

export type NovaCoreSimulation = {
  scenario: string;
  action: string;
  water_saved_m3: number;
  energy_shifted_kwh: number;
  carbon_reduction_kg: number;
  yield_risk_reduction_pct: number;
  resilience_gain_pct: number;
};

export type NovaCoreRecommendation = {
  title: string;
  priority: string;
  operator_action: string;
  confidence: number;
  expected_impact: string[];
};

export type NovaCoreAssistant = {
  summary: string;
  explanation: string;
  guardrails: string[];
};

export type NovaCoreWorkflow = {
  source: 'nova-core' | 'fallback';
  status: 'connected' | 'fallback';
  generated_at: string;
  forecast: NovaCoreForecast;
  simulation: NovaCoreSimulation;
  recommendation: NovaCoreRecommendation;
  assistant: NovaCoreAssistant;
  error?: string;
};

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type NovaCoreWorkflowOptions = {
  siteId?: string;
  dashboardSummary?: unknown;
  apiUrl?: string;
  fetcher?: Fetcher;
  timeoutMs?: number;
};

export const novaCoreFallbackWorkflow: NovaCoreWorkflow = {
  source: 'fallback',
  status: 'fallback',
  generated_at: 'demo-static',
  forecast: {
    title: 'Heatwave agrivoltaic stress forecast',
    risk: 'medium_high',
    horizon: 'next_72_hours',
    confidence: 0.84,
    signals: [
      'Maximum temperature expected near 39 C',
      'Water demand projected to increase 18%',
      'Solar production may dip 6% during peak heat',
    ],
  },
  simulation: {
    scenario: 'Evening irrigation and solar-load coordination',
    action: 'Shift irrigation to 19:00-21:00 and inspect sensor node A3 before the heatwave peak.',
    water_saved_m3: 3.2,
    energy_shifted_kwh: 18,
    carbon_reduction_kg: 7.5,
    yield_risk_reduction_pct: 11,
    resilience_gain_pct: 9,
  },
  recommendation: {
    title: 'Approve evening irrigation window',
    priority: 'high',
    operator_action: 'Approve the evening irrigation plan after checking field crew availability and pump constraints.',
    confidence: 0.87,
    expected_impact: [
      'Save 3.2 m3 of water',
      'Reduce yield risk by 11%',
      'Shift 18 kWh away from the heat peak',
      'Avoid 7.5 kgCO2e',
    ],
  },
  assistant: {
    summary: 'NOVA Core AI v0 recommends operator-approved evening irrigation for the SolarHub heatwave scenario.',
    explanation:
      'The deterministic AI v0 workflow combines observed soil moisture decline, forecast heat stress, expected solar output changes, and water-energy impact scoring. It recommends a human-approved timing change rather than autonomous control.',
    guardrails: [
      'Operator approval required before action',
      'No autonomous control of pumps or critical infrastructure',
      'Fallback data keeps the demo reliable when NOVA Core is offline',
    ],
  },
};

function cleanApiUrl(url: string | undefined): string | undefined {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/\/+$/, '');
}

export function getNovaCoreApiUrl(): string | undefined {
  return cleanApiUrl(process.env.NOVA_CORE_API_URL || process.env.NEXT_PUBLIC_NOVA_CORE_API_URL);
}

function withFallback(error?: string): NovaCoreWorkflow {
  return error ? { ...novaCoreFallbackWorkflow, error } : novaCoreFallbackWorkflow;
}

function isWorkflowLike(value: any): value is Partial<NovaCoreWorkflow> {
  return Boolean(value && value.forecast && value.simulation && value.recommendation && value.assistant);
}

function normalizeWorkflow(value: Partial<NovaCoreWorkflow>): NovaCoreWorkflow {
  return {
    ...novaCoreFallbackWorkflow,
    ...value,
    source: 'nova-core',
    status: 'connected',
    generated_at: value.generated_at || new Date().toISOString(),
    forecast: { ...novaCoreFallbackWorkflow.forecast, ...value.forecast },
    simulation: { ...novaCoreFallbackWorkflow.simulation, ...value.simulation },
    recommendation: { ...novaCoreFallbackWorkflow.recommendation, ...value.recommendation },
    assistant: { ...novaCoreFallbackWorkflow.assistant, ...value.assistant },
  };
}

export async function getNovaCoreWorkflow(options: NovaCoreWorkflowOptions = {}): Promise<NovaCoreWorkflow> {
  const apiUrl = cleanApiUrl(options.apiUrl) || getNovaCoreApiUrl();
  if (!apiUrl) return withFallback();

  const fetcher = options.fetcher || fetch;
  if (!fetcher) return withFallback('No fetch implementation available for NOVA Core request.');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 2500);

  try {
    const response = await fetcher(`${apiUrl}/api/v0/ai/workflow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: 'neoagro',
        site_id: options.siteId || 'site-solarhub-agro-001',
        workflow: 'Observe -> Analyze -> Forecast -> Recommend -> Simulate -> Optimize -> Measure Impact',
        dashboard_summary: options.dashboardSummary,
      }),
      signal: controller.signal,
      next: { revalidate: 10 },
    } as RequestInit);

    if (!response.ok) return withFallback(`NOVA Core returned HTTP ${response.status}.`);

    const payload = await response.json();
    const workflow = payload?.workflow || payload;
    if (!isWorkflowLike(workflow)) return withFallback('NOVA Core response did not include the AI workflow sections.');

    return normalizeWorkflow(workflow);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown NOVA Core request failure.';
    return withFallback(message);
  } finally {
    clearTimeout(timeout);
  }
}
