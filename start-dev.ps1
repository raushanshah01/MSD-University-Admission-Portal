# ==========================================
# University Admission Portal - Dev Startup
# ==========================================
# This script starts both backend and frontend servers concurrently

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  University Admission Portal - Dev Mode  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: Node.js is not installed!" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Check if ports are already in use
$backendPort = 5000
$frontendPort = 3000

if (Test-Port -Port $backendPort) {
    Write-Host "⚠ Warning: Port $backendPort is already in use!" -ForegroundColor Yellow
    Write-Host "  Backend server might already be running or port is blocked." -ForegroundColor Yellow
    Write-Host ""
}

if (Test-Port -Port $frontendPort) {
    Write-Host "⚠ Warning: Port $frontendPort is already in use!" -ForegroundColor Yellow
    Write-Host "  Frontend server might already be running or port is blocked." -ForegroundColor Yellow
    Write-Host ""
}

# Get the script directory
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverDir = Join-Path $rootDir "server"
$clientDir = Join-Path $rootDir "client"

# Verify directories exist
if (-not (Test-Path $serverDir)) {
    Write-Host "✗ Error: Server directory not found at $serverDir" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path $clientDir)) {
    Write-Host "✗ Error: Client directory not found at $clientDir" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if node_modules exist
$serverModules = Join-Path $serverDir "node_modules"
$clientModules = Join-Path $clientDir "node_modules"

if (-not (Test-Path $serverModules)) {
    Write-Host "⚠ Server dependencies not installed. Installing..." -ForegroundColor Yellow
    Push-Location $serverDir
    npm install
    Pop-Location
    Write-Host "✓ Server dependencies installed" -ForegroundColor Green
    Write-Host ""
}

if (-not (Test-Path $clientModules)) {
    Write-Host "⚠ Client dependencies not installed. Installing..." -ForegroundColor Yellow
    Push-Location $clientDir
    npm install
    Pop-Location
    Write-Host "✓ Client dependencies installed" -ForegroundColor Green
    Write-Host ""
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Starting Backend Server (Port $backendPort)..." -ForegroundColor Green
Write-Host "Starting Frontend Server (Port $frontendPort)..." -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start backend server in new window
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$serverDir'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; npm run dev" -PassThru

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend server in new window
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$clientDir'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm run dev" -PassThru

# Wait a bit for servers to initialize
Start-Sleep -Seconds 5

Write-Host "============================================" -ForegroundColor Green
Write-Host "✓ Servers Started Successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend Server:  http://localhost:$backendPort" -ForegroundColor Cyan
Write-Host "Frontend Server: http://localhost:$frontendPort" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Endpoints:   http://localhost:$backendPort/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "ℹ Two terminal windows have been opened:" -ForegroundColor Yellow
Write-Host "  1. Backend Server (Express)" -ForegroundColor White
Write-Host "  2. Frontend Server (Vite)" -ForegroundColor White
Write-Host ""
Write-Host "To stop servers:" -ForegroundColor Yellow
Write-Host "  - Close both terminal windows, OR" -ForegroundColor White
Write-Host "  - Press Ctrl+C in each window" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Monitoring servers... Press Ctrl+C to exit monitoring" -ForegroundColor Gray
Write-Host ""

# Monitor the processes
try {
    while ($true) {
        # Check if processes are still running
        if ($backendJob.HasExited) {
            Write-Host "⚠ Backend server has stopped!" -ForegroundColor Red
            break
        }
        if ($frontendJob.HasExited) {
            Write-Host "⚠ Frontend server has stopped!" -ForegroundColor Red
            break
        }
        Start-Sleep -Seconds 2
    }
} catch {
    Write-Host ""
    Write-Host "Monitoring stopped." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Script execution completed." -ForegroundColor Gray
Write-Host "Note: Server windows will remain open until manually closed." -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"
