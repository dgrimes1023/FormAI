# FormAI

A simple MVP for AI-powered form feedback using video uploads.

## Features
- Upload a video from the frontend
- Backend processes video frames using OpenCV
- Pose analysis and feedback generation

## How to Run

### Using Docker (Recommended) 
Run both frontend and backend with a single command:
```bash
docker-compose up --build
```

Or use the startup script:
```bash
./start-docker.sh
```

**Services:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8001`

To stop:
```bash
docker-compose down
```

See [DOCKER.md](DOCKER.md) for more Docker commands and troubleshooting.

### Manual Setup
1. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Start backend API (port 8001):
   ```bash
   python3 -m app.main
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Start frontend:
   ```bash
   npm run dev
   ```

## Folder Structure
- `backend/` — FastAPI backend
- `frontend/` — Next.js frontend

## Requirements
- Docker and Docker Compose (for containerized setup)
- **OR** for manual setup:
  - Python 3.10+
  - Node.js 18+
  - See `backend/requirements.txt` and `frontend/package.json` for details
