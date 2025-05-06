import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Hello from React!</h1>
      <button onClick={() => setMessage('Thanks for clicking!')}>Click Me</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
