"use client";
import { useState } from 'react';
import axios from 'axios';
import FeedbackDisplay from './FeedbackDisplay';

export default function VideoUploader() {
  const [feedback, setFeedback] = useState('');
  const [poseData, setPoseData] = useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:8000/upload', formData);
    setFeedback(response.data.feedback);
    setPoseData(response.data.pose_data);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
      <label htmlFor="video-upload" style={{
        display: 'inline-block',
        background: '#8e44ad',
        color: '#fff',
        padding: '12px 28px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(142,68,173,0.15)'
      }}>
        Choose File
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
      </label>
      {feedback && <FeedbackDisplay feedback={feedback} />}
      {poseData && (
        <div style={{ marginTop: '20px', maxWidth: '700px', wordBreak: 'break-word', background: '#f6f2fa', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 8px rgba(142,68,173,0.08)' }}>
          <h4 style={{ color: '#8e44ad', marginBottom: '10px' }}>Pose Data (first frame):</h4>
          <table style={{ width: '100%', fontSize: '0.95rem', color: '#333', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#e1d7f5' }}>
                <th style={{ textAlign: 'left', padding: '4px 8px' }}>Landmark</th>
                <th style={{ textAlign: 'left', padding: '4px 8px' }}>x</th>
                <th style={{ textAlign: 'left', padding: '4px 8px' }}>y</th>
                <th style={{ textAlign: 'left', padding: '4px 8px' }}>z</th>
                <th style={{ textAlign: 'left', padding: '4px 8px' }}>Visibility</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const landmarkNames = [
                  "nose", "left_eye_inner", "left_eye", "left_eye_outer", "right_eye_inner", "right_eye", "right_eye_outer", "left_ear", "right_ear", "mouth_left", "mouth_right", "left_shoulder", "right_shoulder", "left_elbow", "right_elbow", "left_wrist", "right_wrist", "left_pinky", "right_pinky", "left_index", "right_index", "left_thumb", "right_thumb", "left_hip", "right_hip", "left_knee", "right_knee", "left_ankle", "right_ankle", "left_heel", "right_heel", "left_foot_index", "right_foot_index"
                ];
                const frame = poseData[0] || [];
                return frame.map((lm, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e1d7f5' }}>
                    <td style={{ padding: '4px 8px', fontWeight: 'bold', color: '#6c3483' }}>{landmarkNames[idx] || `Landmark ${idx}`}</td>
                    <td style={{ padding: '4px 8px' }}>{lm[0].toFixed(4)}</td>
                    <td style={{ padding: '4px 8px' }}>{lm[1].toFixed(4)}</td>
                    <td style={{ padding: '4px 8px' }}>{lm[2].toFixed(4)}</td>
                    <td style={{ padding: '4px 8px' }}>{lm[3].toFixed(2)}</td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
          <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
            {`Total frames with pose data: ${poseData.length}`}
          </div>
        </div>
      )}
    </div>
  );
}
