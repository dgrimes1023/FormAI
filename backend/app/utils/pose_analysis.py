
import mediapipe as mp
import numpy as np

mp_pose = mp.solutions.pose

# Returns: list of [ [x, y, z, visibility], ... ] for each landmark in each frame
# If no pose detected, returns None for that frame
def analyze_pose(frames):
    results = []
    with mp_pose.Pose(static_image_mode=True) as pose:
        for frame in frames:
            frame_rgb = frame[..., ::-1]  # Convert BGR to RGB
            res = pose.process(frame_rgb)
            if res.pose_landmarks:
                landmarks = []
                for lm in res.pose_landmarks.landmark:
                    landmarks.append([lm.x, lm.y, lm.z, lm.visibility])
                results.append(landmarks)
            else:
                results.append(None)
    return results

# Compute angle at joint b given three points a, b, c
# Each point: [x, y, z]
def compute_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    ba = a - b
    bc = c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.arccos(np.clip(cosine_angle, -1.0, 1.0))
    return np.degrees(angle)
