import { useState } from 'react';
import { useLoginUserMutation } from '../services/chatApi';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    try {
      const user = await loginUser(username).unwrap();
      onLogin(user);
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome to ChatApp</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !username.trim()}>
            {isLoading ? 'Joining...' : 'Join Chat'}
          </button>
        </form>
        {error && <p className="error">Login failed. Try again.</p>}
      </div>
    </div>
  );
}

export default LoginPage;
