"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string>('ollama');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Save model selection to localStorage
  useEffect(() => {
    const savedModel = localStorage.getItem('selectedModel');
    if (savedModel) {
      setSelectedModel(savedModel);
    }
  }, []);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    localStorage.setItem('selectedModel', model);
    setIsDropdownOpen(false);
  };
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
      padding: '60px 20px'
    }}>
      {/* Header Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '70px',
        position: 'relative'
      }}>
        {/* Model Dropdown */}
        <div style={{
          position: 'absolute',
          top: '0',
          right: '20px',
          zIndex: 10
        }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                background: '#fff',
                color: '#2c3e50',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <span>Model: {selectedModel === 'ollama' ? 'Ollama' : 'ApiFree'}</span>
              <span style={{ fontSize: '0.7rem' }}>▼</span>
            </button>
            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '8px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                border: '1px solid #e0e0e0',
                minWidth: '200px',
                overflow: 'hidden',
                zIndex: 20
              }}>
                <button
                  onClick={() => handleModelChange('ollama')}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: selectedModel === 'ollama' ? '#f0f4ff' : '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.95rem',
                    color: selectedModel === 'ollama' ? '#667eea' : '#2c3e50',
                    fontWeight: selectedModel === 'ollama' ? '600' : '500',
                    transition: 'background 0.2s ease',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedModel !== 'ollama') e.currentTarget.style.background = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedModel !== 'ollama') e.currentTarget.style.background = '#fff';
                  }}
                >
                  Ollama (Local)
                </button>
                <button
                  onClick={() => handleModelChange('apifree')}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: selectedModel === 'apifree' ? '#f0f4ff' : '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.95rem',
                    color: selectedModel === 'apifree' ? '#667eea' : '#2c3e50',
                    fontWeight: selectedModel === 'apifree' ? '600' : '500',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedModel !== 'apifree') e.currentTarget.style.background = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedModel !== 'apifree') e.currentTarget.style.background = '#fff';
                  }}
                >
                  ApiFree (Cloud)
                </button>
              </div>
            )}
          </div>
        </div>

        <h1 style={{ 
          fontSize: '3.5rem', 
          color: '#2c3e50', 
          margin: '0 0 15px 0',
          fontWeight: '800',
          letterSpacing: '-1px'
        }}>
          Form AI
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#5a6c7d', 
          maxWidth: '650px',
          margin: '0 auto',
          lineHeight: '1.5',
          fontWeight: '400'
        }}>
          Video-based exercise form analysis using computer vision
        </p>
      </div>

      {/* Exercise Selection Cards */}
      <div style={{ 
        display: 'flex', 
        gap: '40px', 
        justifyContent: 'center',
        maxWidth: '1100px',
        margin: '0 auto 60px',
        flexWrap: 'wrap'
      }}>
        <Link href="/squat" style={{ textDecoration: 'none', flex: '1', minWidth: '300px', maxWidth: '500px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '0',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            overflow: 'hidden',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.3)';
          }}>
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                margin: '0 auto 25px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}>
                <Image 
                  src="/squat.png" 
                  alt="Squat" 
                  width={80} 
                  height={80}
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
              <h2 style={{ 
                fontSize: '2rem', 
                color: '#ffffff', 
                marginBottom: '25px',
                fontWeight: 'bold'
              }}>Squat Analysis</h2>
              <div style={{
                display: 'inline-block',
                padding: '14px 35px',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#667eea',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                Analyze Video →
              </div>
            </div>
          </div>
        </Link>
        
        <Link href="/benchpress" style={{ textDecoration: 'none', flex: '1', minWidth: '300px', maxWidth: '500px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '16px',
            padding: '0',
            boxShadow: '0 4px 20px rgba(245, 87, 108, 0.3)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            overflow: 'hidden',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(245, 87, 108, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(245, 87, 108, 0.3)';
          }}>
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                margin: '0 auto 25px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}>
                <Image 
                  src="/benchPress.svg" 
                  alt="Bench Press" 
                  width={80} 
                  height={80}
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
              <h2 style={{ 
                fontSize: '2rem', 
                color: '#ffffff', 
                marginBottom: '25px',
                fontWeight: 'bold'
              }}>Bench Press Analysis</h2>
              <div style={{
                display: 'inline-block',
                padding: '14px 35px',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#f5576c',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                Analyze Video →
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Features Section */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px'
      }}>
        <div style={{ 
          background: '#fff',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          borderLeft: '4px solid #667eea'
        }}>
          <h3 style={{ color: '#2c3e50', fontSize: '1.3rem', marginBottom: '15px', fontWeight: '600' }}>
            Squat Features
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Rep counting via head position tracking',
              'Depth analysis (hip vs knee position)',
              'Knee alignment validation',
              'Frame-by-frame pose detection'
            ].map((feature, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ 
                  minWidth: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: '#667eea',
                  marginTop: '6px'
                }} />
                <span style={{ color: '#5a6c7d', fontSize: '1rem', lineHeight: '1.6' }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          background: '#fff',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          borderLeft: '4px solid #f5576c'
        }}>
          <h3 style={{ color: '#2c3e50', fontSize: '1.3rem', marginBottom: '15px', fontWeight: '600' }}>
            Bench Press Features
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Video upload and frame extraction',
              'Pose landmark detection ready',
              'Analysis framework in place',
              'Custom implementation ready'
            ].map((feature, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ 
                  minWidth: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: '#f5576c',
                  marginTop: '6px'
                }} />
                <span style={{ color: '#5a6c7d', fontSize: '1rem', lineHeight: '1.6' }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
