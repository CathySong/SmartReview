#!/bin/bash

echo "🚀 Starting Google Review Generator..."
echo "======================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file from example..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your API keys!"
fi

# Start development server
echo "Starting development server..."
echo "Open http://localhost:3000 in your browser"
echo ""
npm run dev