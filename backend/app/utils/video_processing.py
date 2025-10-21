
import cv2
import os

def extract_frames(video_path, fps=5):
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Cannot open video file: {video_path}")

    video_fps = cap.get(cv2.CAP_PROP_FPS)
    if video_fps == 0:
        video_fps = fps  # fallback if FPS cannot be read

    frames = []
    count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if int(video_fps) > 0 and count % max(1, int(video_fps // fps)) == 0:
            frames.append(frame)
        count += 1
    cap.release()
    return frames
