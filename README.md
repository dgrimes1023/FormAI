# FormAI

AI-powered exercise form analysis using computer vision and large language models.

## Features

### Exercise Analysis
- **Squat Analysis**: Head tracking-based rep counting with depth and knee width validation
- **Bench Press Analysis**: Wrist tracking-based rep counting with depth validation
- Automated rep counting using state machine pattern (high → low → high = 1 rep)
- Frame-by-frame pose detection using MediaPipe
- Real-time form validation with detailed metrics

### AI Feedback
- **Multiple LLM Options**: 
  - Ollama (Local) - tinyllama model for fast, private feedback
  - ApiFree (Cloud) - free cloud-based LLM API
- Contextual feedback based on rep quality and form issues
- Detailed analysis with specific improvement suggestions

### Modern UI
- Exercise selection with dedicated pages for squat and bench press
- Real-time rep analysis with visual validation status
- Gradient-themed design with exercise-specific colors
- Responsive layout with collapsible sections
- Model selection dropdown for choosing AI provider

## How to Run

### Prerequisites
- **For Ollama (Local AI)**: Install Ollama from [ollama.ai](https://ollama.ai) and run:
  ```bash
  ollama pull tinyllama
  ollama serve
  ```
- **For ApiFree (Cloud AI)**: No installation required, select ApiFree from the Model dropdown on the homepage

### Using Docker (Recommended) ⭐
Run both frontend and backend with a single command:
```bash
docker-compose up --build
```

Or use the startup script:
```bash
./start-docker.sh
```

**Services:**
- Frontend: `http://localhost:4901`
- Backend API: `http://localhost:4900`
- Ollama API (if using): `http://localhost:11434`

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
2. Start backend API (port 4900):
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

## Project Structure

```
FormAI/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── routes/
│   │   │   ├── squat.py         # Squat analysis endpoints
│   │   │   └── benchpress.py    # Bench press analysis endpoints
│   │   └── utils/
│   │       ├── video_processing.py  # Frame extraction
│   │       ├── pose_analysis.py     # MediaPipe pose detection
│   │       └── rep_counter.py       # Rep counting & validation logic
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Landing page with exercise selection
│   │   ├── squat/page.tsx       # Squat analysis page
│   │   └── benchpress/page.tsx  # Bench press analysis page
│   ├── components/
│   │   ├── VideoUploader.js     # Main upload & analysis component
│   │   └── FeedbackDisplay.js   # AI feedback display
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml

```

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework for API development
- **MediaPipe**: Google's pose detection library for landmark tracking
- **OpenCV**: Video processing and frame extraction
- **NumPy**: Numerical computations for rep counting algorithms
- **Requests**: HTTP client for LLM API calls

### Frontend
- **Next.js 15.5.6**: React framework with App Router
- **React**: Component-based UI library
- **Axios**: HTTP client for API requests
- **Inline Styling**: Dynamic styles with exercise-specific theming

### AI/ML
- **Ollama**: Local LLM runtime (tinyllama model)
- **ApiFree**: Cloud-based free LLM API
- **MediaPipe Pose**: 33-landmark body tracking

## API Endpoints

### Squat Routes (`/squat`)
- `POST /squat/upload` - Upload squat video, returns rep count and validation data
- `POST /squat/generate-feedback` - Generate AI feedback based on rep analysis

### Bench Press Routes (`/benchpress`)
- `POST /benchpress/upload` - Upload bench press video, returns rep count and validation data
- `POST /benchpress/generate-feedback` - Generate AI feedback based on rep analysis

## Requirements
- Docker and Docker Compose (for containerized setup)
- **OR** for manual setup:
  - Python 3.10+
  - Node.js 18+
  - Ollama (optional, for local AI feedback)
  - See `backend/requirements.txt` and `frontend/package.json` for details

## How It Works

1. **Video Upload**: User selects exercise type (squat/bench press) and uploads video
2. **Frame Extraction**: Backend extracts frames at 3 FPS
3. **Pose Detection**: MediaPipe analyzes each frame and extracts 33 body landmarks
4. **Rep Counting**: 
   - Squat: Tracks head position (nose landmark)
   - Bench Press: Tracks wrist position (average of left/right wrists)
   - State machine detects high → low → high transitions
5. **Form Validation**:
   - Squat: Checks hip-to-knee depth and knee width vs shoulder width
   - Bench Press: Checks wrist depth relative to chest level
6. **AI Feedback**: Selected LLM generates personalized coaching feedback
7. **Results Display**: Frontend shows rep-by-rep analysis with validation status

## Validation Criteria

### Squat
- **Depth**: Hips must reach at or below knee level
- **Knee Width**: Knees must be at least 90% of shoulder width (10% tolerance)

### Bench Press
- **Depth**: Wrists must reach at least 95% of chest level (5% above chest tolerance)
