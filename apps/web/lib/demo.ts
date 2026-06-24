export type Metric = {
  label: string;
  value: number | string;
  unit: string;
  trend: string;
};

export type Recommendation = {
  id: string;
  title: string;
  priority: string;
  confidence: number;
  explanation: string;
  expected_impact: Record<string, number>;
  status: string;
};

export const fallbackSummary = {
  site: {
    name: 'SolarHub Agrivoltaic Demo Site',
    status: 'demo_ready',
    health_score: 86,
  },
  scenario: 'Heatwave agrivoltaic optimization',
  workflow: ['Observe', 'Analyze', 'Forecast', 'Recommend', 'Simulate', 'Optimize', 'Measure Impact'],
  kpis: [
    { label: 'Site Health', value: 86, unit: '%', trend: 'up' },
    { label: 'Crop Health', value: 82, unit: '%', trend: 'stable' },
    { label: 'Soil Moisture', value: 31, unit: '%', trend: 'down' },
    { label: 'Solar Production', value: 42.6, unit: 'kW', trend: 'up' },
    { label: 'Water Use Today', value: 18.4, unit: 'm3', trend: 'down' },
    { label: 'Carbon Avoided', value: 126, unit: 'kgCO2e', trend: 'up' },
  ] as Metric[],
  forecast: {
    weather_risk: 'high_heat',
    max_temperature_c: 39,
    water_demand_delta_pct: 18,
    solar_production_delta_pct: -6,
    yield_risk: 'medium_high',
  },
  impact: {
    expected_water_savings_m3: 3.2,
    expected_carbon_reduction_kg: 7.5,
    expected_yield_risk_reduction_pct: 11,
    expected_resilience_gain_pct: 9,
  },
  recommendations: [
    {
      id: 'rec-evening-irrigation-001',
      title: 'Shift irrigation to evening window',
      priority: 'high',
      confidence: 0.87,
      explanation: 'Heatwave risk and declining soil moisture increase crop stress. Evening irrigation reduces evaporation and coordinates with lower energy demand.',
      expected_impact: { water_saved_m3: 3.2, yield_risk_reduction_pct: 11, energy_shifted_kwh: 18, carbon_reduction_kg: 7.5 },
      status: 'operator_review',
    },
  ] as Recommendation[],
};

export async function getDashboardSummary() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const response = await fetch(`${apiUrl}/api/v1/dashboard/summary`, { next: { revalidate: 10 } });
    if (!response.ok) return fallbackSummary;
    return response.json();
  } catch {
    return fallbackSummary;
  }
}
