@echo off
echo Starting Q-Builder Development Environment...
echo.

echo Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Failed to install server dependencies
    pause
    exit /b 1
)

echo.
echo Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Failed to install client dependencies
    pause
    exit /b 1
)

echo.
echo Starting development servers...
echo.
echo Backend will run on: http://localhost:3001
echo Frontend will run on: http://localhost:5173
echo.

start "Q-Builder Backend" cmd /k "cd /d %~dp0server && npm run dev"
start "Q-Builder Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Development servers are starting...
echo Check the opened terminal windows for status.
echo.
pause