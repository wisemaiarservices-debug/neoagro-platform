import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const shell = readFileSync(new URL('../components/neoagro-shell.tsx', import.meta.url), 'utf8');
const pages = readFileSync(new URL('../components/neoagro-pages.tsx', import.meta.url), 'utf8');

test('NeoAgro shell persistently identifies synthetic demo data', () => {
  assert.match(shell, /DEMO SCENARIO/);
  assert.match(shell, /not live site telemetry/);
  assert.match(shell, /Sample site and sensor fixtures only/);
  assert.doesNotMatch(shell, /248 sensors online/);
});

test('NeoAgro product views do not present fixture data as live telemetry', () => {
  assert.match(pages, /not a validated site forecast/);
  assert.match(pages, /not independently measured or verified impact/);
  assert.match(pages, /Demo \/ sample sensors/);
  assert.doesNotMatch(pages, /Live \/ 248 sensors/);
  assert.doesNotMatch(pages, /Last full sync 4s ago/);
  assert.doesNotMatch(pages, /Live kW output vs forecast/);
});
