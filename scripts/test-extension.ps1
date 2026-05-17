#!/usr/bin/env pwsh

Write-Host "🧪 Testing Vyntra Code Extension" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "Checking backend status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -Method Get -TimeoutSec 2 -UseBasicParsing
    Write-Host "✅ Backend is running on http://localhost:8000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend not detected. Please start it with: .\scripts\run-all.ps1" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Building extension..." -ForegroundColor Yellow
npm run build:extension
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Press F5 in VS Code to launch Extension Development Host" -ForegroundColor White
Write-Host "2. In the new window, press Ctrl+Shift+P" -ForegroundColor White
Write-Host "3. Type 'Vyntra: Open Chat' and press Enter" -ForegroundColor White
Write-Host '4. Check the Debug Console (Ctrl+Shift+Y) for logs' -ForegroundColor White
Write-Host ""
Write-Host "🔍 Available Commands:" -ForegroundColor Cyan
Write-Host "  - Vyntra: Open Chat" -ForegroundColor White
Write-Host "  - Vyntra: Ask About Selection" -ForegroundColor White
Write-Host "  - Vyntra: Run Agent Task" -ForegroundColor White
Write-Host ""
