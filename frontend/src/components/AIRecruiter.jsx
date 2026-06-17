import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';

const AIRecruiter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'system',
      text: "🤖 Hello! I'm the WorkNest AI Recruiter. Ask me to find jobs, ask how WorkNest works, or tell me what skills you have!"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatLog, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message;
    setMessage('');
    setChatLog((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: userMsg });
      setChatLog((prev) => [...prev, { sender: 'system', text: data.reply }]);
    } catch (err) {
      setChatLog((prev) => [
        ...prev,
        { sender: 'system', text: '⚠️ Connection failed. Please ensure the backend server is running.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="ai-chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        <svg viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      {/* Chat Drawer */}
      <div className={`chat-drawer ${isOpen ? 'open' : ''}`}>
        <div className="chat-drawer-header">
          <h3>
            <span style={{ fontSize: '18px' }}>🤖</span> WorkNest AI Recruiter
          </h3>
          <button className="close-chat-btn" onClick={() => setIsOpen(false)}>×</button>
        </div>

        <div className="chat-drawer-messages">
          {chatLog.map((msg, index) => (
            <div key={index} className={`chat-row ${msg.sender === 'user' ? 'right' : ''}`}>
              <div className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'system'}`} style={{ whiteSpace: 'pre-line' }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-row">
              <div className="chat-bubble system">🤖 Typing...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-drawer-input-area">
          <form className="chat-drawer-form" onSubmit={handleSend}>
            <input
              type="text"
              className="chat-drawer-input"
              placeholder="Ask for jobs (e.g. 'find design jobs')..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="chat-drawer-send-btn" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AIRecruiter;
