"use client";
import { useState } from 'react';
import axios from 'axios';
import FeedbackDisplay from './FeedbackDisplay';

export default function VideoUploader({ exerciseType = 'squat' }) {
  const [feedback, setFeedback] = useState('');
  const [poseData, setPoseData] = useState(null);
  const [repCount, setRepCount] = useState(0);
  const [repsData, setRepsData] = useState([]);
  const [showReps, setShowReps] = useState(false);
  const [showPoseData, setShowPoseData] = useState(false);
  const [llmFeedback, setLlmFeedback] = useState('');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const uploadEndpoint = `http://localhost:4900/${exerciseType}/upload`;
    const response = await axios.post(uploadEndpoint, formData);
    console.log('Full response:', response.data);
    console.log('Reps data:', response.data.reps_data);
    if (response.data.reps_data && response.data.reps_data.length > 0) {
      console.log('First rep:', response.data.reps_data[0]);
    }
    setFeedback(response.data.feedback);
    setPoseData(response.data.pose_data);
    setRepCount(response.data.rep_count || 0);
    setRepsData(response.data.reps_data || []);
    setShowReps(false);  // Don't auto-show reps after upload
    setShowPoseData(false);  // Hide pose data by default
    setLlmFeedback('');  // Clear previous LLM feedback
    setHasUploaded(true);  // Mark as uploaded
  };

  const handleGenerateFeedback = async () => {
    setIsGeneratingFeedback(true);
    try {
      // Get selected model from localStorage
      const selectedModel = localStorage.getItem('selectedModel') || 'ollama';
      
      const feedbackEndpoint = `http://localhost:4900/${exerciseType}/generate-feedback`;
      const response = await axios.post(feedbackEndpoint, {
        reps_data: repsData,
        rep_count: repCount,
        model: selectedModel
      });
      
      if (response.data.success) {
        setLlmFeedback(response.data.feedback);
      } else {
        setLlmFeedback(`Error: ${response.data.feedback}`);
      }
    } catch (error) {
      setLlmFeedback('Error: Unable to generate feedback. Please ensure the backend is running on port 4900.');
      console.error('Feedback generation error:', error);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const resetUploader = () => {
    setFeedback('');
    setPoseData(null);
    setRepCount(0);
    setRepsData([]);
    setShowReps(false);
    setShowPoseData(false);
    setLlmFeedback('');
    setIsGeneratingFeedback(false);
    setHasUploaded(false);
  };

  const buttonColor = exerciseType === 'squat' ? '#667eea' : '#f5576c';
  const buttonHoverColor = exerciseType === 'squat' ? '#5568d3' : '#e14658';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
      {!hasUploaded && (
      <label htmlFor="video-upload" style={{
        display: 'inline-block',
        background: buttonColor,
        color: '#fff',
        padding: '14px 32px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: '600',
        boxShadow: `0 4px 12px ${exerciseType === 'squat' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(245, 87, 108, 0.3)'}`,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = buttonHoverColor;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 6px 16px ${exerciseType === 'squat' ? 'rgba(102, 126, 234, 0.4)' : 'rgba(245, 87, 108, 0.4)'}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = buttonColor;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 12px ${exerciseType === 'squat' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(245, 87, 108, 0.3)'}`;
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
      )}
      {repCount > 0 && (
        <div style={{ marginTop: '30px', width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={resetUploader}
            style={{
              background: '#fff',
              color: '#5a6c7d',
              padding: '10px 22px',
              borderRadius: '10px',
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f8f9fa';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            }}
          >
            Upload New Video
          </button>
          {poseData && (
          <button 
            onClick={() => setShowPoseData(!showPoseData)}
            style={{
              background: '#fff',
              color: '#5a6c7d',
              padding: '10px 22px',
              borderRadius: '10px',
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f8f9fa';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            }}
          >
            {showPoseData ? 'Hide' : 'View'} Raw Data
          </button>
          )}
        </div>
      )}
      {feedback && (
        <div style={{
          marginTop: '30px',
          padding: '32px',
          background: `linear-gradient(135deg, ${exerciseType === 'squat' ? '#667eea22' : '#f093fb22'} 0%, ${exerciseType === 'squat' ? '#764ba222' : '#f5576c22'} 100%)`,
          borderRadius: '16px',
          maxWidth: '800px',
          width: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: `2px solid ${buttonColor}30`
        }}>
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#2c3e50', textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.4rem',
              fontWeight: '700',
              color: buttonColor,
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>
              Analysis Complete
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '500', color: '#5a6c7d' }}>
              {exerciseType === 'squat' ? 'Squat' : 'Bench Press'} video analyzed successfully. <strong style={{ color: buttonColor }}>{repCount} {repCount === 1 ? 'rep' : 'reps'}</strong> detected using {exerciseType === 'squat' ? 'head' : 'wrist'} tracking.
            </div>
          </div>
        </div>
      )}
      {repCount > 0 && (
        <div style={{ marginTop: '20px', width: '100%', maxWidth: '800px' }}>
          {/* Main action buttons with gradient */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={() => setShowReps(!showReps)}
            style={{
              background: `linear-gradient(135deg, ${exerciseType === 'squat' ? '#667eea 0%, #764ba2 100%' : '#f093fb 0%, #f5576c 100%'})`,
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: `0 4px 12px ${exerciseType === 'squat' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(245, 87, 108, 0.3)'}`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = `0 6px 16px ${exerciseType === 'squat' ? 'rgba(102, 126, 234, 0.4)' : 'rgba(245, 87, 108, 0.4)'}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 4px 12px ${exerciseType === 'squat' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(245, 87, 108, 0.3)'}`;
            }}
          >
            {showReps ? 'Hide' : 'View'} Rep Details
          </button>
          <button 
            onClick={handleGenerateFeedback}
            disabled={isGeneratingFeedback}
            style={{
              background: isGeneratingFeedback ? '#cbd5e0' : `linear-gradient(135deg, ${exerciseType === 'squat' ? '#667eea 0%, #764ba2 100%' : '#f093fb 0%, #f5576c 100%'})`,
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '12px',
              border: 'none',
              cursor: isGeneratingFeedback ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: isGeneratingFeedback ? '0 2px 8px rgba(0,0,0,0.06)' : `0 4px 12px ${exerciseType === 'squat' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(245, 87, 108, 0.3)'}`,
              transition: 'all 0.3s ease',
              opacity: isGeneratingFeedback ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isGeneratingFeedback) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 6px 16px ${exerciseType === 'squat' ? 'rgba(102, 126, 234, 0.4)' : 'rgba(245, 87, 108, 0.4)'}`;
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = isGeneratingFeedback ? '0 2px 8px rgba(0,0,0,0.06)' : `0 4px 12px ${exerciseType === 'squat' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(245, 87, 108, 0.3)'}`;
            }}
          >
            {isGeneratingFeedback ? 'Generating...' : 'Generate AI Feedback'}
          </button>
          </div>
        </div>
      )}
      {llmFeedback && (
        <div style={{ 
          marginTop: '30px', 
          padding: '30px', 
          background: `linear-gradient(135deg, ${exerciseType === 'squat' ? '#667eea 0%, #764ba2 100%' : '#f093fb 0%, #f5576c 100%'})`, 
          borderRadius: '16px', 
          boxShadow: `0 4px 20px ${exerciseType === 'squat' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(245, 87, 108, 0.3)'}`, 
          maxWidth: '800px', 
          width: '100%',
          color: '#fff'
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
            AI-Generated Feedback
          </h3>
          <div style={{ 
            fontSize: '1.05rem', 
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
            background: 'rgba(255,255,255,0.15)',
            padding: '20px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {llmFeedback}
          </div>
        </div>
      )}
      {showReps && repCount > 0 && (
        <div style={{ marginTop: '30px', padding: '30px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '800px', width: '100%', border: '1px solid #e8e9eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '20px', borderBottom: '2px solid #f0f1f3' }}>
            <h3 style={{ color: '#2c3e50', fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>Rep Analysis</h3>
            <div style={{ 
              padding: '8px 20px', 
              background: `linear-gradient(135deg, ${exerciseType === 'squat' ? '#667eea 0%, #764ba2 100%' : '#f093fb 0%, #f5576c 100%'})`,
              borderRadius: '20px',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              {repCount} {repCount === 1 ? 'Rep' : 'Reps'}
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            {repsData.map((rep) => (
              <div key={rep.rep_number} style={{ 
                padding: '20px', 
                marginBottom: '16px', 
                background: rep.validation_status === 'valid' ? '#f8fffe' : rep.validation_status === 'partially_valid' ? '#fffbf0' : '#fff5f5', 
                borderRadius: '12px', 
                borderLeft: `5px solid ${rep.validation_status === 'valid' ? '#10b981' : rep.validation_status === 'partially_valid' ? '#f59e0b' : '#ef4444'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '1.1rem', color: '#2c3e50' }}>Rep {rep.rep_number}</strong>
                  <span style={{ 
                    padding: '6px 16px', 
                    borderRadius: '8px', 
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    background: rep.validation_status === 'valid' ? '#10b981' : rep.validation_status === 'partially_valid' ? '#f59e0b' : '#ef4444',
                    color: 'white'
                  }}>
                    {rep.validation_status === 'valid' ? '✓ Valid' : rep.validation_status === 'partially_valid' ? '⚠ Partial' : '✗ Invalid'}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#5a6c7d', marginBottom: '12px', fontFamily: 'monospace', background: '#f8f9fa', padding: '8px 12px', borderRadius: '6px' }}>
                  Frames {rep.start_frame} → {rep.end_frame} (Bottom: {rep.lowest_point_frame ?? 'N/A'})
                </div>
                <div style={{ fontSize: '0.9rem', marginTop: '12px' }}>
                  <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '10px', fontSize: '0.95rem' }}>Form Analysis</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                    {exerciseType === 'squat' ? (
                      <>
                        <div style={{ 
                          background: '#ffffff', 
                          padding: '10px 12px', 
                          borderRadius: '8px', 
                          border: `2px solid ${rep.depth_valid ? '#10b981' : '#ef4444'}`
                        }}>
                          <div style={{ fontWeight: '600', color: rep.depth_valid ? '#10b981' : '#ef4444', marginBottom: '6px', fontSize: '0.9rem' }}>
                            {rep.depth_valid ? '✓' : '✗'} Depth
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 8px', fontSize: '0.8rem', color: '#5a6c7d' }}>
                            <span style={{ fontWeight: '500' }}>Hip:</span>
                            <span style={{ fontFamily: 'monospace', color: '#2c3e50' }}>{rep.hip_height !== null && rep.hip_height !== undefined ? rep.hip_height.toFixed(3) : 'N/A'}</span>
                            <span style={{ fontWeight: '500' }}>Knee:</span>
                            <span style={{ fontFamily: 'monospace', color: '#2c3e50' }}>{rep.knee_height !== null && rep.knee_height !== undefined ? rep.knee_height.toFixed(3) : 'N/A'}</span>
                            <span style={{ fontWeight: '500' }}>Diff:</span>
                            <span style={{ fontFamily: 'monospace', color: '#2c3e50' }}>{rep.depth_difference !== null && rep.depth_difference !== undefined ? rep.depth_difference.toFixed(3) : 'N/A'}</span>
                          </div>
                          {!rep.depth_valid && rep.depth_missed_by !== null && rep.depth_missed_by !== undefined && rep.depth_missed_by > 0 && (
                            <div style={{ 
                              marginTop: '6px',
                              padding: '4px 8px',
                              background: '#fef2f2',
                              borderRadius: '4px',
                              color: '#ef4444', 
                              fontWeight: '600', 
                              fontSize: '0.75rem'
                            }}>
                              ⚠ Missed by: {rep.depth_missed_by.toFixed(3)}
                            </div>
                          )}
                        </div>
                        <div style={{ 
                          background: '#ffffff', 
                          padding: '10px 12px', 
                          borderRadius: '8px', 
                          border: `2px solid ${rep.knee_width_valid ? '#10b981' : '#ef4444'}`
                        }}>
                          <div style={{ fontWeight: '600', color: rep.knee_width_valid ? '#10b981' : '#ef4444', marginBottom: '6px', fontSize: '0.9rem' }}>
                            {rep.knee_width_valid ? '✓' : '✗'} Knee Width
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 8px', fontSize: '0.8rem', color: '#5a6c7d' }}>
                            <span style={{ fontWeight: '500' }}>Knee:</span>
                            <span style={{ fontFamily: 'monospace', color: '#2c3e50' }}>{rep.knee_width !== null && rep.knee_width !== undefined ? rep.knee_width.toFixed(3) : 'N/A'}</span>
                            <span style={{ fontWeight: '500' }}>Shoulder:</span>
                            <span style={{ fontFamily: 'monospace', color: '#2c3e50' }}>{rep.shoulder_width !== null && rep.shoulder_width !== undefined ? rep.shoulder_width.toFixed(3) : 'N/A'}</span>
                            <span style={{ fontWeight: '500' }}>Diff:</span>
                            <span style={{ fontFamily: 'monospace', color: '#2c3e50' }}>{rep.width_difference !== null && rep.width_difference !== undefined ? rep.width_difference.toFixed(3) : 'N/A'}</span>
                          </div>
                          {!rep.knee_width_valid && rep.width_missed_by !== null && rep.width_missed_by !== undefined && rep.width_missed_by > 0 && (
                            <div style={{ 
                              marginTop: '6px',
                              padding: '4px 8px',
                              background: '#fef2f2',
                              borderRadius: '4px',
                              color: '#ef4444', 
                              fontWeight: '600', 
                              fontSize: '0.75rem'
                            }}>
                              ⚠ Too narrow by: {rep.width_missed_by.toFixed(3)}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div style={{ 
                        background: '#ffffff', 
                        padding: '10px 12px', 
                        borderRadius: '8px', 
                        border: `2px solid ${rep.depth_valid ? '#10b981' : '#ef4444'}`,
                        gridColumn: '1 / -1'
                      }}>
                        <div style={{ fontWeight: '600', color: rep.depth_valid ? '#10b981' : '#ef4444', marginBottom: '6px', fontSize: '0.9rem' }}>
                          {rep.depth_valid ? '✓' : '✗'} Depth
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr', gap: '4px 8px', fontSize: '0.8rem', color: '#5a6c7d' }}>
                          <span style={{ fontWeight: '500' }}>Wrist:</span>
                          <span style={{ fontFamily: 'monospace', color: '#2c3e50' }}>{rep.wrist_height !== null && rep.wrist_height !== undefined ? rep.wrist_height.toFixed(3) : 'N/A'}</span>
                          <span style={{ fontWeight: '500' }}>Chest:</span>
                          <span style={{ fontFamily: 'monospace', color: '#2c3e50' }}>{rep.chest_height !== null && rep.chest_height !== undefined ? rep.chest_height.toFixed(3) : 'N/A'}</span>
                          <span style={{ fontWeight: '500' }}>Depth %:</span>
                          <span style={{ fontFamily: 'monospace', color: '#2c3e50' }}>{rep.depth_percentage !== null && rep.depth_percentage !== undefined ? rep.depth_percentage.toFixed(1) + '%' : 'N/A'}</span>
                        </div>
                        {!rep.depth_valid && rep.depth_missed_by !== null && rep.depth_missed_by !== undefined && rep.depth_missed_by > 0 && (
                          <div style={{ 
                            marginTop: '6px',
                            padding: '4px 8px',
                            background: '#fef2f2',
                            borderRadius: '4px',
                            color: '#ef4444', 
                            fontWeight: '600', 
                            fontSize: '0.75rem'
                          }}>
                            ⚠ Missed by: {rep.depth_missed_by.toFixed(3)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            background: '#ffffff', 
            borderRadius: '12px', 
            fontSize: '0.95rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '12px', fontSize: '1.1rem' }}>Summary</div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                <span><strong>{repsData.filter(r => r.validation_status === 'valid').length}</strong> Valid</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                <span><strong>{repsData.filter(r => r.validation_status === 'partially_valid').length}</strong> Partial</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                <span><strong>{repsData.filter(r => r.validation_status === 'invalid').length}</strong> Invalid</span>
              </div>
              <div style={{ marginLeft: 'auto', color: '#5a6c7d', fontWeight: '500' }}>
                Total: <strong style={{ color: '#2c3e50' }}>{repCount}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPoseData && poseData && (
        <div style={{ 
          marginTop: '20px', 
          maxWidth: '800px', 
          background: '#ffffff', 
          borderRadius: '12px', 
          padding: '24px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '16px', fontSize: '1.3rem', fontWeight: '700' }}>Pose Data (First Frame)</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.9rem', color: '#2c3e50', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: `linear-gradient(135deg, ${exerciseType === 'squat' ? '#667eea22' : '#f093fb22'} 0%, ${exerciseType === 'squat' ? '#764ba222' : '#f5576c22'} 100%)` }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', borderBottom: `2px solid ${buttonColor}` }}>Landmark</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', borderBottom: `2px solid ${buttonColor}` }}>x</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', borderBottom: `2px solid ${buttonColor}` }}>y</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', borderBottom: `2px solid ${buttonColor}` }}>z</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', borderBottom: `2px solid ${buttonColor}` }}>Visibility</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const landmarkNames = [
                    "nose", "left_eye_inner", "left_eye", "left_eye_outer", "right_eye_inner", "right_eye", "right_eye_outer", "left_ear", "right_ear", "mouth_left", "mouth_right", "left_shoulder", "right_shoulder", "left_elbow", "right_elbow", "left_wrist", "right_wrist", "left_pinky", "right_pinky", "left_index", "right_index", "left_thumb", "right_thumb", "left_hip", "right_hip", "left_knee", "right_knee", "left_ankle", "right_ankle", "left_heel", "right_heel", "left_foot_index", "right_foot_index"
                  ];
                  const frame = poseData[0] || [];
                  return frame.map((lm, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f3f5', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 16px', fontWeight: '600', color: buttonColor }}>{landmarkNames[idx] || `Landmark ${idx}`}</td>
                      <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#5a6c7d' }}>{lm[0].toFixed(4)}</td>
                      <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#5a6c7d' }}>{lm[1].toFixed(4)}</td>
                      <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#5a6c7d' }}>{lm[2].toFixed(4)}</td>
                      <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#5a6c7d' }}>{lm[3].toFixed(2)}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem', color: '#5a6c7d', textAlign: 'center' }}>
            Total frames with pose data: <strong style={{ color: '#2c3e50' }}>{poseData.length}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
