Write-Host "🔍 Validating Vyntra Code setup..." -ForegroundColor Cyan

$errors = @()

Write-Host "`nChecking prerequisites..." -ForegroundColor Yellow

if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    $errors += "Node.js is required"
}

if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonVersion = python --version
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Python not found" -ForegroundColor Red
    $errors += "Python is required"
}

if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitVersion = git --version
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Git not found" -ForegroundColor Red
    $errors += "Git is required"
}

Write-Host "`nChecking project structure..." -ForegroundColor Yellow

$requiredDirs = @("extension", "backend", "shared", "scripts")
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "✅ Directory: $dir" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing directory: $dir" -ForegroundColor Red
        $errors += "Directory $dir not found"
    }
}

Write-Host "`nChecking dependencies..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "✅ Node modules installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Node modules not installed. Run: npm install" -ForegroundColor Yellow
}

if (Test-Path "backend/venv") {
    Write-Host "✅ Python venv exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Python venv not found. Run setup script" -ForegroundColor Yellow
}

Write-Host "`nChecking configuration..." -ForegroundColor Yellow

if (Test-Path "backend/.env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    $envContent = Get-Content "backend/.env" -Raw
    $hasApiKey = $false
    
    $providers = @("OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GOOGLE_API_KEY", "GROQ_API_KEY")
    foreach ($provider in $providers) {
        if ($envContent -match "$provider=sk-" -or $envContent -match "$provider=gsk-") {
            Write-Host "  ✅ $provider configured" -ForegroundColor Green
            $hasApiKey = $true
        }
    }
    
    if (-not $hasApiKey) {
        Write-Host "  ⚠️  No API keys configured" -ForegroundColor Yellow
        Write-Host "  Edit backend/.env and add at least one provider key" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env file missing. Copy .env.example to .env" -ForegroundColor Red
    $errors += ".env file required"
}

Write-Host "`n" + ("=" * 50) -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    Write-Host "✨ Setup validated successfully!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Start backend: cd backend && uvicorn main:app --reload"
    Write-Host "2. Press F5 in VS Code to launch extension"
} else {
    Write-Host "❌ Setup validation failed with $($errors.Count) error(s):" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
    Write-Host "`nRun: .\scripts\setup.ps1" -ForegroundColor Yellow
}
