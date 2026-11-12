import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dashboardSource = readFileSync(join(__dirname, '..', 'components', 'neoagro-pages.tsx'), 'utf8');
const dashboardRouteSource = readFileSync(join(__dirname, '..', 'app', 'dashboard', 'page.tsx'), 'utf8');
const stylesSource = readFileSync(join(__dirname, '..', 'app', 'globals.css'), 'utf8');
const novaCoreSource = readFileSync(join(__dirname, '..', 'lib', 'nova-core.ts'), 'utf8');

test('dashboard preserves Lovable NeoAgro command center modules', () => {
  const requiredMarkers = [
    'Solar Production', 'Crop Health', 'Water Usage', 'Forecasting',
    'Decision Support Review', 'Sustainability', 'Digital Twin',
    'Crop blocks and field zones', 'Solar production / today', 'Soil moisture',
    'Forecast readiness', 'Evidence required for impact reporting',
    'Conceptual layout of panels, sensors, irrigation, weather, and field zones',
  ];
  for (const marker of requiredMarkers) {
    assert.ok(dashboardSource.includes(marker), `Missing dashboard marker: ${marker}`);
  }
});

test('dashboard keeps main NOVA Core integration', () => {
  const requiredMarkers = [
    'getNovaCoreInsight', 'nova.connected', 'NOVA Core API',
    'NOVA Core recommendation', 'Input provenance still requires verification',
    'Local fallback',
  ];
  const novaSource = `${dashboardSource}\\n${dashboardRouteSource}`;
  for (const marker of requiredMarkers) {
    assert.ok(novaSource.includes(marker), `Missing NOVA marker: ${marker}`);
  }
  assert.ok(novaCoreSource.includes('/api/v1/forecast/run'), 'Main NOVA Core forecast endpoint was not preserved.');
  assert.ok(novaCoreSource.includes('/api/v1/recommendations/run'), 'Main NOVA Core recommendation endpoint was not preserved.');
  assert.ok(novaCoreSource.includes('/api/v1/scenarios/simulate'), 'Main NOVA Core simulation endpoint was not preserved.');
  assert.ok(novaCoreSource.includes('/api/v1/assistant/explain'), 'Main NOVA Core assistant endpoint was not preserved.');
});

test('command center theme uses audited dark enterprise shell', () => {
  for (const className of ['.ag-shell', '.ag-sidebar', '.ag-topbar', '.ag-grid', '.ag-twin-map', '.ag-table', '.ag-panel']) {
    assert.ok(stylesSource.includes(className), `Missing CSS class: ${className}`);
  }
});

test('NOVA Core never receives a fabricated default operating state', () => {
  assert.ok(novaCoreSource.includes('state?: NovaCoreState'));
  assert.ok(novaCoreSource.includes('if (!state || !hasEligibleEvidence(state)) return fallbackInsight;'));
  assert.ok(novaCoreSource.includes('source_ids: string[]'));
  assert.ok(novaCoreSource.includes('observed_at: string'));
  assert.ok(novaCoreSource.includes('confidence: null'));
  assert.ok(novaCoreSource.includes('water_saved_m3: null'));
});

test('NeoAgro accepts partial finite measurements and preserves unknown fields', () => {
  assert.ok(novaCoreSource.includes('temperature_c?: number'));
  assert.ok(novaCoreSource.includes('MEASUREMENT_FIELDS.some('), 'At least one supplied measurement should be sufficient.');
  assert.ok(novaCoreSource.includes('state[field] === undefined'), 'Omitted measurements must remain omitted.');
  assert.ok(novaCoreSource.includes('payload[field] = value'), 'Only supplied Core-supported fields should be forwarded.');
});

test('client-only evidence metadata is not sent to the strict Core SiteState API', () => {
  assert.ok(novaCoreSource.includes('function toCoreSiteState(state: NovaCoreState): CoreSiteState'));
  assert.ok(novaCoreSource.includes('const coreState = toCoreSiteState(state)'));
  assert.ok(!novaCoreSource.includes('JSON.stringify(body)') || novaCoreSource.includes('body: JSON.stringify(body)'));
  assert.ok(novaCoreSource.includes('caller_supplied_unverified'));
  assert.ok(novaCoreSource.includes('extra=forbid'));
});
