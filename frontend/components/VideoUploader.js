"use client";
import { useState } from 'react';
import axios from 'axios';
import FeedbackDisplay from './FeedbackDisplay';

export default function VideoUploader() {
  const [feedback, setFeedback] = useState('');
  const [poseData, setPoseData] = useState(null);
  const [repCount, setRepCount] = useState(0);
  const [repsData, setRepsData] = useState([]);
  const [showReps, setShowReps] = useState(false);
  const [showPoseData, setShowPoseData] = useState(false);
  const [llmFeedback, setLlmFeedback] = useState('');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:8002/upload', formData);
    console.log('Full response:', response.data);
    console.log('Reps data:', response.data.reps_data);
    if (response.data.reps_data && response.data.reps_data.length > 0) {
      console.log('First rep:', response.data.reps_data[0]);
    }
    setFeedback(response.data.feedback);
    setPoseData(response.data.pose_data);
    setRepCount(response.data.rep_count || 0);
    setRepsData(response.data.reps_data || []);
    setShowReps(true);  // Auto-show reps after upload
    setShowPoseData(false);  // Hide pose data by default
    setLlmFeedback('');  // Clear previous LLM feedback
  };

  const handleGenerateFeedback = async () => {
    setIsGeneratingFeedback(true);
    try {
      const response = await axios.post('http://localhost:8002/generate-feedback', {
        reps_data: repsData,
        rep_count: repCount
      });
      
      if (response.data.success) {
        setLlmFeedback(response.data.feedback);
      } else {
        setLlmFeedback(`Error: ${response.data.feedback}`);
      }
    } catch (error) {
      setLlmFeedback('Error: Unable to generate feedback. Please ensure the backend is running.');
      console.error('Feedback generation error:', error);
    } finally {
      setIsGeneratingFeedback(false);
    }
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
      {repCount > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={() => setShowReps(!showReps)}
            style={{
              background: '#4caf50',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(76,175,80,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            {showReps ? 'Hide' : 'View'} Reps
          </button>
          <button 
            onClick={handleGenerateFeedback}
            disabled={isGeneratingFeedback}
            style={{
              background: isGeneratingFeedback ? '#9e9e9e' : '#2196f3',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '30px',
              border: 'none',
              cursor: isGeneratingFeedback ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(33,150,243,0.3)',
              transition: 'all 0.3s ease',
              opacity: isGeneratingFeedback ? 0.7 : 1
            }}
            onMouseEnter={(e) => !isGeneratingFeedback && (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            {isGeneratingFeedback ? 'Generating...' : 'Generate Feedback'}
          </button>
          {poseData && (
            <button 
              onClick={() => setShowPoseData(!showPoseData)}
              style={{
                background: '#8e44ad',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 6px rgba(142,68,173,0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {showPoseData ? 'Hide' : 'View'} Pose Data
            </button>
          )}
        </div>
      )}
      {llmFeedback && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(102,126,234,0.3)', 
          maxWidth: '700px', 
          width: '100%',
          color: '#fff'
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            AI Feedback
          </h3>
          <div style={{ 
            fontSize: '1rem', 
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            background: 'rgba(255,255,255,0.1)',
            padding: '15px',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)'
          }}>
            {llmFeedback}
          </div>
        </div>
      )}
      {showReps && repCount > 0 && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#e8f5e9', borderRadius: '8px', boxShadow: '0 2px 8px rgba(76,175,80,0.15)', maxWidth: '700px', width: '100%' }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '1.5rem' }}>Rep Count: {repCount}</h3>
          <div style={{ marginTop: '15px' }}>
            <h4 style={{ color: '#388e3c', marginBottom: '10px' }}>Rep Details:</h4>
            {repsData.map((rep) => (
              <div key={rep.rep_number} style={{ 
                padding: '12px', 
                marginBottom: '12px', 
                background: rep.validation_status === 'valid' ? '#fff' : rep.validation_status === 'partially_valid' ? '#fff8e1' : '#ffebee', 
                borderRadius: '5px', 
                borderLeft: rep.validation_status === 'valid' ? '4px solid #4caf50' : rep.validation_status === 'partially_valid' ? '4px solid #ff9800' : '4px solid #f44336'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong>Rep {rep.rep_number}:</strong>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    background: rep.validation_status === 'valid' ? '#4caf50' : rep.validation_status === 'partially_valid' ? '#ff9800' : '#f44336',
                    color: 'white'
                  }}>
                    {rep.validation_status === 'valid' ? '✓ VALID' : rep.validation_status === 'partially_valid' ? '⚠ PARTIALLY VALID' : '✗ INVALID'}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '4px' }}>
                  Frames {rep.start_frame} → {rep.end_frame} (Lowest: {rep.lowest_point_frame ?? 'N/A'})
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>
                  <strong>Form Analysis:</strong>
                  <div style={{ marginLeft: '12px', marginTop: '4px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontWeight: 'bold', color: rep.depth_valid ? '#4caf50' : '#f44336', marginBottom: '2px' }}>
                        {rep.depth_valid ? '✓' : '✗'} Depth Check
                      </div>
                      <div style={{ marginLeft: '16px', fontSize: '0.85rem' }}>
                        <div>Hip Height: {rep.hip_height !== null && rep.hip_height !== undefined ? rep.hip_height.toFixed(4) : 'N/A'}</div>
                        <div>Knee Height: {rep.knee_height !== null && rep.knee_height !== undefined ? rep.knee_height.toFixed(4) : 'N/A'}</div>
                        <div>Difference: {rep.depth_difference !== null && rep.depth_difference !== undefined ? rep.depth_difference.toFixed(4) : 'N/A'}</div>
                        {!rep.depth_valid && rep.depth_missed_by !== null && rep.depth_missed_by !== undefined && rep.depth_missed_by > 0 && (
                          <div style={{ 
                            color: '#d32f2f', 
                            fontWeight: 'bold', 
                            marginTop: '4px'
                          }}>
                            ⚠ Missed depth by: {rep.depth_missed_by.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: rep.knee_width_valid ? '#4caf50' : '#f44336', marginBottom: '2px' }}>
                        {rep.knee_width_valid ? '✓' : '✗'} Knee Width Check
                      </div>
                      <div style={{ marginLeft: '16px', fontSize: '0.85rem' }}>
                        <div>Knee Width: {rep.knee_width !== null && rep.knee_width !== undefined ? rep.knee_width.toFixed(4) : 'N/A'}</div>
                        <div>Shoulder Width: {rep.shoulder_width !== null && rep.shoulder_width !== undefined ? rep.shoulder_width.toFixed(4) : 'N/A'}</div>
                        <div>Difference: {rep.width_difference !== null && rep.width_difference !== undefined ? rep.width_difference.toFixed(4) : 'N/A'}</div>
                        {!rep.knee_width_valid && rep.width_missed_by !== null && rep.width_missed_by !== undefined && rep.width_missed_by > 0 && (
                          <div style={{ 
                            color: '#d32f2f', 
                            fontWeight: 'bold', 
                            marginTop: '4px'
                          }}>
                            ⚠ Knees too narrow by: {rep.width_missed_by.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '15px', padding: '12px', background: '#fff', borderRadius: '5px', fontSize: '0.9rem' }}>
            <strong>Summary:</strong> {repsData.filter(r => r.validation_status === 'valid').length} valid, {repsData.filter(r => r.validation_status === 'partially_valid').length} partially valid, {repsData.filter(r => r.validation_status === 'invalid').length} invalid (out of {repCount} total)
          </div>
        </div>
      )}
      {showPoseData && poseData && (
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
