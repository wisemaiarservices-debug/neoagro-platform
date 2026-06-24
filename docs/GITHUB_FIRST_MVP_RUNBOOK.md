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
npm run dev
```

Verify:

```text
http://localhost:3000
http://localhost:3000/dashboard
```

## Docker

```powershell
docker compose up --build
```

## Demo Story

A heatwave is forecast for an agrivoltaic site. NeoAgro calculates irrigation, energy, carbon, yield, and resilience impact, then recommends an operator-approved irrigation timing action.
