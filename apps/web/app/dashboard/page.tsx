import { getDashboardSummary } from '../../lib/demo';

function format(value: number | string, unit?: string) {
  return `${value}${unit ? ' ' + unit : ''}`;
}

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const novaCore = summary.novaCore;

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
          <span className="badge">NOVA Core AI v0: {novaCore.status}</span>
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
          <div className="kicker">Forecast</div>
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
          <div className="kicker">NOVA Core Forecast / {novaCore.source}</div>
          <h2>{novaCore.forecast.title}</h2>
          <p>Risk: {novaCore.forecast.risk}</p>
          <p>Horizon: {novaCore.forecast.horizon}</p>
          <p>Confidence: {Math.round(novaCore.forecast.confidence * 100)}%</p>
          <div>
            {novaCore.forecast.signals.map((signal: string) => <span key={signal} className="badge">{signal}</span>)}
          </div>
        </div>

        <div className="card">
          <div className="kicker">NOVA Core Simulation</div>
          <h2>{novaCore.simulation.scenario}</h2>
          <p>{novaCore.simulation.action}</p>
          <p>Water saved: {novaCore.simulation.water_saved_m3} m3</p>
          <p>Energy shifted: {novaCore.simulation.energy_shifted_kwh} kWh</p>
          <p>Resilience gain: {novaCore.simulation.resilience_gain_pct}%</p>
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 18 }}>
        <div className="card recommendation">
          <div className="kicker">NOVA Core Recommendation / {novaCore.recommendation.priority}</div>
          <h2>{novaCore.recommendation.title}</h2>
          <p>{novaCore.recommendation.operator_action}</p>
          <p>Confidence: {Math.round(novaCore.recommendation.confidence * 100)}%</p>
          <div>
            {novaCore.recommendation.expected_impact.map((impact: string) => <span key={impact} className="badge">{impact}</span>)}
          </div>
        </div>

        <div className="card">
          <div className="kicker">NOVA Assistant Explanation</div>
          <h2>{novaCore.assistant.summary}</h2>
          <p>{novaCore.assistant.explanation}</p>
          <div>
            {novaCore.assistant.guardrails.map((guardrail: string) => <span key={guardrail} className="badge">{guardrail}</span>)}
          </div>
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
