@echo off
setlocal enabledelayedexpansion

:: Automatically switch to CrewFlow-main if we are running in the parent directory
if exist CrewFlow-main (
    echo [INFO] Detected CrewFlow-main directory. Switching directory...
    cd CrewFlow-main
    echo.
)

title CrewFlow Launcher
echo ===================================================
echo             CREWFLOW DASHBOARD LAUNCHER
echo ===================================================
echo.
echo [1/3] Starting Backend API Server (Port 5000)...
start "CrewFlow Backend Server" cmd /c "npm run dev --workspace=backend"

echo [2/3] Starting Frontend Dev Server (Port 3000)...
start "CrewFlow Frontend Server" cmd /c "npm run dev --workspace=frontend"

echo [3/3] Launching Web Browser at http://localhost:3000...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo ===================================================
echo  SUCCESS: CrewFlow has been launched successfully!
echo  Keep this window open to monitor the launcher, or
echo  close it as the servers are running in separate
echo  windows.
echo ===================================================
echo.
pause
