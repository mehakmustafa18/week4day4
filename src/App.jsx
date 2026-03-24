import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import ChatRoom from './components/ChatRoom';
import socket from './socket';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('chatUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentRoom, setCurrentRoom] = useState('general');

  useEffect(() => {
    if (user) {
      localStorage.setItem('chatUser', JSON.stringify(user));
      socket.connect();
    } else {
      localStorage.removeItem('chatUser');
    }
    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="app-container">
      <Sidebar 
        currentUser={user} 
        currentRoom={currentRoom} 
        onSelectRoom={setCurrentRoom} 
        onLogout={handleLogout}
      />
      <ChatRoom 
        roomId={currentRoom} 
        currentUser={user.username} 
      />
    </div>
  );
}

export default App;
