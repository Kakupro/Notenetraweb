import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-dark-text-primary">Loading authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login-page" replace />;
  }

  return children;
};

export default ProtectedRoute;
