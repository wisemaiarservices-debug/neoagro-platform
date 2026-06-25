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
  { day: 'Mon', used: 1280, saved: 410 },
  { day: 'Tue', used: 1214, saved: 448 },
  { day: 'Wed', used: 1190, saved: 465 },
  { day: 'Thu', used: 1162, saved: 492 },
  { day: 'Fri', used: 1128, saved: 516 },
  { day: 'Sat', used: 1106, saved: 535 },
  { day: 'Sun', used: 1088, saved: 552 },
];

export const sustainabilityScore = {
  overall: 87,
  carbonOffset: 142.6,
  waterSaved: 38.2,
  renewableRatio: 92,
  panels: [
    { label: 'Carbon', value: 91 },
    { label: 'Water', value: 84 },
    { label: 'Energy', value: 92 },
    { label: 'Biodiversity', value: 78 },
    { label: 'Soil', value: 88 },
    { label: 'Yield', value: 86 },
  ],
};

export const energyForecast = [
  { date: 'Jun 25', low: 1620, expected: 2260, high: 2760 },
  { date: 'Jun 26', low: 1740, expected: 2390, high: 2920 },
  { date: 'Jun 27', low: 1810, expected: 2460, high: 3010 },
  { date: 'Jun 28', low: 1780, expected: 2425, high: 2960 },
  { date: 'Jun 29', low: 1660, expected: 2310, high: 2840 },
  { date: 'Jun 30', low: 1585, expected: 2198, high: 2690 },
  { date: 'Jul 01', low: 1715, expected: 2365, high: 2885 },
  { date: 'Jul 02', low: 1832, expected: 2510, high: 3074 },
];

export const yieldForecast = [
  { field: 'Lettuce', previous: 9.9, estimated: 11.4, potential: 13.1 },
  { field: 'Tomatoes', previous: 33.8, estimated: 38.2, potential: 43.9 },
  { field: 'Spinach', previous: 8.4, estimated: 9.6, potential: 11.0 },
  { field: 'Strawberry', previous: 5.2, estimated: 6.1, potential: 7.0 },
];

export const waterDemandForecast = [
  { date: 'Jun 25', demand: 1120, supply: 1520 },
  { date: 'Jun 26', demand: 1184, supply: 1488 },
  { date: 'Jun 27', demand: 1238, supply: 1455 },
  { date: 'Jun 28', demand: 1322, supply: 1420 },
  { date: 'Jun 29', demand: 1380, supply: 1395 },
  { date: 'Jun 30', demand: 1412, supply: 1410 },
  { date: 'Jul 01', demand: 1368, supply: 1452 },
  { date: 'Jul 02', demand: 1296, supply: 1490 },
];

export const aiRecommendations = [
  {
    id: 'rec-evening-irrigation-001',
    priority: 'high' as const,
    category: 'Water',
    title: 'Shift irrigation to evening window',
    impact: 'Save 3.2 m3/day and reduce heat-driven evaporation during the 39 C operating window.',
    confidence: 0.87,
    eta: 'Operator review today',
  },
  {
    id: 'rec-shade-balance-001',
    priority: 'high' as const,
    category: 'Solar / Crop',
    title: 'Hold panel row 7 at crop-protective tilt',
    impact: 'Balance solar production with shade coverage for Zone 4-B until soil moisture recovers.',
    confidence: 0.84,
    eta: 'Apply after approval',
  },
  {
    id: 'rec-sensor-check-001',
    priority: 'medium' as const,
    category: 'Infrastructure',
    title: 'Inspect soil sensor node A3',
    impact: 'Restore telemetry confidence before the heat peak and improve forecast stability.',
    confidence: 0.78,
    eta: 'Within 24 hours',
  },
  {
    id: 'rec-load-shift-001',
    priority: 'low' as const,
    category: 'Energy',
    title: 'Shift packing load to peak solar window',
    impact: 'Use local solar generation and reduce grid draw by 18 kWh.',
    confidence: 0.72,
    eta: 'Next schedule cycle',
  },
];

export const predictions = [
  { label: 'Next 7d energy', value: '16.8 MWh', delta: '+4.2%', positive: true },
  { label: 'Next 7d yield', value: '12.4 t', delta: '+1.8%', positive: true },
  { label: 'Water demand', value: '9.8 kL', delta: '-6.1%', positive: true },
  { label: 'Carbon offset', value: '2.74 t', delta: '+3.0%', positive: true },
];

export const optimizations = [
  { label: 'Energy mix optimization', before: 78, after: 92 },
  { label: 'Irrigation efficiency', before: 64, after: 88 },
  { label: 'Panel-crop shading balance', before: 71, after: 86 },
  { label: 'Predictive maintenance', before: 55, after: 81 },
];

export const carbonMonthly = [
  { month: 'Jan', offset: 8, baseline: 14 },
  { month: 'Feb', offset: 9, baseline: 14 },
  { month: 'Mar', offset: 10, baseline: 14 },
  { month: 'Apr', offset: 11, baseline: 14 },
  { month: 'May', offset: 12, baseline: 14 },
  { month: 'Jun', offset: 13, baseline: 14 },
  { month: 'Jul', offset: 14, baseline: 14 },
  { month: 'Aug', offset: 13, baseline: 14 },
  { month: 'Sep', offset: 12, baseline: 14 },
  { month: 'Oct', offset: 11, baseline: 14 },
  { month: 'Nov', offset: 10, baseline: 14 },
  { month: 'Dec', offset: 9, baseline: 14 },
];

export const esgMetrics = [
  { pillar: 'Environmental', score: 91, items: ['Carbon -42%', 'Water -38%', 'Biodiversity +24%'] },
  { pillar: 'Social', score: 84, items: ['Local jobs +18', 'Worker safety A', 'Community grants'] },
  { pillar: 'Governance', score: 88, items: ['ISO 14001', 'Audit clean', 'Board diversity 50%'] },
];

export const fieldSensors = [
  { id: 'S-12', x: 18, y: 28, type: 'soil', value: '62%', status: 'ok' },
  { id: 'S-07', x: 42, y: 18, type: 'panel', value: '412W', status: 'ok' },
  { id: 'S-21', x: 64, y: 36, type: 'soil', value: '38%', status: 'warn' },
  { id: 'S-04', x: 78, y: 60, type: 'weather', value: '39 C', status: 'ok' },
  { id: 'S-33', x: 30, y: 70, type: 'water', value: '12 L/m', status: 'ok' },
  { id: 'S-18', x: 52, y: 52, type: 'panel', value: '0W', status: 'alert' },
  { id: 'S-29', x: 86, y: 22, type: 'soil', value: '55%', status: 'ok' },
];
