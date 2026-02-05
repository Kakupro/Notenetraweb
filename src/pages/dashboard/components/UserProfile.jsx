import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import AppIcon from '../../../components/AppIcon';
import { useAuth } from '../../../context/AuthContext';
import Input from '../../../components/ui/Input';
import useTheme from '../../../hooks/useTheme';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    // Mock user profile loading
    if (!userId) {
      if (currentUser) {
        const profile = { id: currentUser.uid, email: currentUser.email, displayName: currentUser.displayName, shopAddress: '123 Market St', aboutBusiness: 'Demo Business' };
        setUserProfile(profile);
        setEditableProfile(profile);
        setLoading(false);
      } else {
        navigate('/login-page');
      }
      return;
    }

    // Mock fetching other user
    setUserProfile({ id: userId, email: 'other@example.com', displayName: 'Other User', shopAddress: '456 Town Rd', aboutBusiness: 'Another Shop' });
    setLoading(false);
  }, [userId, currentUser, navigate]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setUserProfile(editableProfile);
    setIsEditing(false);
    alert("Profile updated locally (demo mode)");
  };

  const handleCancelEdit = () => {
    setEditableProfile(userProfile);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Loading...</div>;

  const isCurrentUserProfile = currentUser && currentUser.uid === userProfile.id;

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {isCurrentUserProfile ? 'Account Settings' : 'User Profile'}
            {isCurrentUserProfile && !isEditing && (
              <Button onClick={handleEditProfile}>Edit Profile</Button>
            )}
            {isCurrentUserProfile && isEditing && (
              <div className="flex space-x-2">
                <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold">Username:</p>
            {isEditing ? <Input name="displayName" value={editableProfile.displayName || ''} onChange={handleChange} /> : <p>{userProfile.displayName}</p>}
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            {isEditing ? <Input name="email" value={editableProfile.email || ''} onChange={handleChange} /> : <p>{userProfile.email}</p>}
          </div>
          <div>
            <p className="font-semibold">Shop Address:</p>
            {isEditing ? <Input name="shopAddress" value={editableProfile.shopAddress || ''} onChange={handleChange} /> : <p>{userProfile.shopAddress}</p>}
          </div>
          <div>
            <p className="font-semibold">About:</p>
            {isEditing ? <Input name="aboutBusiness" value={editableProfile.aboutBusiness || ''} onChange={handleChange} /> : <p>{userProfile.aboutBusiness}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
