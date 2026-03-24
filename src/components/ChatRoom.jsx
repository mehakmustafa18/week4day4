import { useState, useRef, useEffect } from 'react';
import { useGetMessagesQuery, useSendMessageMutation } from '../services/chatApi';
import SocketListener from './SocketListener';
import socket from '../socket';

function ChatRoom({ roomId, currentUser }) {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  
  const { data: messages = [], isLoading } = useGetMessagesQuery(roomId);
  const [sendMessage] = useSendMessageMutation();
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing events via socket
  useEffect(() => {
    const handleTyping = (user) => {
      if (user === currentUser) return; // Ignore own typing events
      setTypingUsers((prev) => {
        if (!prev.includes(user)) return [...prev, user];
        return prev;
      });
      // Clear typing indicator after 2 seconds
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter(u => u !== user));
      }, 2000);
    };

    socket.on('user-typing', handleTyping);
    return () => socket.off('user-typing', handleTyping);
  }, [currentUser]);

  const handleTypingChange = (e) => {
    setText(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { roomId, user: currentUser });
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const msg = { roomId, text, sender: currentUser, timestamp: Date.now() };

    // 1. Send via RTK Query mutation
    sendMessage(msg);

    // 2. Broadcast immediately via Socket
    socket.emit('send-message', msg);

    setText('');
    setIsTyping(false);
  };

  return (
    <div className="chat-room">
      <SocketListener roomId={roomId} />
      
      <div className="chat-header">
        <h2>#{roomId}</h2>
      </div>

      <div className="chat-messages">
        {isLoading ? (
          <p className="loading">Loading messages...</p>
        ) : Array.isArray(messages) && messages.map((msg, idx) => (
            <div 
              key={msg._id || idx} 
              className={`message-wrapper ${msg.sender === currentUser ? 'mine' : 'theirs'}`}
            >
              <div className="message">
                {msg.sender !== currentUser && <span className="sender">{msg.sender}</span>}
                <div className="bubble">{msg.text}</div>
              </div>
            </div>
          ))
        }
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      <form className="chat-input" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={text} 
          onChange={handleTypingChange}
        />
        <button type="submit" disabled={!text.trim()}>Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;
