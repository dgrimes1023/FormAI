import numpy as np

def count_reps(pose_data):
    """
    Count reps by tracking head position (high->low->high = 1 rep)
    Also validates squat depth by checking if hips go at or below knee level
    Returns: dict with rep_count and reps_data (list of frame indices and depth validation for each rep)
    """
    if not pose_data:
        return {"rep_count": 0, "reps_data": []}
    
    # MediaPipe pose landmark 0 is the nose (head position)
    # Landmark 23 = left hip, 24 = right hip
    # Landmark 25 = left knee, 26 = right knee
    head_y_positions = []
    valid_frame_indices = []
    
    for i, frame_data in enumerate(pose_data):
        if frame_data is not None and len(frame_data) > 0:
            # Get nose landmark (index 0) y-coordinate
            head_y = frame_data[0][1]  # [x, y, z, visibility]
            head_y_positions.append(head_y)
            valid_frame_indices.append(i)
    
    if len(head_y_positions) < 3:
        return {"rep_count": 0, "reps_data": []}
    
    # Smooth the data to reduce noise
    window_size = 3
    smoothed_positions = np.convolve(head_y_positions, np.ones(window_size)/window_size, mode='valid')
    
    # Detect peaks (high points) - y increases downward in image coordinates
    # So high point (standing) = lower y value, low point (squat) = higher y value
    reps = []
    state = "unknown"  # Can be: "high", "low", "unknown"
    current_rep_start = None
    rep_start_frame = None
    rep_low_frames = []  # Track all frames during the "low" phase
    
    threshold = 0.02  # Minimum movement threshold
    
    for i in range(1, len(smoothed_positions) - 1):
        # Adjust index for valid frames
        actual_index = valid_frame_indices[i + (window_size // 2)]
        
        # Detect state transitions
        if state == "unknown":
            # Initialize state
            if smoothed_positions[i] < np.mean(smoothed_positions):
                state = "high"
                rep_start_frame = actual_index
        
        elif state == "high":
            # Check if we're moving down (y increasing)
            if smoothed_positions[i] > smoothed_positions[i-1] + threshold:
                # Transitioning to low
                state = "low"
                rep_low_frames = [actual_index]
        
        elif state == "low":
            # Track all frames in the low position
            rep_low_frames.append(actual_index)
            
            # Check if we're moving up (y decreasing)
            if smoothed_positions[i] < smoothed_positions[i-1] - threshold:
                # Transitioning back to high - rep complete!
                state = "high"
                rep_end = actual_index
                
                if rep_start_frame is not None and len(rep_low_frames) > 0:
                    # Find the actual lowest point by checking head position in all low frames
                    lowest_point_frame = rep_low_frames[0]
                    max_head_y = -float('inf')
                    
                    for frame_idx in rep_low_frames:
                        if pose_data[frame_idx] is not None and len(pose_data[frame_idx]) > 0:
                            head_y = pose_data[frame_idx][0][1]
                            if head_y > max_head_y:
                                max_head_y = head_y
                                lowest_point_frame = frame_idx
                    
                    # Validate depth at the lowest point
                    depth_validation = validate_squat_depth(pose_data, lowest_point_frame)
                    
                    reps.append({
                        "rep_number": len(reps) + 1,
                        "start_frame": rep_start_frame,
                        "end_frame": rep_end,
                        "lowest_point_frame": lowest_point_frame,
                        "validation_status": depth_validation["validation_status"],
                        "depth_valid": depth_validation["depth_valid"],
                        "knee_width_valid": depth_validation["knee_width_valid"],
                        "hip_height": depth_validation["hip_height"],
                        "knee_height": depth_validation["knee_height"],
                        "depth_difference": depth_validation["depth_difference"],
                        "knee_width": depth_validation["knee_width"],
                        "shoulder_width": depth_validation["shoulder_width"],
                        "width_difference": depth_validation["width_difference"],
                        "depth_missed_by": depth_validation["depth_missed_by"],
                        "width_missed_by": depth_validation["width_missed_by"]
                    })
                
                rep_start_frame = rep_end
                rep_low_frames = []
    
    return {
        "rep_count": len(reps),
        "reps_data": reps
    }


def validate_squat_depth(pose_data, frame_index):
    """
    Validate squat at the lowest point:
    - Depth: hip height at or below knee height
    - Knee width: knees should be at least shoulder-width apart
    Returns: dict with validation results including 'valid', 'partially_valid', or 'invalid'
    """
    # Safety check for frame_index
    if frame_index >= len(pose_data) or frame_index < 0:
        print(f"WARNING: frame_index {frame_index} out of bounds (pose_data length: {len(pose_data)})")
        return {
            "validation_status": "invalid",
            "depth_valid": False,
            "knee_width_valid": False,
            "hip_height": None,
            "knee_height": None,
            "depth_difference": None,
            "knee_width": None,
            "shoulder_width": None,
            "width_difference": None,
            "depth_missed_by": None,
            "width_missed_by": None
        }
    
    frame_data = pose_data[frame_index]
    
    if frame_data is None:
        print(f"WARNING: frame_data is None at frame {frame_index}")
        return {
            "validation_status": "invalid",
            "depth_valid": False,
            "knee_width_valid": False,
            "hip_height": None,
            "knee_height": None,
            "depth_difference": None,
            "knee_width": None,
            "shoulder_width": None,
            "width_difference": None,
            "depth_missed_by": None,
            "width_missed_by": None
        }
    
    if len(frame_data) < 27:
        print(f"WARNING: frame_data has only {len(frame_data)} landmarks at frame {frame_index}, need at least 27")
        return {
            "validation_status": "invalid",
            "depth_valid": False,
            "knee_width_valid": False,
            "hip_height": None,
            "knee_height": None,
            "depth_difference": None,
            "knee_width": None,
            "shoulder_width": None,
            "width_difference": None,
            "depth_missed_by": None,
            "width_missed_by": None
        }
    
    # Get hip landmarks (23 = left hip, 24 = right hip)
    left_hip_y = frame_data[23][1]
    right_hip_y = frame_data[24][1]
    avg_hip_height = (left_hip_y + right_hip_y) / 2
    
    # Get knee landmarks (25 = left knee, 26 = right knee)
    left_knee_y = frame_data[25][1]
    right_knee_y = frame_data[26][1]
    left_knee_x = frame_data[25][0]
    right_knee_x = frame_data[26][0]
    avg_knee_height = (left_knee_y + right_knee_y) / 2
    
    # Get shoulder landmarks (11 = left shoulder, 12 = right shoulder)
    left_shoulder_x = frame_data[11][0]
    right_shoulder_x = frame_data[12][0]
    
    # Calculate widths (absolute distance between x-coordinates)
    knee_width = abs(left_knee_x - right_knee_x)
    shoulder_width = abs(left_shoulder_x - right_shoulder_x)
    
    # In image coordinates, y increases downward (0 at top, 1 at bottom)
    # So SMALLER y value = HIGHER up in the image (standing position)
    # And LARGER y value = LOWER down in the image (squatting position)
    # 
    # For proper squat depth: hips should be at or BELOW knees in real life
    # Which means hip_y should be >= knee_y in image coordinates
    # 
    # Example: hip_y=0.8189, knee_y=0.8815 means hips are ABOVE knees (BAD - not deep enough)
    #          hip_y=0.9000, knee_y=0.8815 means hips are BELOW knees (GOOD - proper depth)
    depth_difference = avg_hip_height - avg_knee_height
    depth_valid = depth_difference >= 0  # Positive means hips went at or below knees (good depth)
    
    # Knee width should be at least shoulder width (with 10% tolerance)
    # Allow knees to be up to 10% narrower than shoulders and still be valid
    # Increased from 5% to 10% for more lenient validation
    tolerance = 0.10  # 10% tolerance
    min_required_knee_width = shoulder_width * (1 - tolerance)
    width_difference = knee_width - shoulder_width
    knee_width_valid = knee_width >= min_required_knee_width
    
    # Calculate how much was missed if invalid
    depth_missed_by = abs(depth_difference) if not depth_valid else 0
    width_missed_by = abs(knee_width - min_required_knee_width) if not knee_width_valid else 0
    
    # Determine overall validation status
    if depth_valid and knee_width_valid:
        validation_status = "valid"
    elif depth_valid or knee_width_valid:
        validation_status = "partially_valid"
    else:
        validation_status = "invalid"
    
    return {
        "validation_status": validation_status,
        "depth_valid": depth_valid,
        "knee_width_valid": knee_width_valid,
        "hip_height": float(avg_hip_height),
        "knee_height": float(avg_knee_height),
        "depth_difference": float(depth_difference),
        "knee_width": float(knee_width),
        "shoulder_width": float(shoulder_width),
        "width_difference": float(width_difference),
        "depth_missed_by": float(depth_missed_by),
        "width_missed_by": float(width_missed_by)
    }


def count_benchpress_reps(pose_data):
    """
    Count bench press reps by tracking wrist position (high->low->high = 1 rep)
    Also validates bench press depth by checking if wrists go down to at least 10% of chest height
    Returns: dict with rep_count and reps_data (list of frame indices and depth validation for each rep)
    """
    if not pose_data:
        return {"rep_count": 0, "reps_data": []}
    
    # MediaPipe pose landmarks:
    # Landmark 15 = left wrist, 16 = right wrist
    # We'll track the average wrist height
    wrist_y_positions = []
    valid_frame_indices = []
    
    for i, frame_data in enumerate(pose_data):
        if frame_data is not None and len(frame_data) > 16:
            # Get wrist landmarks (15 = left wrist, 16 = right wrist)
            left_wrist_y = frame_data[15][1]  # [x, y, z, visibility]
            right_wrist_y = frame_data[16][1]
            avg_wrist_y = (left_wrist_y + right_wrist_y) / 2
            wrist_y_positions.append(avg_wrist_y)
            valid_frame_indices.append(i)
    
    if len(wrist_y_positions) < 3:
        return {"rep_count": 0, "reps_data": []}
    
    # Smooth the data to reduce noise
    window_size = 3
    smoothed_positions = np.convolve(wrist_y_positions, np.ones(window_size)/window_size, mode='valid')
    
    # Detect peaks (high points) - y increases downward in image coordinates
    # So high point (arms extended) = lower y value, low point (bar at chest) = higher y value
    reps = []
    state = "unknown"  # Can be: "high", "low", "unknown"
    rep_start_frame = None
    rep_low_frames = []  # Track all frames during the "low" phase
    
    threshold = 0.01  # Minimum movement threshold (reduced from 0.015 for better sensitivity)
    
    for i in range(1, len(smoothed_positions) - 1):
        # Adjust index for valid frames
        actual_index = valid_frame_indices[i + (window_size // 2)]
        
        # Detect state transitions
        if state == "unknown":
            # Initialize state
            if smoothed_positions[i] < np.mean(smoothed_positions):
                state = "high"
                rep_start_frame = actual_index
        
        elif state == "high":
            # Check if we're moving down (y increasing - bar going down to chest)
            if smoothed_positions[i] > smoothed_positions[i-1] + threshold:
                # Transitioning to low
                state = "low"
                rep_low_frames = [actual_index]
        
        elif state == "low":
            # Track all frames in the low position
            rep_low_frames.append(actual_index)
            
            # Check if we're moving up (y decreasing - pressing bar up)
            if smoothed_positions[i] < smoothed_positions[i-1] - threshold:
                # Transitioning back to high - rep complete!
                state = "high"
                rep_end = actual_index
                
                if rep_start_frame is not None and len(rep_low_frames) > 0:
                    # Find the actual lowest point by checking wrist position in all low frames
                    lowest_point_frame = rep_low_frames[0]
                    max_wrist_y = -float('inf')
                    
                    for frame_idx in rep_low_frames:
                        if pose_data[frame_idx] is not None and len(pose_data[frame_idx]) > 16:
                            left_wrist_y = pose_data[frame_idx][15][1]
                            right_wrist_y = pose_data[frame_idx][16][1]
                            avg_wrist_y = (left_wrist_y + right_wrist_y) / 2
                            if avg_wrist_y > max_wrist_y:
                                max_wrist_y = avg_wrist_y
                                lowest_point_frame = frame_idx
                    
                    # Validate depth at the lowest point
                    depth_validation = validate_benchpress_depth(pose_data, lowest_point_frame)
                    
                    reps.append({
                        "rep_number": len(reps) + 1,
                        "start_frame": rep_start_frame,
                        "end_frame": rep_end,
                        "lowest_point_frame": lowest_point_frame,
                        "validation_status": depth_validation["validation_status"],
                        "depth_valid": depth_validation["depth_valid"],
                        "wrist_height": depth_validation["wrist_height"],
                        "chest_height": depth_validation["chest_height"],
                        "depth_percentage": depth_validation["depth_percentage"],
                        "depth_missed_by": depth_validation["depth_missed_by"]
                    })
                
                rep_start_frame = rep_end
                rep_low_frames = []
    
    return {
        "rep_count": len(reps),
        "reps_data": reps
    }


def validate_benchpress_depth(pose_data, frame_index):
    """
    Validate bench press at the lowest point:
    - Depth: wrists should be at least 10% the height of the chest (wrist_y >= chest_y * 1.1 in image coords)
    Returns: dict with validation results including 'valid' or 'invalid'
    """
    # Safety check for frame_index
    if frame_index >= len(pose_data) or frame_index < 0:
        print(f"WARNING: frame_index {frame_index} out of bounds (pose_data length: {len(pose_data)})")
        return {
            "validation_status": "invalid",
            "depth_valid": False,
            "wrist_height": None,
            "chest_height": None,
            "depth_percentage": None,
            "depth_missed_by": None
        }
    
    frame_data = pose_data[frame_index]
    
    if frame_data is None:
        print(f"WARNING: frame_data is None at frame {frame_index}")
        return {
            "validation_status": "invalid",
            "depth_valid": False,
            "wrist_height": None,
            "chest_height": None,
            "depth_percentage": None,
            "depth_missed_by": None
        }
    
    if len(frame_data) < 17:
        print(f"WARNING: frame_data has only {len(frame_data)} landmarks at frame {frame_index}, need at least 17")
        return {
            "validation_status": "invalid",
            "depth_valid": False,
            "wrist_height": None,
            "chest_height": None,
            "depth_percentage": None,
            "depth_missed_by": None
        }
    
    # Get wrist landmarks (15 = left wrist, 16 = right wrist)
    left_wrist_y = frame_data[15][1]
    right_wrist_y = frame_data[16][1]
    avg_wrist_height = (left_wrist_y + right_wrist_y) / 2
    
    # Get shoulder landmarks as proxy for chest (11 = left shoulder, 12 = right shoulder)
    left_shoulder_y = frame_data[11][1]
    right_shoulder_y = frame_data[12][1]
    avg_chest_height = (left_shoulder_y + right_shoulder_y) / 2
    
    # In image coordinates, y increases downward (0 at top, 1 at bottom)
    # For proper bench press depth: wrists can be up to 5% above chest (more lenient)
    # This means wrist_y can be as low as chest_y * 0.95 (5% above in image coords = smaller y value)
    
    required_wrist_height = avg_chest_height * 0.95
    depth_valid = avg_wrist_height >= required_wrist_height
    
    # Calculate depth percentage (how far down the wrists went relative to chest)
    if avg_chest_height > 0:
        depth_percentage = ((avg_wrist_height - avg_chest_height) / avg_chest_height) * 100
    else:
        depth_percentage = 0
    
    # Calculate how much was missed if invalid
    depth_missed_by = abs(required_wrist_height - avg_wrist_height) if not depth_valid else 0
    
    # Determine overall validation status
    validation_status = "valid" if depth_valid else "invalid"
    
    return {
        "validation_status": validation_status,
        "depth_valid": depth_valid,
        "wrist_height": float(avg_wrist_height),
        "chest_height": float(avg_chest_height),
        "depth_percentage": float(depth_percentage),
        "depth_missed_by": float(depth_missed_by)
    }
