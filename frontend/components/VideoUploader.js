"use client";
import { useState } from 'react';
import axios from 'axios';
import FeedbackDisplay from './FeedbackDisplay';

export default function VideoUploader() {
  const [feedback, setFeedback] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:8000/upload', formData);
    setFeedback(response.data.feedback);
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
    </div>
  );
}
