import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ userInfo, requiredRole, children }) => {
  const location = useLocation();

  if (!userInfo) {
    // Redirect to login, preserving the intended destination
    const redirectPath = location.pathname.replace(/^\//, '');
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  if (requiredRole && userInfo.role !== requiredRole) {
    // User is logged in but doesn't have the right role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
