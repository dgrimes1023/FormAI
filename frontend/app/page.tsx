import VideoUploader from '../components/VideoUploader';

export default function Home() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', color: '#8e44ad', margin: '40px 0' }}>
        Form AI MVP
      </h1>
      <VideoUploader />
    </div>
  );
}
