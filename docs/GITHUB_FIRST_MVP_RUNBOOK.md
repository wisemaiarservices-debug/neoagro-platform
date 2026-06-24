# GitHub-first NeoAgro MVP Runbook

This runbook uses the clean GitHub repository version of NeoAgro.

## Clone

```powershell
git clone https://github.com/wisemaiarservices-debug/neoagro-platform.git
cd neoagro-platform
```

## API

```powershell
cd apps/api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Verify:

```text
http://localhost:8000/health
http://localhost:8000/api/v1/dashboard/summary
```

## Web

```powershell
cd apps/web
npm install
npm test
npm run dev
```

Verify:

```text
http://localhost:3000
http://localhost:3000/dashboard
```

## NOVA Core AI v0

NeoAgro can call a future NOVA Core AI v0 service for the dashboard workflow. Configure one of these environment variables for the web app:

```env
NOVA_CORE_API_URL=http://localhost:8100
NEXT_PUBLIC_NOVA_CORE_API_URL=http://localhost:8100
```

Expected NOVA Core endpoint contract:

```text
POST /api/v0/ai/workflow
```

NeoAgro sends the product, site id, dashboard summary, and NOVA workflow. The expected response can either be the workflow object directly or `{ "workflow": { ... } }` with these sections:

- `forecast`
- `simulation`
- `recommendation`
- `assistant`

If NOVA Core is offline, not configured, or returns an incomplete response, NeoAgro keeps rendering with deterministic fallback data for SolarHub reliability.

## Docker

```powershell
docker compose up --build
```

## Demo Story

A heatwave is forecast for an agrivoltaic site. NeoAgro calculates irrigation, energy, carbon, yield, and resilience impact, then recommends an operator-approved irrigation timing action.
