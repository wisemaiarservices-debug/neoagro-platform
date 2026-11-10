'use client';

import { AlertTriangle, Award, Battery, Calendar, CheckCircle2, Cpu, Download, Droplets, Gauge, Leaf, Sparkles, Sprout, Sun, TrendingUp, Wheat, Wifi, Zap } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MetricCard } from './metric-card';
import { NeoAgroShell, PageHeader } from './neoagro-shell';
import {
  aiRecommendations,
  batteryStatus,
  carbonMonthly,
  cropFields,
  energyForecast,
  esgMetrics,
  fieldSensors,
  optimizations,
  predictions,
  soilMoisture,
  solarProductionToday,
  sustainabilityScore,
  waterDemandForecast,
  waterUsage,
  weeklyEnergy,
  yieldForecast,
} from '../lib/lovable-neoagro-data';
import type { NovaCoreInsight } from '../lib/nova-core';
import type { Metric } from '../lib/demo';

type DashboardSummary = {
  site: { name: string; status?: string; health_score: number | null };
  scenario: string;
  workflow: string[];
  kpis: Metric[];
  forecast: Record<string, number | string | null>;
  impact: Record<string, number | string | null>;
};

const tooltipStyle = {
  backgroundColor: '#17241f',
  border: '1px solid rgba(90, 130, 112, .45)',
  borderRadius: 8,
  color: '#e8f4ee',
  fontSize: 12,
};

export function DashboardView({ summary, nova }: { summary: DashboardSummary; nova: NovaCoreInsight }) {
  const cropHealthAvg = Math.round(cropFields.reduce((total, field) => total + field.health, 0) / cropFields.length);
  const soilToday = soilMoisture.at(-1)!;
  const waterToday = waterUsage.at(-1)!;
  const energyMix = [
    { name: 'Solar Direct', value: 58, fill: 'var(--ag-solar)' },
    { name: 'Battery', value: 27, fill: 'var(--ag-green)' },
    { name: 'Grid', value: 15, fill: 'var(--ag-water)' },
  ];

  return (
    <NeoAgroShell>
      <PageHeader
        title="Operations Dashboard"
        subtitle="Illustrative SolarHub UI fixtures · not live field telemetry or validated model output"
        actions={<><button className="ag-button ghost"><Calendar size={14} /> Today</button><button className="ag-button ghost"><Download size={14} /> Export</button></>}
      />
      <section className="ag-hero">
        <div>
          <div className="ag-micro">SolarHub Demo Scenario</div>
          <h2>{summary.scenario}</h2>
          <p>{summary.site.name} is represented with illustrative interface fixtures. No live field, crop, water, weather or energy telemetry is connected.</p>
          <div className="ag-chip-row">{summary.workflow.map((step) => <span key={step}>{step}</span>)}</div>
        </div>
        <div className="ag-hero-status">
          <div className="ag-micro">NOVA Core API</div>
          <strong>{nova.connected ? 'API responding' : 'Not connected'}</strong>
          <span>Input provenance still requires verification</span>
        </div>
      </section>

      <section className="ag-grid three">
        <MetricCard label="Solar Production · demo" value="487" unit=" kW peak" delta="+8.4%" icon={Sun} tint="solar">
          <MiniArea data={solarProductionToday} dataKey="kw" color="var(--ag-solar)" />
        </MetricCard>
        <MetricCard label="Battery Status · demo" value={`${batteryStatus.charge}%`} unit={` / ${batteryStatus.capacity} kWh`} delta="+2.1%" icon={Battery}>
          <div className="ag-progress"><span style={{ width: `${batteryStatus.charge}%` }} /></div>
          <div className="ag-split"><span>Charging {batteryStatus.flow} kW</span><span>Health {batteryStatus.health}%</span></div>
        </MetricCard>
        <MetricCard label="Crop Health · demo" value={`${cropHealthAvg}`} unit=" / 100 avg" delta="+1.2%" icon={Sprout}>
          <div className="ag-field-bars">{cropFields.map((field) => <span key={field.id} style={{ height: `${field.health}%` }} title={field.name} />)}</div>
        </MetricCard>
        <MetricCard label="Soil Moisture · demo" value={`${soilToday.root}%`} unit=" root zone" delta="-3.0%" icon={Droplets} tint="water">
          <div className="ag-list"><span>Surface <b>{soilToday.surface}%</b></span><span>Root <b>{soilToday.root}%</b></span><span>Deep <b>{soilToday.deep}%</b></span></div>
        </MetricCard>
        <MetricCard label="Water Usage · demo" value={`${waterToday.used}`} unit=" L today" delta="-6.2%" icon={Gauge} tint="water">
          <p>Water savings are not calculated. A verified meter baseline and intervention period are required.</p>
        </MetricCard>
        <MetricCard label="Sustainability Score · demo" value={`${sustainabilityScore.overall}`} unit=" / 100" delta="+4.0%" icon={Leaf}>
          <p>No audited ESG, carbon or water outcome data has been supplied.</p>
        </MetricCard>
      </section>

      <section className="ag-grid chart-row">
        <Panel wide title="Solar production / today" subtitle="Illustrative sample series · no inverter feed or validated forecast">
          <ChartBox>
            <AreaChart data={solarProductionToday}>
              <CartesianGrid stroke="var(--ag-border)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area dataKey="forecast" stroke="var(--ag-muted)" strokeDasharray="4 4" fill="transparent" />
              <Area dataKey="kw" stroke="var(--ag-solar)" fill="rgba(240,176,96,.16)" strokeWidth={2.5} />
            </AreaChart>
          </ChartBox>
        </Panel>
        <Panel title="Energy mix" subtitle="Illustrative sample split · not a measured energy balance">
          <ChartBox compact>
            <PieChart>
              <Pie data={energyMix} dataKey="value" innerRadius={48} outerRadius={76} strokeWidth={0}>
                {energyMix.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ChartBox>
          <div className="ag-list">{energyMix.map((entry) => <span key={entry.name}>{entry.name}<b>{entry.value}%</b></span>)}</div>
        </Panel>
      </section>

      <section className="ag-grid three">
        <Panel title="Weekly energy" subtitle="Produced / consumed / exported">
          <ChartBox compact><BarChart data={weeklyEnergy}><CartesianGrid stroke="var(--ag-border)" vertical={false} /><XAxis dataKey="day" tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} /><YAxis tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="produced" fill="var(--ag-solar)" /><Bar dataKey="consumed" fill="var(--ag-green)" /><Bar dataKey="exported" fill="var(--ag-water)" /></BarChart></ChartBox>
        </Panel>
        <Panel title="Soil moisture" subtitle="7-day depth profile">
          <ChartBox compact><LineChart data={soilMoisture}><CartesianGrid stroke="var(--ag-border)" vertical={false} /><XAxis dataKey="day" tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} /><YAxis tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Line dataKey="surface" stroke="var(--ag-solar)" strokeWidth={2} dot={false} /><Line dataKey="root" stroke="var(--ag-water)" strokeWidth={2.5} dot={false} /><Line dataKey="deep" stroke="var(--ag-green)" strokeWidth={2} dot={false} /></LineChart></ChartBox>
        </Panel>
        <Panel title="NOVA Core recommendation" subtitle={`AI v0 / ${nova.connected ? 'connected' : 'fallback'}`}>
          <h3>{nova.recommendation.title}</h3>
          <p>{nova.recommendation.explanation}</p>
          <div className="ag-chip-row"><span>Confidence {Math.round((nova.recommendation.confidence ?? 0) * 100)}%</span><span>Operator approval required</span></div>
        </Panel>
      </section>

      <section className="ag-panel" id="Asset Registry">
        <div className="ag-panel-head"><div><h3>Crop blocks and field zones</h3><p>Active monitoring zones across the agrivoltaic site.</p></div></div>
        <div className="ag-table">
          {cropFields.map((field) => (
            <div key={field.id}>
              <strong>{field.name}</strong><span>{field.area} ha</span><span>NDVI {field.ndvi.toFixed(2)}</span><span>{field.stage}</span><span>Health {field.health}</span><span>{field.yieldEst} t</span>
            </div>
          ))}
        </div>
      </section>
    </NeoAgroShell>
  );
}

export function ForecastingView() {
  return (
    <NeoAgroShell>
      <PageHeader title="Forecasting" subtitle="Forecasts are disabled until validated weather, crop, soil, energy and water inputs are connected." />
      <section className="ag-grid three">
        <MetricCard label="Energy forecast" value="—" unit="MWh" delta="Not generated" icon={Zap} tint="solar" />
        <MetricCard label="Yield forecast" value="—" unit="tons" delta="Not generated" icon={Wheat} />
        <MetricCard label="Water demand" value="—" unit="kL" delta="Not generated" icon={Droplets} tint="water" />
      </section>
      <Panel title="Forecast readiness" subtitle="No quantitative forecast or confidence interval is currently issued">
        <ul className="ag-list">
          <li>Verified weather observations or attributed gridded provider data</li>
          <li>Site coordinates, timezone and reporting period</li>
          <li>Crop, cultivar, phenology, root depth and soil-water parameters</li>
          <li>Metered irrigation, solar and energy time series</li>
          <li>Versioned historical data and out-of-sample validation</li>
        </ul>
      </Panel>
    </NeoAgroShell>
  );
}

export function RecommendationsView({ nova }: { nova: NovaCoreInsight }) {
  const coreItem = {
    id: "nova-core-review",
    priority: nova.recommendation.priority ?? "review_required",
    category: "NOVA Core",
    title: nova.recommendation.title ?? "Verify site inputs before operational screening",
    impact: nova.recommendation.explanation ?? "No operational advice is available.",
    confidence: typeof nova.recommendation.confidence === "number" ? nova.recommendation.confidence : null,
    eta: nova.connected ? "API responding · input verification required" : "Local fallback · no operational advice",
  };
  return (
    <NeoAgroShell>
      <PageHeader title="Decision Support Review" subtitle="Review-only screening. No crop-specific prescription, dispatch action or quantified impact is generated from demo data." />
      <section className="ag-grid four">{predictions.map((item) => <MetricCard key={item.label} label={item.label} value={item.value} delta={item.delta} positive={false} icon={TrendingUp} />)}</section>
      <section className="ag-grid two">
        {[...aiRecommendations, coreItem].map((item) => (
          <article key={item.id} className="ag-panel recommendation">
            <div className="ag-rec-head"><span className="priority">{item.priority}</span><span>{item.category}</span><b>{item.confidence == null ? "Not calibrated" : String(Math.round(item.confidence * 100)) + "%"}</b></div>
            <h3>{item.title}</h3>
            <p>{item.impact}</p>
            <div className="ag-rec-actions"><span>{item.eta}</span><span>Human review only</span></div>
          </article>
        ))}
      </section>
      <Panel title="Optimization outputs withheld" subtitle="No optimization is run without verified constraints and a validated method">
        <ul className="ag-list">
          <li>Crop and soil calibration, including field capacity and root-zone conditions</li>
          <li>Verified weather and energy data with timestamps and units</li>
          <li>Equipment constraints, safety limits and operator-defined objectives</li>
          <li>Measured baseline, validation protocol and uncertainty reporting</li>
        </ul>
      </Panel>
    </NeoAgroShell>
  );
}

export function SustainabilityView() {
  return (
    <NeoAgroShell>
      <PageHeader title="Sustainability & Impact Accounting" subtitle="No carbon, water, yield or resilience impact is claimed without a verified baseline and intervention measurements." />
      <section className="ag-grid four">
        <MetricCard label="Carbon impact" value="—" unit="kg CO2e" delta="Not calculated" icon={Leaf} />
        <MetricCard label="Water savings" value="—" unit="%" delta="Not calculated" icon={Droplets} tint="water" />
        <MetricCard label="Renewable ratio" value="—" unit="%" delta="Not measured" icon={Zap} tint="solar" />
        <MetricCard label="ESG score" value="—" unit="" delta="Not audited" icon={Award} />
      </section>
      <Panel title="Evidence required for impact reporting" subtitle="No verified outcome dataset is currently connected">
        <ul className="ag-list">
          <li>Defined site boundary, reporting period and ownership</li>
          <li>Metered energy and water baseline plus intervention period</li>
          <li>Verified grid emissions factor and calculation method</li>
          <li>Crop yield, soil and biodiversity measurements where relevant</li>
          <li>Uncertainty, data completeness and independent review</li>
        </ul>
      </Panel>
    </NeoAgroShell>
  );
}

export function DigitalTwinView() {
  return (
    <NeoAgroShell>
      <PageHeader title="Digital Twin" subtitle="Conceptual layout of panels, sensors, irrigation, weather, and field zones · not georeferenced" actions={<span className="ag-live">Demo schematic · no live feed</span>} />
      <section className="ag-grid twin-layout">
        <div className="ag-panel ag-twin-map">
          <svg className="ag-map-grid" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(180,220,198,.14)" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          {Array.from({ length: 8 }).map((_, row) => <div key={row} className="ag-panel-row" style={{ top: `${12 + row * 10}%` }}>{Array.from({ length: 14 }).map((__, col) => <span key={col} />)}</div>)}
          {fieldSensors.map((sensor) => <div key={sensor.id} className={`ag-sensor ${sensor.status}`} style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}><span /><b>{sensor.id}</b><em>{sensor.type} / {sensor.value}</em></div>)}
          <div className="ag-compass">N</div>
          <div className="ag-coords">Conceptual layout · no site coordinates or measured area</div>
        </div>
        <aside className="ag-twin-side">
          <Panel title="Example alert states" subtitle="Illustrative placeholders · no live alert feed">
            <Alert icon={AlertTriangle} title="Panel S-18 offline" body="No output for 47 min / dispatch crew" tint="bad" />
            <Alert icon={Droplets} title="Soil moisture low / Strawberry" body="Sensor S-21 at 38%, target 55%" tint="warn" />
            <Alert icon={Wifi} title="Gateway packet loss" body="22% over 10 min, retry in progress" tint="warn" />
          </Panel>
          <Panel title="Asset summary" subtitle="Registry not connected">
            <div className="ag-list"><span>Solar panels <b>Not registered</b></span><span>Edge nodes <b>Not registered</b></span><span>Irrigation valves <b>Not registered</b></span><span>Weather stations <b>Not registered</b></span></div>
          </Panel>
          <Panel title="Twin sync" subtitle="Synchronization not configured"><div className="ag-score">—</div><p>No device registry or telemetry stream is connected.</p></Panel>
        </aside>
      </section>
    </NeoAgroShell>
  );
}

function MiniArea({ data, dataKey, color }: { data: Array<Record<string, number | string>>; dataKey: string; color: string }) {
  return <div className="ag-mini-chart"><ResponsiveContainer><AreaChart data={data}><Area dataKey={dataKey} stroke={color} fill="rgba(240,176,96,.14)" /></AreaChart></ResponsiveContainer></div>;
}

function ChartBox({ children, compact = false }: { children: React.ReactElement; compact?: boolean }) {
  return <div className={compact ? 'ag-chart compact' : 'ag-chart'}><ResponsiveContainer>{children}</ResponsiveContainer></div>;
}

function Panel({ title, subtitle, children, wide = false }: { title: string; subtitle?: string; children: React.ReactNode; wide?: boolean }) {
  return <article className={`ag-panel ${wide ? 'wide' : ''}`}><div className="ag-panel-head"><div><h3>{title}</h3>{subtitle ? <p>{subtitle}</p> : null}</div><CheckCircle2 size={18} /></div>{children}</article>;
}

function Alert({ icon: Icon, title, body, tint }: { icon: typeof AlertTriangle; title: string; body: string; tint: 'warn' | 'bad' }) {
  return <div className={`ag-alert ${tint}`}><Icon size={18} /><div><strong>{title}</strong><span>{body}</span></div></div>;
}
