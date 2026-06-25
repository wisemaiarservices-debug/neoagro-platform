import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dashboardSource = readFileSync(join(__dirname, '..', 'app', 'dashboard', 'page.tsx'), 'utf8');
const stylesSource = readFileSync(join(__dirname, '..', 'app', 'globals.css'), 'utf8');
const novaCoreSource = readFileSync(join(__dirname, '..', 'lib', 'nova-core.ts'), 'utf8');

test('dashboard preserves audited NeoAgro command center modules', () => {
  const requiredMarkers = [
    'Solar Production',
    'Agriculture',
    'Water Systems',
    'Forecasting',
    'AI Recommendations',
    'Sustainability',
    'Digital Twin',
    'Asset Registry',
    "TODAY'S SOLAR OUTPUT",
    'ZONE STATUS MATRIX',
    'IRRIGATION SCHEDULE',
    'METEOROLOGICAL FORECAST',
    'UNIVERSAL ASSET REGISTRY',
    'KNOWLEDGE GRAPH',
    'NEOGRID ENERGY ASSETS',
    'NEOCELL INFRASTRUCTURE MODULES',
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
    'Shared AI v0 risk model',
    'main branch integration',
    'fallback',
  ];

  for (const marker of requiredMarkers) {
    assert.ok(dashboardSource.includes(marker), `Missing NOVA marker: ${marker}`);
  }

  assert.ok(novaCoreSource.includes('/api/v1/forecast/run'), 'Main NOVA Core forecast endpoint was not preserved.');
  assert.ok(novaCoreSource.includes('/api/v1/recommendations/run'), 'Main NOVA Core recommendation endpoint was not preserved.');
  assert.ok(novaCoreSource.includes('/api/v1/scenarios/simulate'), 'Main NOVA Core simulation endpoint was not preserved.');
  assert.ok(novaCoreSource.includes('/api/v1/assistant/explain'), 'Main NOVA Core assistant endpoint was not preserved.');
});

test('command center theme uses audited dark enterprise shell', () => {
  const requiredClasses = [
    '.cc-shell',
    '.cc-sidebar',
    '.cc-topbar',
    '.module-grid',
    '.zone-grid',
    '.asset-table',
    '.graph-chain',
  ];

  for (const className of requiredClasses) {
    assert.ok(stylesSource.includes(className), `Missing CSS class: ${className}`);
  }
});
