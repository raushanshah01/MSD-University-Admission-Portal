# 🚀 Development Scripts

This folder contains PowerShell scripts to easily manage your development environment.

## 📜 Available Scripts

### 1. `start-dev.ps1` (Recommended)
**Full-featured development server launcher**

**Features:**
- ✅ Checks Node.js installation
- ✅ Verifies port availability
- ✅ Auto-installs dependencies if missing
- ✅ Starts both servers in separate windows
- ✅ Monitors server processes
- ✅ Provides detailed status information

**Usage:**
```powershell
# Right-click and select "Run with PowerShell"
# OR
.\start-dev.ps1
```

**What it does:**
1. Validates environment (Node.js, directories)
2. Checks if ports 3000 and 5000 are available
3. Installs npm dependencies if needed
4. Opens 2 terminal windows:
   - Window 1: Backend Server (Express on port 5000)
   - Window 2: Frontend Server (Vite on port 3000)
5. Displays server URLs
6. Monitors processes

---

### 2. `start-quick.ps1`
**Quick start without checks**

**Features:**
- ⚡ Fast startup
- ⚡ No dependency checks
- ⚡ Opens 2 terminal windows immediately

**Usage:**
```powershell
.\start-quick.ps1
```

**Best for:**
- When dependencies are already installed
- Quick restarts during development
- When you know everything is set up

---

### 3. `stop-dev.ps1`
**Stop all development servers**

**Features:**
- 🛑 Stops processes on port 3000 (frontend)
- 🛑 Stops processes on port 5000 (backend)
- ✅ Clean shutdown

**Usage:**
```powershell
.\stop-dev.ps1
```

**When to use:**
- Servers won't stop with Ctrl+C
- Need to free up ports
- Clean shutdown before system restart

---

## 🎯 Recommended Workflow

### First Time Setup:
```powershell
# 1. Use full script (installs dependencies)
.\start-dev.ps1
```

### Daily Development:
```powershell
# Quick start
.\start-quick.ps1

# ... do your work ...

# Stop servers when done
.\stop-dev.ps1
```

---

## 🔧 Troubleshooting

### "Cannot be loaded because running scripts is disabled"

**Solution:** Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Ports Already in Use

**Option 1:** Run stop script
```powershell
.\stop-dev.ps1
```

**Option 2:** Manually kill processes
```powershell
# Find process on port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess

# Kill process (replace <PID> with actual process ID)
Stop-Process -Id <PID> -Force
```

### Servers Won't Start

1. **Check Node.js installation:**
   ```powershell
   node --version
   npm --version
   ```

2. **Reinstall dependencies:**
   ```powershell
   # Backend
   cd server
   Remove-Item -Recurse -Force node_modules
   npm install

   # Frontend
   cd ../client
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

3. **Check .env file:**
   - Ensure `server/.env` exists
   - Verify MongoDB connection string
   - Check all required variables are set

---

## 📊 Server Information

| Server | Port | URL |
|--------|------|-----|
| Backend (Express) | 5000 | http://localhost:5000 |
| Frontend (Vite) | 3000 | http://localhost:3000 |
| API Endpoints | 5000 | http://localhost:5000/api |

---

## 💡 Tips

1. **Always use `start-dev.ps1` for first run** - It checks everything
2. **Use `start-quick.ps1` for quick restarts** - Saves time
3. **Close terminal windows to stop servers** - Clean exit
4. **Use `stop-dev.ps1` if windows won't close** - Force stop
5. **Check MongoDB is running** before starting servers

---

## 🔗 Related Commands

### Manual Start (Alternative):

**Backend:**
```powershell
cd server
npm run dev
```

**Frontend:**
```powershell
cd client
npm run dev
```

### Production Build:
```powershell
# Build client
cd client
npm run build

# Start production server
cd ../server
npm start
```

---

## 📝 Notes

- Scripts create separate terminal windows for better log visibility
- Backend must start before frontend for proper initialization
- Servers auto-reload on file changes (hot reload enabled)
- MongoDB must be running for backend to work
- Check `server/.env` for configuration

---

**Happy Coding! 🎉**
