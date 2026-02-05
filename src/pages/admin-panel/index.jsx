import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import AppIcon from '../../components/AppIcon';
import { useAuth } from '../../context/AuthContext';

// Mock Data
const MOCK_USERS = [
  { id: 'user-1', displayName: 'Amit General Store', email: 'amit@example.com', cibilScore: 720 },
  { id: 'user-2', displayName: 'Rahul Textiles', email: 'rahul@example.com', cibilScore: 680 },
  { id: 'user-3', displayName: 'Priya Electronics', email: 'priya@example.com', cibilScore: 750 },
];

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock admin check
  const isAdmin = user && (user.email === 'killnoymous@gmail.com' || user.email.includes('admin') || user.role === 'admin' || user.role === 'owner');

  if (!isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-2xl text-red-600">
        <AppIcon name="AlertTriangle" size={48} className="mb-4" />
        Access Denied: You do not have administrator privileges.
      </div>
    );
  }

  const filteredUsers = users.filter(u =>
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <h1 className="text-3xl font-bold text-foreground mb-8">Admin Panel (Demo Mode)</h1>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by name, email, or user ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <Card key={u.id} className="p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">{u.displayName || u.email?.split('@')[0] || 'N/A'}</h2>
                <p className="text-sm text-muted-foreground"><strong>User ID:</strong> {u.id}</p>
                <p className="text-sm text-muted-foreground"><strong>Email:</strong> {u.email || 'N/A'}</p>
                <p className="text-sm text-muted-foreground"><strong>CIBIL Score:</strong> {u.cibilScore || 'N/A'}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `mailto:${u.email}`}
                  disabled={!u.email}
                >
                  <AppIcon name="Mail" className="mr-2" />
                  Contact
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.location.href = `/admin/user/${u.id}`}
                >
                  <AppIcon name="Eye" className="mr-2" />
                  View Details
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;