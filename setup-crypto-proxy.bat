@echo off
echo 🚀 Setting up Crypto API Proxy Server for REAL prices...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
call npm install express cors node-fetch

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🎉 Setup complete! To start getting REAL crypto prices:
echo.
echo 1. Run the proxy server:
echo    node crypto-proxy-server.js
echo.
echo 2. Open your miOS Crypto Tracker app
echo.
echo 3. Look for this message in console:
echo    ✅ REAL price data from local proxy server
echo.
echo 🔗 Server will run at: http://localhost:3001
echo 📊 Your crypto app will now show REAL prices!
echo.
pause