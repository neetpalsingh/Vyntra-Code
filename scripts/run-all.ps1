Write-Host "🚀 Starting Vyntra Code - Full Stack" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

Write-Host "Step 1: Setting up Backend (Python 3.11)" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

Set-Location backend

if (-Not (Test-Path "venv")) {
    Write-Host "Creating Python 3.11 virtual environment..." -ForegroundColor Cyan
    
    $python311 = Get-Command python3.11 -ErrorAction SilentlyContinue
    if ($python311) {
        python3.11 -m venv venv
    } else {
        $python = Get-Command python -ErrorAction SilentlyContinue
        if ($python) {
            $version = & python --version 2>&1
            Write-Host "Found: $version" -ForegroundColor Cyan
            python -m venv venv
        } else {
            Write-Host "❌ Python not found. Please install Python 3.11" -ForegroundColor Red
            exit 1
        }
    }
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✅ Virtual environment already exists" -ForegroundColor Green
}

Write-Host "Activating virtual environment..." -ForegroundColor Cyan
.\venv\Scripts\Activate.ps1

Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
pip install --upgrade pip
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Python dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

if (-Not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Cyan
    Copy-Item .env.example .env
    Write-Host "✅ Created .env file" -ForegroundColor Green
}

Set-Location ..

Write-Host "" -ForegroundColor Cyan
Write-Host "Step 2: Setting up Frontend (Node.js)" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Node dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Node dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Node modules already installed" -ForegroundColor Green
}

Write-Host "" -ForegroundColor Cyan
Write-Host "Step 3: Building Application" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

Write-Host "Building shared types..." -ForegroundColor Cyan
npm run build:shared

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build shared types" -ForegroundColor Red
    exit 1
}

Write-Host "Building webview..." -ForegroundColor Cyan
npm run build --workspace=webview

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build webview" -ForegroundColor Red
    exit 1
}

Write-Host "Building extension..." -ForegroundColor Cyan
npm run build --workspace=extension

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build extension" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Application built successfully" -ForegroundColor Green

Write-Host "" -ForegroundColor Cyan
Write-Host "Step 4: Starting Services" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "" -ForegroundColor Cyan

Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host "  Proxy:    http://localhost:8338" -ForegroundColor Yellow
Write-Host "" -ForegroundColor Cyan

Write-Host "Starting backend server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host "" -ForegroundColor Cyan

Set-Location backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --host 0.0.0.0 --port 8000
