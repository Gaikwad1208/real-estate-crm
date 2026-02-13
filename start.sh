#!/bin/bash

# Simple start script that runs both backend and frontend together

echo "========================================="
echo "  Starting Real Estate CRM"
echo "========================================="
echo ""
echo "Starting Backend on http://localhost:5000"
echo "Starting Frontend on http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Check if concurrently is installed globally
if ! command -v concurrently &> /dev/null
then
    echo "Installing concurrently..."
    npm install -g concurrently
fi

# Run both backend and frontend
concurrently --kill-others \
  --names "BACKEND,FRONTEND" \
  --prefix-colors "blue,green" \
  "cd backend && npm run dev" \
  "npm run dev"