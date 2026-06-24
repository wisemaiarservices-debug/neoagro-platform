# Claude Task 002 — Real Local NeoAgro Boot + Smoke Tests

## Goal

Run stabilization against the real local NeoAgro app path, make the app boot locally, and add smoke tests.

## Active Real App Path

```text
Neohaven/06_DEVELOPMENT/neoagro-platform/neoagro-platform/neoagro-platform
```

## Hard Rules

- Do not move the active app.
- Do not delete archives.
- Do not rewrite the app.
- Do not start NeoGrid, NeoCell, NOVA Core, or new features yet.
- Do not replace schemas.
- Make the smallest safe changes needed to make the app run.

## Required Success Criteria

At least one success path:

### Success A — Local Dev Works

- API boots on port 8000.
- Web boots on port 3000.
- `/health` works.
- `/dashboard` renders.

### Success B — Docker Works

- `docker compose up --build` completes.
- API container healthy.
- Web container reachable.

### Success C — Honest Blocked State

If install or boot fails, document the exact command, error, file, and line causing the blocker.

## Required Output

Update:

```text
docs/CHATGPT_SYNC/OUTBOX_FOR_CHATGPT.md
```

Include commands run, files changed, tests, blockers, and suggested next task.
