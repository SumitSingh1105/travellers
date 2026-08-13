import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from './Loading';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect user to their corresponding dashboard if trying to access unauthorized route
    if (user?.role === 'guide') return <Navigate to="/dashboard/guide" replace />;
    return <Navigate to="/dashboard/traveler" replace />;
  }

  return children;
};

export default ProtectedRoute;
