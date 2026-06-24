# NeoAgro Local Development Runbook

## Active Local App

```text
Neohaven/06_DEVELOPMENT/neoagro-platform/neoagro-platform/neoagro-platform
```

Do not move this app before the July SolarHub submission.

## Verify Tooling

```powershell
node -v
npm -v
python --version
```

## Install Node Dependencies

From the active app root:

```powershell
npm install
```

## Start API

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
```

## Start Web

In another terminal from the active app root:

```powershell
npm run dev
```

Verify:

```text
http://localhost:3000
http://localhost:3000/dashboard
```

## Demo Mode

If Clerk blocks local development, enable local demo mode only:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

Do not remove Clerk from production mode.
