@echo off
echo ========================================
echo    Stopping Quiz Master Server
echo ========================================
echo.
echo Stopping all Node.js processes...
taskkill /F /IM node.exe /T 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Server stopped successfully!
    echo.
) else (
    echo.
    echo ℹ️  No server was running.
    echo.
)
timeout /t 2 >nul
echo You can now run START.bat to start the server again.
pause

