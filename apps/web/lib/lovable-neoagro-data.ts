// All non-empty time series in this file are illustrative UI fixtures, not field telemetry or validated forecasts.
export const hours = [
  '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
  '12:00', '14:00', '16:00', '18:00', '20:00', '22:00',
];

export const solarProductionToday = [
  { time: '00:00', kw: 8, forecast: 10 },
  { time: '02:00', kw: 12, forecast: 12 },
  { time: '04:00', kw: 18, forecast: 16 },
  { time: '06:00', kw: 86, forecast: 92 },
  { time: '08:00', kw: 244, forecast: 258 },
  { time: '10:00', kw: 386, forecast: 402 },
  { time: '12:00', kw: 487, forecast: 510 },
  { time: '14:00', kw: 438, forecast: 454 },
  { time: '16:00', kw: 315, forecast: 326 },
  { time: '18:00', kw: 138, forecast: 148 },
  { time: '20:00', kw: 42, forecast: 46 },
  { time: '22:00', kw: 10, forecast: 12 },
];

export const weeklyEnergy = [
  { day: 'Mon', produced: 2120, consumed: 1510, exported: 510 },
  { day: 'Tue', produced: 2380, consumed: 1584, exported: 624 },
  { day: 'Wed', produced: 2515, consumed: 1620, exported: 706 },
  { day: 'Thu', produced: 2470, consumed: 1662, exported: 668 },
  { day: 'Fri', produced: 2295, consumed: 1538, exported: 590 },
  { day: 'Sat', produced: 2172, consumed: 1455, exported: 548 },
  { day: 'Sun', produced: 2358, consumed: 1490, exported: 651 },
];

export const batteryStatus = {
  charge: 78,
  capacity: 540,
  health: 96,
  flow: 12.4,
};

export const cropFields = [
  { id: 'F-01', name: 'North Block / Lettuce', area: 4.2, ndvi: 0.82, stage: 'Vegetative', health: 94, yieldEst: 11.4 },
  { id: 'F-02', name: 'South Block / Tomatoes', area: 6.8, ndvi: 0.74, stage: 'Flowering', health: 88, yieldEst: 38.2 },
  { id: 'F-03', name: 'East Block / Spinach', area: 3.1, ndvi: 0.79, stage: 'Mature', health: 91, yieldEst: 9.6 },
  { id: 'F-04', name: 'West Block / Strawberry', area: 2.4, ndvi: 0.68, stage: 'Fruiting', health: 82, yieldEst: 6.1 },
];

export const soilMoisture = [
  { day: 'Mon', surface: 34, root: 51, deep: 63 },
  { day: 'Tue', surface: 36, root: 53, deep: 64 },
  { day: 'Wed', surface: 33, root: 50, deep: 63 },
  { day: 'Thu', surface: 31, root: 48, deep: 62 },
  { day: 'Fri', surface: 30, root: 47, deep: 61 },
  { day: 'Sat', surface: 29, root: 45, deep: 61 },
  { day: 'Sun', surface: 27, root: 43, deep: 60 },
];

export const waterUsage = [
  { day: 'Mon', used: 1280, saved: null },
  { day: 'Tue', used: 1214, saved: null },
  { day: 'Wed', used: 1190, saved: null },
  { day: 'Thu', used: 1162, saved: null },
  { day: 'Fri', used: 1128, saved: null },
  { day: 'Sat', used: 1106, saved: null },
  { day: 'Sun', used: 1088, saved: null },
];

export const sustainabilityScore = {
  overall: "—",
  carbonOffset: "—",
  waterSaved: "—",
  renewableRatio: "—",
  panels: [],
};

export const energyForecast: Array<{ date: string; low: number; expected: number; high: number }> = [];

export const yieldForecast: Array<{ field: string; previous: number; estimated: number; potential: number }> = [];

export const waterDemandForecast: Array<{ date: string; demand: number; supply: number }> = [];

export const aiRecommendations = [
  {
    id: "neoagro-review-field-data-001",
    priority: "review_required" as const,
    category: "Field data",
    title: "Verify crop, soil, root-zone and sensor data before irrigation assessment",
    impact: "No irrigation prescription or impact estimate generated.",
    confidence: null,
    eta: "Operator review required",
  },
  {
    id: "neoagro-review-source-data-002",
    priority: "review_required" as const,
    category: "Data provenance",
    title: "Connect weather, irrigation meter and energy sources with provenance",
    impact: "Forecasting remains disabled until source quality is verified.",
    confidence: null,
    eta: "Integration required",
  },
  {
    id: "neoagro-review-method-003",
    priority: "review_required" as const,
    category: "Method validation",
    title: "Validate crop-specific ET₀, soil-water and agrivoltaic methods",
    impact: "No calibrated model or validated optimization is available.",
    confidence: null,
    eta: "Scientific validation required",
  },
];

export const predictions = [
  { label: "Energy forecast", value: "—", delta: "Not generated", positive: false },
  { label: "Yield forecast", value: "—", delta: "Not generated", positive: false },
  { label: "Water demand", value: "—", delta: "Not generated", positive: false },
  { label: "Carbon impact", value: "—", delta: "Not calculated", positive: false },
];

export const optimizations: Array<{ label: string; before: number; after: number }> = [];

export const carbonMonthly: Array<{ month: string; offset: number; baseline: number }> = [];

export const esgMetrics = [
  { pillar: "Environmental", score: "—", items: ["No verified carbon baseline", "No metered water baseline", "No audited biodiversity evidence"] },
  { pillar: "Social", score: "—", items: ["No verified workforce dataset", "No audited safety dataset", "No documented community outcomes"] },
  { pillar: "Governance", score: "—", items: ["No audit evidence supplied", "No certification evidence supplied", "No verified governance dataset"] },
];

export const fieldSensors = [
  { id: "DEMO-S-01", x: 18, y: 28, type: "soil", value: "Not connected", status: "unverified" },
  { id: "DEMO-S-02", x: 42, y: 18, type: "panel", value: "Not connected", status: "unverified" },
  { id: "DEMO-S-03", x: 64, y: 36, type: "soil", value: "Not connected", status: "unverified" },
  { id: "DEMO-S-04", x: 78, y: 60, type: "weather", value: "Not connected", status: "unverified" },
  { id: "DEMO-S-05", x: 30, y: 70, type: "water", value: "Not connected", status: "unverified" },
  { id: "DEMO-S-06", x: 52, y: 52, type: "panel", value: "Not connected", status: "unverified" },
  { id: "DEMO-S-07", x: 86, y: 22, type: "soil", value: "Not connected", status: "unverified" },
];
