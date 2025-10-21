from fastapi import APIRouter, UploadFile, File
from app.utils.video_processing import extract_frames
from app.utils.pose_analysis import analyze_pose
from app.llm_feedback import generate_feedback

router = APIRouter()

@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    # 1. Save uploaded video locally to a Linux-friendly path
    import os
    temp_dir = os.path.join(os.path.dirname(__file__), '../../test-videos')
    os.makedirs(temp_dir, exist_ok=True)
    video_path = os.path.join(temp_dir, file.filename)
    with open(video_path, "wb") as f:
        f.write(await file.read())

    # 2. Extract frames
    frames = extract_frames(video_path)

    # 3. Pose analysis
    pose_data = analyze_pose(frames)

    # 4. LLM feedback (dummy for MVP)
    feedback = generate_feedback(pose_data)

    return {"feedback": feedback}
