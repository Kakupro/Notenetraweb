import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Checking permissions...</div>;
  }

  // Mock admin check: just check if email contains 'admin' or specific email for demo
  const isAdmin = user && (user.email === 'killnoymous@gmail.com' || user.email.includes('admin'));

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;
