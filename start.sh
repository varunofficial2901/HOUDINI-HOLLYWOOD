#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  Houdini Hollywood — Local Server Startup Script
#  Run from project root: bash start.sh
# ═══════════════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Houdini Hollywood — Starting Up    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# ── Check MongoDB ──────────────────────────────────────────
echo -e "${YELLOW}[1/4] Checking MongoDB...${NC}"
if ! command -v mongod &> /dev/null; then
  echo "⚠️  MongoDB not found. Please install MongoDB Community Edition."
  echo "    https://www.mongodb.com/try/download/community"
  exit 1
fi
if ! pgrep -x mongod > /dev/null; then
  echo "    Starting MongoDB..."
  mongod --fork --logpath /tmp/mongod.log --dbpath ~/data/db 2>/dev/null || \
    echo "    ⚠️  Could not auto-start MongoDB. Please start it manually."
fi
echo -e "    ${GREEN}✓ MongoDB ready${NC}"

# ── Backend ────────────────────────────────────────────────
echo -e "${YELLOW}[2/4] Setting up Backend (FastAPI)...${NC}"
cd backend

if [ ! -d "venv" ]; then
  echo "    Creating virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt -q

echo "    Running database seed..."
python seed.py

echo "    Starting FastAPI server on port 8000..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo -e "    ${GREEN}✓ Backend running (PID: $BACKEND_PID)${NC}"
cd ..

# ── Admin Panel ────────────────────────────────────────────
echo -e "${YELLOW}[3/4] Setting up Admin Panel...${NC}"
cd admin-panel

if [ ! -d "node_modules" ]; then
  echo "    Installing npm packages..."
  npm install -q
fi

echo "    Starting Admin Panel on port 5174..."
npm run dev &
ADMIN_PID=$!
echo -e "    ${GREEN}✓ Admin Panel running (PID: $ADMIN_PID)${NC}"
cd ..

# ── Frontend ───────────────────────────────────────────────
echo -e "${YELLOW}[4/4] Setting up Frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
  echo "    Installing npm packages..."
  npm install -q
fi

echo "    Starting Frontend on port 5173..."
npm run dev &
FRONTEND_PID=$!
echo -e "    ${GREEN}✓ Frontend running (PID: $FRONTEND_PID)${NC}"
cd ..

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          All Services Running! 🚀            ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Frontend    →  http://localhost:5173        ║${NC}"
echo -e "${GREEN}║  Admin Panel →  http://localhost:5174        ║${NC}"
echo -e "${GREEN}║  Backend API →  http://localhost:8000        ║${NC}"
echo -e "${GREEN}║  API Docs    →  http://localhost:8000/docs   ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Admin Login:  admin@houdinivfx.com          ║${NC}"
echo -e "${GREEN}║  Admin Pass:   Admin@123456                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo "Press Ctrl+C to stop all services."

# Wait and cleanup
trap "echo ''; echo 'Stopping all services...'; kill $BACKEND_PID $ADMIN_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM
wait
