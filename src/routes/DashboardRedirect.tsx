import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const DashboardRedirect: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  if (currentUser.role === 'ADMIN') {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (currentUser.role === 'PROJECT_MANAGER') {
    return <Navigate to="/dashboard/project-manager" replace />;
  }

  return <Navigate to="/dashboard/developer" replace />;
};
