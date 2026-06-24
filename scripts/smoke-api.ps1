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
  if ($health.status -ne "ok") {
    throw "Expected health status ok, got '$($health.status)'"
  }
  if ($health.service -ne "neoagro-api") {
    throw "Expected service neoagro-api, got '$($health.service)'"
  }

  Write-Host "Health endpoint response:" -ForegroundColor Green
  $health | ConvertTo-Json -Depth 5

  $summary = Invoke-RestMethod -Uri "$BaseUrl/api/v1/dashboard/summary" -Method GET -TimeoutSec 10
  if ($summary.scenario -ne "Heatwave agrivoltaic optimization") {
    throw "Unexpected dashboard scenario: '$($summary.scenario)'"
  }
  if ($summary.site.status -ne "demo_ready") {
    throw "Unexpected site status: '$($summary.site.status)'"
  }
  if ($summary.kpis.Count -lt 6) {
    throw "Expected at least 6 KPIs, got $($summary.kpis.Count)"
  }
  if ($summary.recommendations.Count -lt 2) {
    throw "Expected at least 2 recommendations, got $($summary.recommendations.Count)"
  }

  Write-Host "Dashboard summary response:" -ForegroundColor Green
  $summary | ConvertTo-Json -Depth 8
  Write-Host "API smoke test passed." -ForegroundColor Green
  exit 0
} catch {
  Write-Host "API smoke test failed." -ForegroundColor Red
  Write-Host $_.Exception.Message
  exit 1
}
