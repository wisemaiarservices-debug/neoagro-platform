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

test('dashboard preserves NeoAgro command center modules', () => {
  const requiredMarkers = [
    'Solar Production',
    'Crop Health',
    'Water Usage',
    'Forecasting',
    'AI Recommendations',
    'Sustainability',
    'Digital Twin',
    'Crop blocks and field zones',
    'Solar production / today',
    'Soil moisture',
    'Energy production forecast',
    'Water demand vs supply',
    'Carbon footprint / 12 month',
    'Spatial view of panels, sensors, irrigation, weather, and field zones',
  ];

  for (const marker of requiredMarkers) {
    assert.ok(dashboardSource.includes(marker), `Missing dashboard marker: ${marker}`);
  }
});

test('dashboard keeps main NOVA Core integration', () => {
  const requiredMarkers = [
    'getNovaCoreInsight',
    'nova.connected',
    'NOVA Core AI v0',
    'NOVA Core recommendation',
    'operator-approved intelligence',
    'standby',
  ];

  const novaSource = `${dashboardSource}\n${dashboardRouteSource}`;
  for (const marker of requiredMarkers) {
    assert.ok(novaSource.includes(marker), `Missing NOVA marker: ${marker}`);
  }

  assert.ok(novaCoreSource.includes('/api/v1/forecast/run'), 'Main NOVA Core forecast endpoint was not preserved.');
  assert.ok(novaCoreSource.includes('/api/v1/recommendations/run'), 'Main NOVA Core recommendation endpoint was not preserved.');
  assert.ok(novaCoreSource.includes('/api/v1/scenarios/simulate'), 'Main NOVA Core simulation endpoint was not preserved.');
  assert.ok(novaCoreSource.includes('/api/v1/assistant/explain'), 'Main NOVA Core assistant endpoint was not preserved.');
});

test('command center theme uses audited dark enterprise shell', () => {
  const requiredClasses = [
    '.ag-shell',
    '.ag-sidebar',
    '.ag-topbar',
    '.ag-grid',
    '.ag-twin-map',
    '.ag-table',
    '.ag-panel',
  ];

  for (const className of requiredClasses) {
    assert.ok(stylesSource.includes(className), `Missing CSS class: ${className}`);
  }
});
