#!/bin/bash
set -e

echo "=========================================="
echo " Starting LearnTrack AI Platform"
echo "=========================================="

# Color helpers
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Start Backend
echo -e "${BLUE}[1/2] Launching FastAPI Backend on http://localhost:8000 ...${NC}"
cd backend
if [ ! -d "venv" ]; then
    echo "Creating Python virtualenv..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Seed DB if not present and start server
python3 -m app.seed
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# 2. Start Frontend
echo -e "${BLUE}[2/2] Launching React/Vite Frontend on http://localhost:5173 ...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN} LearnTrack AI is live!${NC}"
echo -e " Frontend: http://localhost:5173"
echo -e " Backend:  http://localhost:8000"
echo -e " API Docs: http://localhost:8000/docs"
echo -e "${GREEN}==========================================${NC}"
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM EXIT
wait
