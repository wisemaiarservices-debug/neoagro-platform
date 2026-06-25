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
  site: { name: string; status?: string; health_score: number };
  scenario: string;
  workflow: string[];
  kpis: Metric[];
  forecast: Record<string, number | string>;
  impact: Record<string, number | string>;
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
        subtitle="Real Lovable NeoAgro source adapted into the NOVA Agriculture app with deterministic SolarHub data"
        actions={<><button className="ag-button ghost"><Calendar size={14} /> Today</button><button className="ag-button ghost"><Download size={14} /> Export</button></>}
      />
      <section className="ag-hero">
        <div>
          <div className="ag-micro">SolarHub Demo Scenario</div>
          <h2>{summary.scenario}</h2>
          <p>{summary.site.name} is monitored across solar, crop health, water systems, yield risk, digital twin state, and operator-approved NOVA Core AI recommendations.</p>
          <div className="ag-chip-row">{summary.workflow.map((step) => <span key={step}>{step}</span>)}</div>
        </div>
        <div className="ag-hero-status">
          <div className="ag-micro">NOVA Core AI v0</div>
          <strong>{nova.connected ? 'connected' : 'fallback'}</strong>
          <span>main branch integration</span>
        </div>
      </section>

      <section className="ag-grid three">
        <MetricCard label="Solar Production" value="487" unit=" kW peak" delta="+8.4%" icon={Sun} tint="solar">
          <MiniArea data={solarProductionToday} dataKey="kw" color="var(--ag-solar)" />
        </MetricCard>
        <MetricCard label="Battery Status" value={`${batteryStatus.charge}%`} unit={` / ${batteryStatus.capacity} kWh`} delta="+2.1%" icon={Battery}>
          <div className="ag-progress"><span style={{ width: `${batteryStatus.charge}%` }} /></div>
          <div className="ag-split"><span>Charging {batteryStatus.flow} kW</span><span>Health {batteryStatus.health}%</span></div>
        </MetricCard>
        <MetricCard label="Crop Health" value={`${cropHealthAvg}`} unit=" / 100 avg" delta="+1.2%" icon={Sprout}>
          <div className="ag-field-bars">{cropFields.map((field) => <span key={field.id} style={{ height: `${field.health}%` }} title={field.name} />)}</div>
        </MetricCard>
        <MetricCard label="Soil Moisture" value={`${soilToday.root}%`} unit=" root zone" delta="-3.0%" icon={Droplets} tint="water">
          <div className="ag-list"><span>Surface <b>{soilToday.surface}%</b></span><span>Root <b>{soilToday.root}%</b></span><span>Deep <b>{soilToday.deep}%</b></span></div>
        </MetricCard>
        <MetricCard label="Water Usage" value={`${waterToday.used}`} unit=" L today" delta="-6.2%" icon={Gauge} tint="water">
          <p><b>{waterToday.saved} L</b> saved via AI scheduling.</p>
        </MetricCard>
        <MetricCard label="Sustainability Score" value={`${sustainabilityScore.overall}`} unit=" / 100" delta="+4.0%" icon={Leaf}>
          <p>ESG composite / {sustainabilityScore.carbonOffset} t CO2 offset YTD.</p>
        </MetricCard>
      </section>

      <section className="ag-grid chart-row">
        <Panel wide title="Solar production / today" subtitle="Live kW output vs forecast">
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
        <Panel title="Energy mix" subtitle="Solar, battery, and grid source split">
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
  const totalEnergy = energyForecast.reduce((total, day) => total + day.expected, 0);
  const totalYield = yieldForecast.reduce((total, day) => total + day.estimated, 0);
  const totalWater = waterDemandForecast.reduce((total, day) => total + day.demand, 0);

  return (
    <NeoAgroShell>
      <PageHeader title="Forecasting" subtitle="14-day predictive outlook for energy production, yield risk, and water demand" />
      <section className="ag-grid three">
        <MetricCard label="Energy / 14 day total" value={`${(totalEnergy / 1000).toFixed(1)}`} unit=" MWh" delta="+5.8%" icon={Zap} tint="solar" />
        <MetricCard label="Yield / 14 day total" value={`${totalYield.toFixed(1)}`} unit=" tons" delta="+2.3%" icon={Wheat} />
        <MetricCard label="Water demand" value={`${(totalWater / 1000).toFixed(1)}`} unit=" kL" delta="-4.1%" icon={Droplets} tint="water" />
      </section>
      <Panel title="Energy production forecast" subtitle="Expected output range with low/high confidence bounds">
        <ChartBox><ComposedChart data={energyForecast}><CartesianGrid stroke="var(--ag-border)" vertical={false} /><XAxis dataKey="date" tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} /><YAxis tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Area dataKey="high" stroke="transparent" fill="rgba(240,176,96,.18)" /><Area dataKey="low" stroke="transparent" fill="var(--ag-bg)" /><Line dataKey="expected" stroke="var(--ag-solar)" strokeWidth={2.5} /></ComposedChart></ChartBox>
      </Panel>
      <section className="ag-grid two">
        <Panel title="Yield forecast by crop" subtitle="Previous, estimated, and potential tons">
          <ChartBox><BarChart data={yieldForecast} layout="vertical"><CartesianGrid stroke="var(--ag-border)" horizontal={false} /><XAxis type="number" tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} /><YAxis dataKey="field" type="category" tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} width={82} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="previous" fill="var(--ag-muted)" /><Bar dataKey="estimated" fill="var(--ag-green)" /><Bar dataKey="potential" fill="var(--ag-solar)" /></BarChart></ChartBox>
        </Panel>
        <Panel title="Water demand vs supply" subtitle="14-day balance">
          <ChartBox><AreaChart data={waterDemandForecast}><CartesianGrid stroke="var(--ag-border)" vertical={false} /><XAxis dataKey="date" tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} /><YAxis tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Area dataKey="supply" stroke="var(--ag-green)" fill="rgba(120,204,80,.14)" /><Area dataKey="demand" stroke="var(--ag-water)" fill="rgba(96,168,255,.14)" /></AreaChart></ChartBox>
        </Panel>
      </section>
    </NeoAgroShell>
  );
}

export function RecommendationsView({ nova }: { nova: NovaCoreInsight }) {
  return (
    <NeoAgroShell>
      <PageHeader title="AI Recommendations" subtitle="Continuous optimization across energy, crop, and water systems" actions={<button className="ag-button"><Sparkles size={14} /> Run analysis</button>} />
      <section className="ag-grid four">{predictions.map((item) => <MetricCard key={item.label} label={item.label} value={item.value} delta={item.delta} positive={item.positive} icon={TrendingUp} />)}</section>
      <section className="ag-grid two">
        {[...aiRecommendations, {
          id: 'nova-core-live',
          priority: nova.recommendation.priority === 'high' ? 'high' as const : 'medium' as const,
          category: 'NOVA Core',
          title: nova.recommendation.title,
          impact: nova.recommendation.explanation,
          confidence: nova.recommendation.confidence ?? 0.8,
          eta: nova.connected ? 'Live API response' : 'Deterministic fallback',
        }].map((item) => (
          <article key={item.id} className="ag-panel recommendation">
            <div className="ag-rec-head"><span className={`priority ${item.priority}`}>{item.priority}</span><span>{item.category}</span><b>{Math.round(item.confidence * 100)}%</b></div>
            <h3>{item.title}</h3>
            <p>{item.impact}</p>
            <div className="ag-rec-actions"><span>{item.eta}</span><button>Approve after review</button></div>
          </article>
        ))}
      </section>
      <Panel title="Optimization suggestions" subtitle="Projected gains from applying operator-approved actions">
        <div className="ag-optimizations">{optimizations.map((item) => <div key={item.label}><span>{item.label}<b>{item.before} {'->'} {item.after}</b></span><div><i style={{ width: `${item.before}%` }} /><em style={{ width: `${item.after}%` }} /></div></div>)}</div>
      </Panel>
    </NeoAgroShell>
  );
}

export function SustainabilityView() {
  return (
    <NeoAgroShell>
      <PageHeader title="Sustainability Reporting" subtitle="ESG performance, carbon reduction, water savings, and renewable energy ratio" />
      <section className="ag-grid four">
        <MetricCard label="Carbon offset YTD" value={`${sustainabilityScore.carbonOffset}`} unit=" t CO2" delta="+12.4%" icon={Leaf} />
        <MetricCard label="Water savings" value={`${sustainabilityScore.waterSaved}%`} delta="+3.2%" icon={Droplets} tint="water" />
        <MetricCard label="Renewable ratio" value={`${sustainabilityScore.renewableRatio}%`} delta="+1.1%" icon={Zap} tint="solar" />
        <MetricCard label="Overall ESG score" value={`${sustainabilityScore.overall}`} unit=" / 100" delta="+4.0%" icon={Award} />
      </section>
      <section className="ag-grid chart-row">
        <Panel wide title="Carbon footprint / 12 month" subtitle="Tons CO2 offset vs baseline">
          <ChartBox><BarChart data={carbonMonthly}><CartesianGrid stroke="var(--ag-border)" vertical={false} /><XAxis dataKey="month" tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} /><YAxis tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="baseline" fill="var(--ag-muted)" opacity={0.45} /><Bar dataKey="offset" fill="var(--ag-green)" /></BarChart></ChartBox>
        </Panel>
        <Panel title="Sustainability dimensions" subtitle="Composite breakdown">
          <ChartBox compact><RadarChart data={sustainabilityScore.panels}><PolarGrid stroke="var(--ag-border)" /><PolarAngleAxis dataKey="label" tick={{ fill: 'var(--ag-muted)', fontSize: 11 }} /><Radar dataKey="value" stroke="var(--ag-green)" fill="rgba(120,204,80,.32)" /></RadarChart></ChartBox>
        </Panel>
      </section>
      <section className="ag-grid three">{esgMetrics.map((pillar) => <article key={pillar.pillar} className="ag-panel"><div className="ag-micro">{pillar.pillar}</div><div className="ag-score">{pillar.score}</div><ul>{pillar.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</section>
    </NeoAgroShell>
  );
}

export function DigitalTwinView() {
  return (
    <NeoAgroShell>
      <PageHeader title="Digital Twin" subtitle="Spatial view of panels, sensors, irrigation, weather, and field zones" actions={<span className="ag-live">Live / 248 sensors</span>} />
      <section className="ag-grid twin-layout">
        <div className="ag-panel ag-twin-map">
          <svg className="ag-map-grid" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(180,220,198,.14)" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          {Array.from({ length: 8 }).map((_, row) => <div key={row} className="ag-panel-row" style={{ top: `${12 + row * 10}%` }}>{Array.from({ length: 14 }).map((__, col) => <span key={col} />)}</div>)}
          {fieldSensors.map((sensor) => <div key={sensor.id} className={`ag-sensor ${sensor.status}`} style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}><span /><b>{sensor.id}</b><em>{sensor.type} / {sensor.value}</em></div>)}
          <div className="ag-compass">N</div>
          <div className="ag-coords">39.4699 N / 0.3763 W / 84 ha</div>
        </div>
        <aside className="ag-twin-side">
          <Panel title="Active alerts" subtitle="Operator-visible events">
            <Alert icon={AlertTriangle} title="Panel S-18 offline" body="No output for 47 min / dispatch crew" tint="bad" />
            <Alert icon={Droplets} title="Soil moisture low / Strawberry" body="Sensor S-21 at 38%, target 55%" tint="warn" />
            <Alert icon={Wifi} title="Gateway packet loss" body="22% over 10 min, retry in progress" tint="warn" />
          </Panel>
          <Panel title="Asset summary" subtitle="Shared NOVA asset registry">
            <div className="ag-list"><span>Solar panels <b>4,820</b></span><span>Edge nodes <b>36</b></span><span>Irrigation valves <b>148</b></span><span>Weather stations <b>6</b></span></div>
          </Panel>
          <Panel title="Twin sync" subtitle="Last full sync 4s ago"><div className="ag-score">99.94%</div></Panel>
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
