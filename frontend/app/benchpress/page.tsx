"use client";
import VideoUploader from '../../components/VideoUploader';
import Link from 'next/link';
import Image from 'next/image';

export default function BenchpressPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
      padding: '40px 20px'
    }}>
      {/* Back Button */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 30px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: '#fff',
            color: '#2c3e50',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5576c';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'translateX(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 87, 108, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#2c3e50';
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
          }}>
            ← Back to Home
          </button>
        </Link>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(245, 87, 108, 0.3)'
        }}>
          <Image 
            src="/benchPress.svg" 
            alt="Bench Press" 
            width={60} 
            height={60}
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
        <h1 style={{ 
          fontSize: '3rem', 
          color: '#2c3e50', 
          margin: '0 0 15px 0',
          fontWeight: '800',
          letterSpacing: '-1px'
        }}>
          Bench Press Form Analysis
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#5a6c7d',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.5'
        }}>
          Upload your bench press video for automated form analysis
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e8e9eb'
      }}>
        <VideoUploader exerciseType="benchpress" />
      </div>
    </div>
  );
}
