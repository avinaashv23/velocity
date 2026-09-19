import React from 'react';
import { Priority, TaskStatus } from '../../types';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<TaskStatus, { label: string; bg: string; text: string; border: string }> = {
    TODO: {
      label: 'Todo',
      bg: 'bg-slate-800/80',
      text: 'text-slate-300',
      border: 'border-slate-700',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-blue-950/60',
      text: 'text-blue-400',
      border: 'border-blue-800/50',
    },
    IN_REVIEW: {
      label: 'In Review',
      bg: 'bg-purple-950/60',
      text: 'text-purple-400',
      border: 'border-purple-800/50',
    },
    DONE: {
      label: 'Done',
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-400',
      border: 'border-emerald-800/50',
    },
  };

  const config = configs[status] || configs.TODO;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {config.label}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const configs: Record<Priority, { label: string; bg: string; text: string; border: string }> = {
    LOW: {
      label: 'Low',
      bg: 'bg-slate-800/80',
      text: 'text-slate-400',
      border: 'border-slate-700',
    },
    MEDIUM: {
      label: 'Medium',
      bg: 'bg-sky-950/60',
      text: 'text-sky-400',
      border: 'border-sky-800/40',
    },
    HIGH: {
      label: 'High',
      bg: 'bg-amber-950/60',
      text: 'text-amber-400',
      border: 'border-amber-800/50',
    },
    CRITICAL: {
      label: 'Critical',
      bg: 'bg-rose-950/70',
      text: 'text-rose-400',
      border: 'border-rose-800/60',
    },
  };

  const config = configs[priority] || configs.LOW;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
};

export const ProjectHealthBadge: React.FC<{ status: 'ACTIVE' | 'AT_RISK' | 'ON_HOLD' | 'COMPLETED' }> = ({
  status,
}) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
          On Track
        </span>
      );
    case 'AT_RISK':
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40">
          At Risk
        </span>
      );
    case 'ON_HOLD':
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">
          On Hold
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded bg-blue-950/60 text-blue-400 border border-blue-800/40">
          Completed
        </span>
      );
    default:
      return null;
  }
};
