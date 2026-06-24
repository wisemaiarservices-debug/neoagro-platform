# Outbox for ChatGPT

## Summary

Issue #7 connects the NeoAgro dashboard to a NOVA Core AI v0 workflow contract while preserving deterministic fallback data. The GitHub `nova-core` repo currently defines the platform role in README form but does not expose a running API, so NeoAgro now calls a future `/api/v0/ai/workflow` endpoint only when `NOVA_CORE_API_URL` or `NEXT_PUBLIC_NOVA_CORE_API_URL` is configured.

If NOVA Core is offline, absent, or returns incomplete data, the dashboard still renders forecast, simulation, recommendation, and assistant explanation sections from deterministic fallback data.

Issue #7 was started after Issue #9 API verification passed. Issue #7 does not move local archive assets.

## Startup File Analysis

A local startup asset routing analysis was completed before this implementation:

- `docs/CHATGPT_SYNC/STARTUP_ASSET_ROUTING_ANALYSIS.md`

Key decision from that analysis: keep the desktop archive as source material, use GitHub repos as product homes, and migrate selected docs/assets through reviewed commits. For Issue #7 specifically, use a NeoAgro-side NOVA Core client contract with fallback because `nova-core` does not yet provide a live API implementation.

## Files Changed

- `.github/workflows/ci.yml`
- `apps/web/app/dashboard/page.tsx`
- `apps/web/lib/demo.ts`
- `apps/web/lib/nova-core.ts`
- `apps/web/package.json`
- `apps/web/tests/nova-core-fallback.test.mjs`
- `docs/GITHUB_FIRST_MVP_RUNBOOK.md`
- `docs/CHATGPT_SYNC/OUTBOX_FOR_CHATGPT.md`

## Commands Run / Actions Taken

- Read Issue #7.
- Read `AGENTS.md`.
- Read `docs/CHATGPT_SYNC/INBOX_FOR_CODEX.md`.
- Reviewed GitHub repos:
  - `wisemaiarservices-debug/neoagro-platform`
  - `wisemaiarservices-debug/nova-core`
  - `wisemaiarservices-debug/neogrid-platform`
  - `wisemaiarservices-debug/neocell-platform`
  - `wisemaiarservices-debug/NeoHaven-repo-root`
  - `wisemaiarservices-debug/documentation`
- Scanned local startup archive roots:
  - `NeoAgro`
  - `Neohaven`
  - `NeoHaven_Full_Investor_Kit`
  - `NeoHaven_Investor_Assets`
  - `NeoHaven_Professional_Pack_v2`
  - `NeoHaven_System_B_Final`
  - `NovaCore`
  - `docs`
- Created branch `codex/issue-7-nova-core-ai-v0`.
- Added NOVA Core AI v0 client contract and fallback data.
- Added dashboard sections for forecast, simulation, recommendation, and assistant explanation.
- Added Node test for fallback behavior.
- Updated CI to run `npm test` before typecheck/build.
- Updated the GitHub-first MVP runbook.

## Tests Run

Planned CI checks on PR:

- `npm install`
- `npm test`
- `npm run typecheck`
- `npm run build`
- Existing API import smoke job

## What Passed

Pending PR CI at the time this outbox entry was written.

## What Failed

No known code failure yet. Local Windows Python/npm tooling remains unreliable, so GitHub Actions is the main verification path.

## Remaining Blockers

- `nova-core` does not yet expose a real API service. NeoAgro uses a future endpoint contract plus deterministic fallback.
- Docker verification remains dependent on a Docker-enabled machine.
- `next@14.2.23` still has an upstream security advisory and should be upgraded separately.

## Suggested Next Task

Implement the matching NOVA Core AI v0 service in `wisemaiarservices-debug/nova-core` with `POST /api/v0/ai/workflow`, then run NeoAgro against it with `NOVA_CORE_API_URL` configured.

## Suggested Commit Message

`feat(web): connect dashboard to NOVA Core AI v0 fallback workflow`
