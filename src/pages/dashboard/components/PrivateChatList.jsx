import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useAuth } from '../../../context/AuthContext';

// Mock Data
const MOCK_USERS = [
  { id: 'user-2', email: 'rahul@example.com', displayName: 'Rahul Store' },
  { id: 'user-3', email: 'priya@example.com', displayName: 'Priya Electronics' }
];

const MOCK_CHATS = [
  { id: 'chat-1', participants: ['user-12345', 'user-2'], lastMessageText: 'Hey, do you have stock?' }
];

const PrivateChatList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [chats, setChats] = useState(MOCK_CHATS);
  const navigate = useNavigate();

  const handleStartChat = (targetUserId) => {
    // In a real app we would check for existing chat or create one
    // For demo, we just navigate to a dummy chat ID or the existing one
    const existingChat = chats.find(chat => chat.participants.includes(targetUserId));
    if (existingChat) {
      navigate(`/dashboard/private-chat/${existingChat.id}`);
    } else {
      // Simulate creating a new chat ID
      const newChatId = `chat-new-${Date.now()}`;
      navigate(`/dashboard/private-chat/${newChatId}`);
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Private Messages</h2>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search users by email or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <Card key={u.id} className="p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{u.displayName || u.email}</p>
                <p className="text-sm text-muted-foreground">{u.email}</p>
              </div>
              <Button onClick={() => handleStartChat(u.id)}>Chat</Button>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No users found.</p>
        )}

        {chats.length > 0 && (
          <>
            <h3 className="text-xl font-bold mt-6 mb-3">Your Chats</h3>
            {chats.map((chat) => {
              const otherParticipantId = chat.participants.find(pId => pId !== user?.uid);
              const otherParticipant = users.find(u => u.id === otherParticipantId) || { displayName: 'Unknown User' };
              return (
                <Card key={chat.id} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{otherParticipant.displayName}</p>
                    <p className="text-sm text-muted-foreground">Last message: {chat.lastMessageText}</p>
                  </div>
                  <Button onClick={() => navigate(`/dashboard/private-chat/${chat.id}`)}>Open Chat</Button>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default PrivateChatList;
