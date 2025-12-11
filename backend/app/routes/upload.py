"""
LEGACY ROUTE - Kept for backwards compatibility
This file contains the original upload and feedback endpoints.
New code should use the exercise-specific routes:
- /squat/upload and /squat/generate-feedback (see routes/squat.py)
- /benchpress/upload and /benchpress/generate-feedback (see routes/benchpress.py)
"""

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any
from app.utils.video_processing import extract_frames
from app.utils.pose_analysis import analyze_pose
from app.utils.rep_counter import count_reps
import requests

router = APIRouter()

class FeedbackRequest(BaseModel):
    reps_data: List[Dict[str, Any]]
    rep_count: int

@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    # 1. Save uploaded video locally to a Linux-friendly path
    import os
    temp_dir = os.path.join(os.path.dirname(__file__), '../../test-videos')
    os.makedirs(temp_dir, exist_ok=True)
    video_path = os.path.join(temp_dir, file.filename)
    with open(video_path, "wb") as f:
        f.write(await file.read())

    # 2. Extract frames (3 frames per second)
    frames = extract_frames(video_path, fps=3)

    # 3. Pose analysis (raw MediaPipe data)
    pose_data = analyze_pose(frames)
    
    # 4. Count reps (simple head tracking)
    rep_info = count_reps(pose_data)
    
    # Debug: Print rep info
    print(f"\n=== REP INFO DEBUG ===")
    print(f"Rep count: {rep_info['rep_count']}")
    print(f"Reps data length: {len(rep_info['reps_data'])}")
    if len(rep_info['reps_data']) > 0:
        print(f"First rep data: {rep_info['reps_data'][0]}")
    print(f"======================\n")
    
    # TODO: Add preprocessing, segmentation, and biomechanics once modules are implemented
    
    # Generate basic feedback
    feedback = f"Video analyzed. Detected {rep_info['rep_count']} reps using head tracking."

    return {
        "feedback": feedback,
        "rep_count": rep_info["rep_count"],
        "reps_data": rep_info["reps_data"],
        "pose_data": pose_data  # Raw data
    }

@router.post("/generate-feedback")
async def generate_feedback(request: FeedbackRequest):
    """
    Generate detailed feedback using Ollama LLM based on rep analysis
    """
    try:
        # Prepare the data summary for the LLM
        valid_reps = [r for r in request.reps_data if r.get('validation_status') == 'valid']
        partially_valid_reps = [r for r in request.reps_data if r.get('validation_status') == 'partially_valid']
        invalid_reps = [r for r in request.reps_data if r.get('validation_status') == 'invalid']
        
        # Build simplified rep analysis (more digestible for the LLM)
        rep_summaries = []
        depth_issues = []
        knee_width_issues = []
        
        for rep in request.reps_data:
            rep_num = rep.get('rep_number', 'N/A')
            status = rep.get('validation_status', 'unknown')
            
            # Track issues
            if not rep.get('depth_valid', False):
                missed_by = rep.get('depth_missed_by', 0)
                inches = missed_by * 39.37  # Convert to inches for readability
                depth_issues.append(f"Rep {rep_num}: {inches:.1f} inches too high")
            
            if not rep.get('knee_width_valid', False):
                missed_by = rep.get('width_missed_by', 0)
                inches = missed_by * 39.37
                knee_width_issues.append(f"Rep {rep_num}: knees {inches:.1f} inches too narrow")
            
            # Simple summary
            rep_summaries.append(f"Rep {rep_num}: {status}")
        
        # Create a concise, user-friendly prompt
        system_prompt = """You are a professional strength coach analyzing squat form. Provide friendly, actionable feedback in 3-4 sentences.
Focus on: 1) Overall form quality, 2) Main issues to fix, 3) Specific tips for improvement.
Be encouraging but honest. Use simple language, not technical jargon."""

        # Create concise user prompt
        issues_summary = []
        if depth_issues:
            issues_summary.append(f"Depth Problems: {len(depth_issues)} reps didn't reach proper depth (hips below knees)")
        if knee_width_issues:
            issues_summary.append(f"Knee Tracking: {len(knee_width_issues)} reps had knees too narrow (should be shoulder-width)")
        
        user_prompt = f"""Squat Session Summary:
- Total Reps: {request.rep_count}
- Perfect Form: {len(valid_reps)} reps
- Needs Work: {len(partially_valid_reps) + len(invalid_reps)} reps

Main Issues:
{chr(10).join('- ' + issue for issue in issues_summary) if issues_summary else '- None! All reps had good form.'}

Give encouraging feedback with specific tips to improve their squat form."""

        # Call Ollama API
        # Use host.docker.internal to access services running on the host machine from Docker
        ollama_url = "http://host.docker.internal:11434/api/generate"
        payload = {
            "model": "tinyllama:latest",  # Using tinyllama - fast and efficient
            "prompt": f"{system_prompt}\n\n{user_prompt}",
            "stream": False,
            "options": {
                "temperature": 0.8,  # Higher temp for more natural language
                "top_p": 0.95,
                "num_predict": 200,  # Limit response length (3-4 sentences)
                "stop": ["\n\n\n", "Summary:", "Rep "],  # Stop at natural breaks
            }
        }
        
        print(f"\n=== Calling Ollama API ===")
        response = requests.post(ollama_url, json=payload, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            feedback_text = result.get('response', 'Unable to generate feedback.')
            print(f"Feedback generated successfully")
            return {
                "success": True,
                "feedback": feedback_text
            }
        else:
            print(f"Ollama API error: {response.status_code}")
            return {
                "success": False,
                "feedback": "Unable to generate feedback. Please ensure Ollama is running.",
                "error": f"API returned status code {response.status_code}"
            }
            
    except requests.exceptions.ConnectionError:
        print("Connection error: Ollama not running")
        return {
            "success": False,
            "feedback": "Unable to connect to Ollama. Please ensure Ollama is installed and running (ollama serve).",
            "error": "Connection refused"
        }
    except Exception as e:
        print(f"Error generating feedback: {str(e)}")
        return {
            "success": False,
            "feedback": "An error occurred while generating feedback.",
            "error": str(e)
        }

