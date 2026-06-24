import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const __dirname = dirname(fileURLToPath(import.meta.url));

function loadNovaCoreModule(env = {}) {
  const sourcePath = join(__dirname, '..', 'lib', 'nova-core.ts');
  const source = readFileSync(sourcePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;

  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require,
    console,
    process: { env },
    setTimeout,
    clearTimeout,
    AbortController,
  };

  vm.runInNewContext(transpiled, sandbox, { filename: sourcePath });
  return module.exports;
}

test('returns deterministic fallback when NOVA Core URL is not configured', async () => {
  const { getNovaCoreWorkflow } = loadNovaCoreModule({});
  const workflow = await getNovaCoreWorkflow();

  assert.equal(workflow.source, 'fallback');
  assert.equal(workflow.status, 'fallback');
  assert.equal(workflow.generated_at, 'demo-static');
  assert.equal(workflow.forecast.title, 'Heatwave agrivoltaic stress forecast');
  assert.equal(workflow.recommendation.priority, 'high');
  assert.match(workflow.assistant.explanation, /operator-approved/);
});

test('keeps fallback when NOVA Core request fails', async () => {
  const { getNovaCoreWorkflow } = loadNovaCoreModule({});
  const workflow = await getNovaCoreWorkflow({
    apiUrl: 'http://nova-core.local',
    fetcher: async () => {
      throw new Error('offline');
    },
  });

  assert.equal(workflow.source, 'fallback');
  assert.equal(workflow.status, 'fallback');
  assert.equal(workflow.error, 'offline');
  assert.equal(workflow.simulation.water_saved_m3, 3.2);
});

test('normalizes a valid NOVA Core response', async () => {
  const { getNovaCoreWorkflow } = loadNovaCoreModule({});
  const workflow = await getNovaCoreWorkflow({
    apiUrl: 'http://nova-core.local',
    fetcher: async () => ({
      ok: true,
      json: async () => ({
        forecast: { title: 'NOVA Core forecast', risk: 'high' },
        simulation: { scenario: 'NOVA Core simulation', resilience_gain_pct: 12 },
        recommendation: { title: 'NOVA Core recommendation', confidence: 0.91 },
        assistant: { summary: 'NOVA Core assistant explanation' },
      }),
    }),
  });

  assert.equal(workflow.source, 'nova-core');
  assert.equal(workflow.status, 'connected');
  assert.equal(workflow.forecast.title, 'NOVA Core forecast');
  assert.equal(workflow.simulation.scenario, 'NOVA Core simulation');
  assert.equal(workflow.recommendation.confidence, 0.91);
  assert.equal(workflow.assistant.summary, 'NOVA Core assistant explanation');
});
