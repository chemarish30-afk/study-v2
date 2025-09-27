# Learning Management System - Development Startup Script (PowerShell)

Write-Host "🚀 Starting LMS Development Environment" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "📋 Please copy env.example to .env and configure your settings:" -ForegroundColor Yellow
    Write-Host "   Copy-Item env.example .env" -ForegroundColor Cyan
    Write-Host "   # Edit .env with your configuration" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Environment configuration loaded" -ForegroundColor Green

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "strapi/node_modules")) {
    Write-Host "📦 Installing Strapi dependencies..." -ForegroundColor Yellow
    Set-Location strapi
    npm install
    Set-Location ..
}

Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Start Strapi in background
Write-Host "🔧 Starting Strapi backend..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "run", "strapi" -WindowStyle Hidden

# Wait for Strapi to be ready
Write-Host "⏳ Waiting for Strapi to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start Next.js
Write-Host "🌐 Starting Next.js frontend..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden

Write-Host ""
Write-Host "🎉 Development servers started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "📊 Strapi Admin: http://localhost:1337/admin" -ForegroundColor Cyan
Write-Host "🌐 Next.js App:  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Access Strapi admin and create an API token" -ForegroundColor White
Write-Host "2. Set STRAPI_API_TOKEN in your .env file" -ForegroundColor White
Write-Host "3. Run: node scripts/load-sample-data.js" -ForegroundColor White
Write-Host "4. Access the frontend and test the hierarchy" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Red

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "🛑 Stopping servers..." -ForegroundColor Red
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
}
