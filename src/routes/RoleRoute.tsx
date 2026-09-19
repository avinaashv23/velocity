import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { UnauthorizedPage } from '../pages/errors/UnauthorizedPage';

interface RoleRouteProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const { currentUser } = useApp();

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};
