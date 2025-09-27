#!/bin/bash

# Learning Management System - Development Startup Script

echo "🚀 Starting LMS Development Environment"
echo "========================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📋 Please copy env.example to .env and configure your settings:"
    echo "   cp env.example .env"
    echo "   # Edit .env with your configuration"
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
if [ -z "$STRAPI_URL" ] || [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ Missing required environment variables!"
    echo "📋 Please check your .env file"
    exit 1
fi

echo "✅ Environment configuration loaded"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

if [ ! -d "strapi/node_modules" ]; then
    echo "📦 Installing Strapi dependencies..."
    cd strapi && npm install && cd ..
fi

echo "✅ Dependencies installed"

# Start Strapi in background
echo "🔧 Starting Strapi backend..."
cd strapi
npm run develop &
STRAPI_PID=$!
cd ..

# Wait for Strapi to be ready
echo "⏳ Waiting for Strapi to start..."
sleep 10

# Start Next.js
echo "🌐 Starting Next.js frontend..."
npm run dev &
NEXTJS_PID=$!

echo ""
echo "🎉 Development servers started!"
echo "========================================"
echo "📊 Strapi Admin: http://localhost:1337/admin"
echo "🌐 Next.js App:  http://localhost:3000"
echo ""
echo "📋 Next steps:"
echo "1. Access Strapi admin and create an API token"
echo "2. Set STRAPI_API_TOKEN in your .env file"
echo "3. Run: node scripts/load-sample-data.js"
echo "4. Access the frontend and test the hierarchy"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap "echo '🛑 Stopping servers...'; kill $STRAPI_PID $NEXTJS_PID; exit" INT
wait
