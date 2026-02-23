#!/bin/bash

echo "🤖 Setting up Autonomous AI Agent Marketplace..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  Please edit .env and add your 4 wallet private keys!"
    echo ""
    exit 1
fi

# Check if wallets are configured
if grep -q "0x\.\.\." .env; then
    echo "⚠️  Wallet keys not configured in .env"
    echo "Please replace the placeholder keys with real Base wallet private keys"
    echo ""
    exit 1
fi

echo "✅ Environment configured"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install
echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..
echo "✅ Frontend dependencies installed"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To start the marketplace:"
echo "  Terminal 1: npm run dev:all"
echo "  Terminal 2: npm run dev:frontend"
echo ""
echo "Then visit http://localhost:5173"
