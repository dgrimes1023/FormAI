export default function FeedbackDisplay({ feedback }) {
  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Feedback:</h3>
      <p>{feedback}</p>
    </div>
  );
}