import { getDashboardSummary, type Metric } from '../../lib/demo';
import { getNovaCoreInsight } from '../../lib/nova-core';

type DashboardSummary = Awaited<ReturnType<typeof getDashboardSummary>>;
type NovaInsight = Awaited<ReturnType<typeof getNovaCoreInsight>>;

type ModuleStatus = {
  id: string;
  label: string;
  status: string;
  detail: string;
  accent: 'solar' | 'green' | 'blue' | 'amber' | 'red' | 'teal';
};

type AssetRow = {
  type: string;
  name: string;
  code: string;
  status: string;
  linked: string;
};

const modules: ModuleStatus[] = [
  { id: 'dashboard', label: 'Dashboard', status: 'live', detail: 'Unified operating picture', accent: 'solar' },
  { id: 'solar', label: 'Solar Production', status: 'nominal', detail: '487 kW current output', accent: 'solar' },
  { id: 'agriculture', label: 'Agriculture', status: 'watch', detail: 'Zone 4-B moisture decline', accent: 'green' },
  { id: 'water', label: 'Water Systems', status: 'optimize', detail: 'Evening irrigation candidate', accent: 'blue' },
  { id: 'forecasting', label: 'Forecasting', status: '72h horizon', detail: 'Heatwave risk rising', accent: 'amber' },
  { id: 'ai', label: 'AI Recommendations', status: 'operator review', detail: 'NOVA Core fallback ready', accent: 'teal' },
  { id: 'sustainability', label: 'Sustainability', status: '87.3/100', detail: 'Water and carbon impact tracked', accent: 'green' },
  { id: 'digital-twin', label: 'Digital Twin', status: 'synced', detail: 'Scenario model active', accent: 'blue' },
  { id: 'assets', label: 'Asset Registry', status: 'v1.1', detail: 'NOVA, NeoGrid, NeoCell aligned', accent: 'teal' },
  { id: 'settings', label: 'Settings', status: 'demo safe', detail: 'No autonomous control', accent: 'red' },
];

const zones = [
  { id: 'Z1-A', crop: 'Lettuce', health: 94, moisture: 31, status: 'optimal' },
  { id: 'Z1-B', crop: 'Spinach', health: 91, moisture: 29, status: 'optimal' },
  { id: 'Z2-A', crop: 'Tomato', health: 88, moisture: 27, status: 'stable' },
  { id: 'Z2-B', crop: 'Pepper', health: 84, moisture: 26, status: 'stable' },
  { id: 'Z3-A', crop: 'Basil', health: 82, moisture: 25, status: 'watch' },
  { id: 'Z3-B', crop: 'Kale', health: 79, moisture: 24, status: 'watch' },
  { id: 'Z4-A', crop: 'Arugula', health: 76, moisture: 23, status: 'stress' },
  { id: 'Z4-B', crop: 'Herbs', health: 72, moisture: 21, status: 'stress' },
];

const solarSeries = [8, 42, 138, 245, 338, 418, 487, 462, 425, 364, 275, 158, 52, 6];

const assets: AssetRow[] = [
  { type: 'solar_panel', name: 'Panel Row 07', code: 'PV-R07', status: 'active', linked: 'solar_panels' },
  { type: 'inverter', name: 'Inverter 07', code: 'INV-07', status: 'maintenance', linked: 'inverter_statuses' },
  { type: 'field_zone', name: 'Zone 4-B', code: 'Z4-B', status: 'watch', linked: 'field_zones' },
  { type: 'reservoir', name: 'Reservoir South', code: 'RES-S', status: 'active', linked: 'reservoirs' },
  { type: 'battery', name: 'Battery Bank 1', code: 'BATT-01', status: 'active', linked: 'NeoGrid energy_assets' },
  { type: 'pump', name: 'Pump Station 1', code: 'PUMP-01', status: 'active', linked: 'NeoCell infrastructure_modules' },
];

const graphChain = ['Solar Array', 'powers', 'Pump Station 1', 'irrigates', 'Zone 4-B', 'produces', 'Herbs'];

function format(value: number | string, unit?: string) {
  return `${value}${unit ? ' ' + unit : ''}`;
}

function statusClass(accent: ModuleStatus['accent']) {
  return `status-pill status-${accent}`;
}

function BarChart() {
  const max = Math.max(...solarSeries);
  return (
    <div className="bar-chart" aria-label="TODAY'S SOLAR OUTPUT">
      {solarSeries.map((value, index) => (
        <span key={`${value}-${index}`} style={{ height: `${Math.max(6, (value / max) * 100)}%` }} />
      ))}
    </div>
  );
}

function ModuleRail() {
  return (
    <aside className="cc-sidebar" aria-label="NeoAgro modules">
      <div className="cc-brand">
        <div className="cc-brand-mark">NA</div>
        <div>
          <div className="cc-brand-name">NeoAgro</div>
          <div className="cc-brand-sub">NOVA Agriculture</div>
        </div>
      </div>
      <nav className="cc-nav">
        {modules.map((module) => (
          <a key={module.id} href={`#${module.id}`} className={`cc-nav-item ${module.id === 'dashboard' ? 'active' : ''}`}>
            <span className={statusClass(module.accent)} />
            <span>{module.label}</span>
          </a>
        ))}
      </nav>
      <div className="cc-system-card">
        <div className="micro-label">Ecosystem</div>
        <div className="system-line"><span />NOVA Core</div>
        <div className="system-line"><span />NeoGrid</div>
        <div className="system-line"><span />NeoCell</div>
      </div>
    </aside>
  );
}

function Topbar({ summary }: { summary: DashboardSummary }) {
  return (
    <header className="cc-topbar">
      <div>
        <div className="micro-label">OPERATIONS DASHBOARD</div>
        <div className="topbar-title">Mesa Verde 01 / SolarHub Demo</div>
      </div>
      <div className="topbar-metrics">
        <span>Solar <strong>98.2%</strong></span>
        <span>Crop <strong>{summary.site.health_score}%</strong></span>
        <span>Water <strong>87.1%</strong></span>
      </div>
    </header>
  );
}

function KpiStrip({ summary }: { summary: DashboardSummary }) {
  return (
    <section className="kpi-strip" aria-label="Key operating indicators">
      {summary.kpis.map((metric: Metric) => (
        <article className="cc-kpi" key={metric.label}>
          <div className="micro-label">{metric.trend}</div>
          <div className="kpi-value">{format(metric.value, metric.unit)}</div>
          <div className="kpi-label">{metric.label}</div>
        </article>
      ))}
    </section>
  );
}

function ModuleGrid() {
  return (
    <section className="module-grid" aria-label="NeoAgro module status">
      {modules.slice(1).map((module) => (
        <article className="module-card" key={module.id}>
          <div className="module-head">
            <span className={statusClass(module.accent)} />
            <span>{module.status}</span>
          </div>
          <h3>{module.label}</h3>
          <p>{module.detail}</p>
        </article>
      ))}
    </section>
  );
}

function ZoneMatrix() {
  return (
    <div className="zone-grid" aria-label="ZONE STATUS MATRIX">
      {zones.map((zone) => (
        <div className={`zone-tile zone-${zone.status}`} key={zone.id}>
          <div className="zone-id">{zone.id}</div>
          <div className="zone-crop">{zone.crop}</div>
          <div className="zone-meta">Health {zone.health}% / VWC {zone.moisture}%</div>
        </div>
      ))}
    </div>
  );
}

function NovaCorePanel({ nova }: { nova: NovaInsight }) {
  return (
    <section className="panel-grid" aria-label="NOVA Core AI v0 workflow">
      <article className="cc-panel highlight-panel" id="ai">
        <div className="micro-label">NOVA Core Forecast / {nova.connected ? 'connected' : 'fallback'}</div>
        <h2>Shared AI v0 risk model</h2>
        <dl className="impact-list">
          <div><dt>Heat risk</dt><dd>{nova.forecast.heat_risk}</dd></div>
          <div><dt>Water demand delta</dt><dd>{nova.forecast.water_demand_delta_pct}%</dd></div>
          <div><dt>Solar production delta</dt><dd>{nova.forecast.solar_production_delta_pct}%</dd></div>
          <div><dt>Yield risk</dt><dd>{nova.forecast.yield_risk}</dd></div>
        </dl>
      </article>
      <article className="cc-panel">
        <div className="micro-label">Scenario Simulation</div>
        <h2>Baseline vs optimized</h2>
        <dl className="impact-list">
          <div><dt>Baseline water use</dt><dd>{nova.simulation.baseline?.water_use_m3} m3</dd></div>
          <div><dt>Optimized water use</dt><dd>{nova.simulation.optimized?.water_use_m3} m3</dd></div>
          <div><dt>Grid dependency</dt><dd>{nova.simulation.optimized?.grid_dependency}</dd></div>
        </dl>
      </article>
      <article className="cc-panel recommendation-panel">
        <div className="micro-label">NOVA Recommendation / {nova.recommendation.priority}</div>
        <h2>{nova.recommendation.title}</h2>
        <p>{nova.recommendation.explanation}</p>
        <div className="tag-row">
          <span className="cc-tag">Confidence {Math.round((nova.recommendation.confidence ?? 0) * 100)}%</span>
          <span className="cc-tag">Operator approval required</span>
        </div>
      </article>
      <article className="cc-panel guardrail-panel">
        <div className="micro-label">Assistant Explanation</div>
        <h2>Why NOVA recommends this</h2>
        <p>{nova.explanation.what_is_happening}</p>
        <p>{nova.explanation.why_it_matters}</p>
        <p>{nova.explanation.what_happens_next}</p>
        <div className="tag-row"><span className="cc-tag">Action: {nova.explanation.what_to_do}</span></div>
      </article>
    </section>
  );
}

function AssetRegistry() {
  return (
    <section className="panel-grid asset-section" id="assets" aria-label="UNIVERSAL ASSET REGISTRY">
      <article className="cc-panel wide-panel">
        <div className="micro-label">UNIVERSAL ASSET REGISTRY</div>
        <h2>NOVA OS shared asset layer</h2>
        <p>
          Bridges solar panels, inverters, field zones, reservoirs, pumps, batteries, and infrastructure modules into one operator-visible registry.
        </p>
        <div className="asset-table">
          {assets.map((asset) => (
            <div className="asset-row" key={asset.code}>
              <span>{asset.type}</span>
              <strong>{asset.name}</strong>
              <span>{asset.code}</span>
              <span>{asset.status}</span>
              <span>{asset.linked}</span>
            </div>
          ))}
        </div>
      </article>
      <article className="cc-panel">
        <div className="micro-label">KNOWLEDGE GRAPH</div>
        <h2>Example operational chain</h2>
        <div className="graph-chain">
          {graphChain.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
        </div>
      </article>
      <article className="cc-panel">
        <div className="micro-label">NEOGRID ENERGY ASSETS</div>
        <h2>Energy compatibility</h2>
        <p>Battery Bank 1, Transformer T1, EV charger, inverter fleet, and solar array telemetry are ready for NeoGrid alignment.</p>
      </article>
      <article className="cc-panel">
        <div className="micro-label">NEOCELL INFRASTRUCTURE MODULES</div>
        <h2>Infrastructure compatibility</h2>
        <p>Pumps, reservoirs, edge sensors, and field infrastructure are modeled as reusable NOVA assets.</p>
      </article>
    </section>
  );
}

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const nova = await getNovaCoreInsight();

  return (
    <div className="cc-shell">
      <ModuleRail />
      <div className="cc-main">
        <Topbar summary={summary} />
        <main className="cc-content" id="dashboard">
          <section className="hero-panel">
            <div>
              <div className="micro-label">SolarHub Demo Scenario</div>
              <h1>{summary.scenario}</h1>
              <p>
                {summary.site.name} is monitored by NOVA Agriculture with live agrivoltaic context across solar, crop, water,
                sustainability, digital twin, and operator-approved AI recommendations.
              </p>
              <div className="workflow-row">
                {summary.workflow.map((step: string) => <span key={step}>{step}</span>)}
              </div>
            </div>
            <div className="hero-status">
              <div className="micro-label">NOVA Core AI v0</div>
              <strong>{nova.connected ? 'connected' : 'fallback'}</strong>
              <span>main branch integration</span>
            </div>
          </section>

          <KpiStrip summary={summary} />
          <ModuleGrid />

          <section className="panel-grid">
            <article className="cc-panel wide-panel" id="solar">
              <div className="panel-title-row">
                <div>
                  <div className="micro-label">TODAY'S SOLAR OUTPUT</div>
                  <h2>Real-time generation profile</h2>
                </div>
                <span className="cc-tag">Peak 487 kW</span>
              </div>
              <BarChart />
            </article>
            <article className="cc-panel" id="agriculture">
              <div className="micro-label">ZONE STATUS MATRIX</div>
              <h2>Crop and soil health</h2>
              <ZoneMatrix />
            </article>
            <article className="cc-panel" id="water">
              <div className="micro-label">IRRIGATION SCHEDULE</div>
              <h2>Recommended operator window</h2>
              <p>Shift irrigation to 19:00-21:00 to reduce evaporation and avoid the heat peak.</p>
              <dl className="impact-list">
                <div><dt>Water demand</dt><dd>{summary.forecast.water_demand_delta_pct}%</dd></div>
                <div><dt>Water savings</dt><dd>{summary.impact.expected_water_savings_m3} m3</dd></div>
              </dl>
            </article>
            <article className="cc-panel" id="forecasting">
              <div className="micro-label">METEOROLOGICAL FORECAST</div>
              <h2>Heatwave and yield risk</h2>
              <p>Maximum temperature {summary.forecast.max_temperature_c} C with {summary.forecast.yield_risk} yield risk.</p>
              <p>Solar production change: {summary.forecast.solar_production_delta_pct}%.</p>
            </article>
          </section>

          <NovaCorePanel nova={nova} />
          <AssetRegistry />
        </main>
      </div>
    </div>
  );
}
