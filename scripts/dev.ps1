Write-Host "🚀 Starting Vyntra Code development servers..." -ForegroundColor Cyan

$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    .\venv\Scripts\Activate.ps1
    uvicorn main:app --reload --port 8000
}

Write-Host "✅ Backend started on http://localhost:8000" -ForegroundColor Green
Write-Host "📝 Backend logs:" -ForegroundColor Yellow

Receive-Job -Job $backendJob -Wait

Stop-Job -Job $backendJob
Remove-Job -Job $backendJob
