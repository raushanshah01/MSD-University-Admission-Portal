# ==========================================
# Stop All Dev Servers
# ==========================================
# This script stops all Node.js processes running on ports 3000 and 5000

Write-Host "Stopping University Admission Portal servers..." -ForegroundColor Yellow
Write-Host ""

# Function to kill process on specific port
function Stop-ProcessOnPort {
    param([int]$Port)
    
    try {
        $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                   Select-Object -ExpandProperty OwningProcess -First 1
        
        if ($process) {
            Stop-Process -Id $process -Force
            Write-Host "✓ Stopped process on port $Port" -ForegroundColor Green
            return $true
        } else {
            Write-Host "ℹ No process found on port $Port" -ForegroundColor Gray
            return $false
        }
    } catch {
        Write-Host "✗ Error stopping process on port $Port" -ForegroundColor Red
        return $false
    }
}

# Stop backend (port 5000)
Stop-ProcessOnPort -Port 5000

# Stop frontend (port 3000)
Stop-ProcessOnPort -Port 3000

Write-Host ""
Write-Host "Server shutdown complete!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
