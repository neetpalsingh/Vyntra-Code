Write-Host "🚀 Vyntra Code - Development Mode" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan

$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    
    if (Test-Path "venv\Scripts\Activate.ps1") {
        .\venv\Scripts\Activate.ps1
        Write-Host "🐍 Backend starting on http://localhost:8000" -ForegroundColor Green
        uvicorn main:app --reload --host 0.0.0.0 --port 8000
    } else {
        Write-Host "❌ Virtual environment not found. Run setup first." -ForegroundColor Red
        exit 1
    }
}

$extensionJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Write-Host "📦 Extension watching..." -ForegroundColor Green
    npm run watch:extension
}

$webviewJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Write-Host "⚛️  Webview watching..." -ForegroundColor Green
    npm run watch:webview
}

Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host "" -ForegroundColor Cyan
Write-Host "Services running:" -ForegroundColor Cyan
Write-Host "  🐍 Backend:   http://localhost:8000" -ForegroundColor Yellow
Write-Host "  📦 Extension: Watching..." -ForegroundColor Yellow
Write-Host "  ⚛️  Webview:   Watching..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host "" -ForegroundColor Cyan

try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        Receive-Job -Job $backendJob -ErrorAction SilentlyContinue | Write-Host
        Receive-Job -Job $extensionJob -ErrorAction SilentlyContinue | Write-Host
        Receive-Job -Job $webviewJob -ErrorAction SilentlyContinue | Write-Host
    }
} finally {
    Write-Host "" -ForegroundColor Cyan
    Write-Host "Stopping services..." -ForegroundColor Yellow
    
    Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job -Job $extensionJob -ErrorAction SilentlyContinue
    Stop-Job -Job $webviewJob -ErrorAction SilentlyContinue
    
    Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $extensionJob -ErrorAction SilentlyContinue
    Remove-Job -Job $webviewJob -ErrorAction SilentlyContinue
    
    Write-Host "✅ All services stopped" -ForegroundColor Green
}
