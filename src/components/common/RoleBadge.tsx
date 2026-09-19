import React from 'react';
import { Role } from '../../types';

interface RoleBadgeProps {
  role: Role;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const configs: Record<Role, { label: string; bg: string; text: string; border: string }> = {
    ADMIN: {
      label: 'Admin',
      bg: 'bg-rose-950/60',
      text: 'text-rose-400',
      border: 'border-rose-800/50',
    },
    PROJECT_MANAGER: {
      label: 'Project Manager',
      bg: 'bg-purple-950/60',
      text: 'text-purple-400',
      border: 'border-purple-800/50',
    },
    DEVELOPER: {
      label: 'Developer',
      bg: 'bg-blue-950/60',
      text: 'text-blue-400',
      border: 'border-blue-800/50',
    },
  };

  const config = configs[role] || configs.DEVELOPER;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
};
