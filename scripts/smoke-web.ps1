# NeoAgro web smoke test
# Requires web app running on http://localhost:3000

$ErrorActionPreference = "Stop"
$BaseUrl = $env:NEOAGRO_WEB_URL
if ([string]::IsNullOrWhiteSpace($BaseUrl)) {
  $BaseUrl = "http://localhost:3000"
}

Write-Host "Testing web app at $BaseUrl" -ForegroundColor Cyan

$paths = @("/", "/dashboard")
foreach ($path in $paths) {
  $url = "$BaseUrl$path"
  try {
    $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
      Write-Host "OK $url -> $($response.StatusCode)" -ForegroundColor Green
    } else {
      Write-Host "Unexpected status $url -> $($response.StatusCode)" -ForegroundColor Yellow
      exit 1
    }
  } catch {
    Write-Host "Web smoke test failed for $url" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
  }
}

Write-Host "Web smoke test passed." -ForegroundColor Green
