@echo off
REM Simple start script that runs both backend and frontend together

echo =========================================
echo   Starting Real Estate CRM
echo =========================================
echo.
echo Starting Backend on http://localhost:5000
echo Starting Frontend on http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Check if concurrently is installed
call npm list -g concurrently >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing concurrently...
    call npm install -g concurrently
)

REM Run both backend and frontend
call concurrently --kill-others --names "BACKEND,FRONTEND" --prefix-colors "blue,green" "cd backend && npm run dev" "npm run dev"