import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppIcon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// Mock data for demo
const MOCK_MESSAGES = [
  { id: '1', text: 'Welcome to the community!', senderId: 'system', senderName: 'System', timestamp: new Date() },
  { id: '2', text: 'Has anyone tried the new credit score feature?', senderId: 'user-2', senderName: 'Rahul Store', timestamp: new Date(Date.now() - 3600000) }
];

const CommunityChat = () => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    const newMsg = {
      id: Date.now().toString(),
      text: newMessage,
      senderId: user.uid,
      senderName: user.displayName || user.email,
      timestamp: new Date(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground relative">
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`relative flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs p-3 rounded-lg ${msg.senderId === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <p className="font-medium text-sm">{msg.senderName}</p>
              <p className="text-base">{msg.text}</p>
              <span className="text-xs opacity-75 block mt-1">
                {msg.timestamp.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-card p-4 border-t border-border">
        <form onSubmit={sendMessage} className="flex space-x-2 items-end">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className=""
            disabled={!user}
          />
          <Button type="submit" disabled={!user || newMessage.trim() === ''}>
            <AppIcon name="Send" className="mr-2" />
            Send
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default CommunityChat;
