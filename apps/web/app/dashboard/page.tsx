import { getDashboardSummary } from '../../lib/demo';
import { getNovaCoreInsight } from '../../lib/nova-core';

function format(value: number | string, unit?: string) {
  return `${value}${unit ? ' ' + unit : ''}`;
}

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const nova = await getNovaCoreInsight();

  return (
    <main className="container">
      <nav className="nav">
        <div className="logo">NOVA OS / NEOAGRO</div>
        <a href="/" className="badge">Home</a>
      </nav>

      <section className="card">
        <div className="kicker">SolarHub Demo Scenario</div>
        <h1 style={{ fontSize: 44 }}>{summary.scenario}</h1>
        <p>
          {summary.site.name} is being monitored by NOVA Agriculture. A heatwave risk is
          increasing irrigation demand while NOVA calculates water, energy, carbon, and resilience impact.
        </p>
        <div>
          {summary.workflow.map((step: string) => <span key={step} className="badge">{step}</span>)}
          <span className="badge">NOVA Core: {nova.connected ? 'connected' : 'fallback mode'}</span>
        </div>
      </section>

      <section className="grid grid-3" style={{ marginTop: 18 }}>
        {summary.kpis.map((metric: any) => (
          <div className="card" key={metric.label}>
            <div className="kicker">{metric.trend}</div>
            <h2>{metric.label}</h2>
            <div className="value">{format(metric.value, metric.unit)}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-2" style={{ marginTop: 18 }}>
        <div className="card">
          <div className="kicker">NeoAgro Forecast</div>
          <h2>Heatwave and agrivoltaic risk</h2>
          <p>Maximum temperature: {summary.forecast.max_temperature_c} C</p>
          <p>Water demand change: {summary.forecast.water_demand_delta_pct}%</p>
          <p>Solar production change: {summary.forecast.solar_production_delta_pct}%</p>
          <p>Yield risk: {summary.forecast.yield_risk}</p>
        </div>
        <div className="card">
          <div className="kicker">Expected Impact</div>
          <h2>Optimized action result</h2>
          <p>Water savings: {summary.impact.expected_water_savings_m3} m3</p>
          <p>Carbon reduction: {summary.impact.expected_carbon_reduction_kg} kgCO2e</p>
          <p>Yield risk reduction: {summary.impact.expected_yield_risk_reduction_pct}%</p>
          <p>Resilience gain: {summary.impact.expected_resilience_gain_pct}%</p>
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 18 }}>
        <div className="card">
          <div className="kicker">NOVA Core Forecast</div>
          <h2>Shared AI v0 risk model</h2>
          <p>Heat risk: {nova.forecast.heat_risk}</p>
          <p>Water demand delta: {nova.forecast.water_demand_delta_pct}%</p>
          <p>Solar production delta: {nova.forecast.solar_production_delta_pct}%</p>
          <p>Yield risk: {nova.forecast.yield_risk}</p>
        </div>
        <div className="card recommendation">
          <div className="kicker">NOVA Recommendation</div>
          <h2>{nova.recommendation.title}</h2>
          <p>{nova.recommendation.explanation}</p>
          <span className="badge">Priority: {nova.recommendation.priority}</span>
          <span className="badge">Confidence: {Math.round((nova.recommendation.confidence ?? 0) * 100)}%</span>
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 18 }}>
        <div className="card">
          <div className="kicker">Scenario Simulation</div>
          <h2>Baseline vs optimized</h2>
          <p>Baseline water use: {nova.simulation.baseline?.water_use_m3} m3</p>
          <p>Optimized water use: {nova.simulation.optimized?.water_use_m3} m3</p>
          <p>Baseline grid dependency: {nova.simulation.baseline?.grid_dependency}</p>
          <p>Optimized grid dependency: {nova.simulation.optimized?.grid_dependency}</p>
        </div>
        <div className="card">
          <div className="kicker">Assistant Explanation</div>
          <h2>Why NOVA recommends this</h2>
          <p>{nova.explanation.what_is_happening}</p>
          <p>{nova.explanation.why_it_matters}</p>
          <p>{nova.explanation.what_happens_next}</p>
          <p><strong>Action:</strong> {nova.explanation.what_to_do}</p>
        </div>
      </section>

      <section className="grid" style={{ marginTop: 18 }}>
        {summary.recommendations.map((rec: any) => (
          <div className="card recommendation" key={rec.id}>
            <div className="kicker">{rec.priority} priority / {Math.round(rec.confidence * 100)}% confidence</div>
            <h2>{rec.title}</h2>
            <p>{rec.explanation}</p>
            <span className="badge">Status: {rec.status}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
