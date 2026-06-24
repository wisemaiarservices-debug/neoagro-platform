# NeoAgro API smoke test
# Requires API running on http://localhost:8000

$ErrorActionPreference = "Stop"
$BaseUrl = $env:NEOAGRO_API_URL
if ([string]::IsNullOrWhiteSpace($BaseUrl)) {
  $BaseUrl = "http://localhost:8000"
}

Write-Host "Testing API at $BaseUrl" -ForegroundColor Cyan

try {
  $health = Invoke-RestMethod -Uri "$BaseUrl/health" -Method GET -TimeoutSec 10
  Write-Host "Health endpoint response:" -ForegroundColor Green
  $health | ConvertTo-Json -Depth 5
  Write-Host "API smoke test passed." -ForegroundColor Green
  exit 0
} catch {
  Write-Host "API smoke test failed." -ForegroundColor Red
  Write-Host $_.Exception.Message
  exit 1
}
