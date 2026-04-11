Write-Host "🚀 Starting Vyntra Backend..." -ForegroundColor Cyan

if (-Not (Test-Path "venv")) {
    Write-Host "📦 Creating Python 3.11 virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
        Write-Host "Make sure Python 3.11 is installed and in PATH" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
}

Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  No .env file found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ Created .env file. Please edit it with your settings." -ForegroundColor Green
    Write-Host "" -ForegroundColor Cyan
    Write-Host "Required configuration:" -ForegroundColor Cyan
    Write-Host "  PROXY_URL=http://localhost:8338  (free-claude-code proxy)" -ForegroundColor Yellow
    Write-Host "" -ForegroundColor Cyan
    notepad .env
}

Write-Host "" -ForegroundColor Cyan
Write-Host "✨ Starting Vyntra Backend on http://localhost:8000" -ForegroundColor Green
Write-Host "" -ForegroundColor Cyan

uvicorn main:app --reload --host 0.0.0.0 --port 8000
