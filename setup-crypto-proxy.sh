#!/bin/bash

echo "🚀 Setting up Crypto API Proxy Server for REAL prices..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install express cors node-fetch

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup complete! To start getting REAL crypto prices:"
echo ""
echo "1. Run the proxy server:"
echo "   node crypto-proxy-server.js"
echo ""
echo "2. Open your miOS Crypto Tracker app"
echo ""
echo "3. Look for this message in console:"
echo "   ✅ REAL price data from local proxy server"
echo ""
echo "🔗 Server will run at: http://localhost:3001"
echo "📊 Your crypto app will now show REAL prices!"
echo ""