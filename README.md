# FormAI

A simple MVP for AI-powered form feedback using video uploads.

## Features
- Upload a video from the frontend
- Backend processes video frames using OpenCV
- Pose analysis and feedback generation

## How to Run
1. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Start backend API:
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
- Python 3.10+
- Node.js 18+
- See `backend/requirements.txt` and `frontend/package.json` for details
