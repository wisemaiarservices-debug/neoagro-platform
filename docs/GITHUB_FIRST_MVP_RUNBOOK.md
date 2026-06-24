# GitHub-first NeoAgro MVP Runbook

This runbook uses the clean GitHub repository version of NeoAgro.

## Clone

```powershell
git clone https://github.com/wisemaiarservices-debug/neoagro-platform.git
cd neoagro-platform
```

## NeoAgro API

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

## Optional NOVA Core API

Run NOVA Core from the separate repo if you want the dashboard to use live NOVA AI v0 instead of fallback mode.

```powershell
git clone https://github.com/wisemaiarservices-debug/nova-core.git
cd nova-core/apps/api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements-dev.txt
uvicorn main:app --reload --port 8100
```

Verify:

```text
http://localhost:8100/health
```

## Web

```powershell
cd apps/web
npm install
$env:NEXT_PUBLIC_API_URL="http://localhost:8000"
$env:NEXT_PUBLIC_NOVA_CORE_API_URL="http://localhost:8100"
npm run dev
```

Verify:

```text
http://localhost:3000
http://localhost:3000/dashboard
```

If NOVA Core is not running, the dashboard still renders using deterministic fallback data.

## Docker

```powershell
docker compose up --build
```

## Demo Story

A heatwave is forecast for an agrivoltaic site. NeoAgro calculates irrigation, energy, carbon, yield, and resilience impact, then recommends an operator-approved irrigation timing action.

When NOVA Core is running, the dashboard also displays shared AI v0 forecast, scenario simulation, recommendation, and assistant explanation data.
