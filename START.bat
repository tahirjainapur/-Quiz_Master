@echo off
cd /d "%~dp0"
echo ========================================
echo    Quiz Master - Starting Server
echo ========================================
echo.
echo Checking for existing servers...
taskkill /F /IM node.exe /T 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Stopped existing server process.
    timeout /t 2 >nul
)
echo.
echo Starting server on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
npm start
pause
