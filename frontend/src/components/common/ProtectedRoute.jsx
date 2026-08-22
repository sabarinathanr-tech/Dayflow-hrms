import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loading from './Loading';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen text="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedUserRole = (role || '').toUpperCase();
    const hasRole = allowedRoles.some((r) => r.toUpperCase() === normalizedUserRole);

    if (!hasRole) {
      // Role unauthorized: redirect to respective user home
      if (normalizedUserRole === 'HR' || normalizedUserRole === 'ADMIN') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
