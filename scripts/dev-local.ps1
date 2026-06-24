# NeoAgro local development launcher
# Run from the active NeoAgro app root.

$ErrorActionPreference = "Stop"

Write-Host "NeoAgro local development check" -ForegroundColor Cyan
Write-Host "Current path: $(Get-Location)"

Write-Host "Checking tools..." -ForegroundColor Cyan
node -v
npm -v
python --version

Write-Host "Installing Node dependencies..." -ForegroundColor Cyan
npm install

Write-Host "Preparing API virtual environment..." -ForegroundColor Cyan
Set-Location apps/api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt

Write-Host "Setup complete." -ForegroundColor Green
Write-Host "Start API: cd apps/api; .\.venv\Scripts\Activate.ps1; uvicorn main:app --reload --port 8000"
Write-Host "Start web from repo root: npm run dev"
