#!/bin/bash

# Agent Persona Forge - Startup Script
# Starts both the backend server and frontend dev server

echo "🎭 Agent Persona Forge"
echo "======================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd client && npm install && cd ..
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    pkill -f "node server/index.js" 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Start backend
echo "🚀 Starting backend server..."
node server/index.js &
BACKEND_PID=$!

# Wait for backend to be ready
echo "⏳ Waiting for backend..."
for i in {1..10}; do
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ Backend ready on http://localhost:3001"
        break
    fi
    sleep 1
done

# Start frontend
echo "🌐 Starting frontend dev server..."
cd client && npm run dev &
FRONTEND_PID=$!

echo ""
echo "=================================="
echo "✨ Agent Persona Forge is running!"
echo "=================================="
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔌 Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID