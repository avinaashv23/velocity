export type Role = 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ProjectStatus = 'ACTIVE' | 'AT_RISK' | 'ON_HOLD' | 'COMPLETED';

export type ConnectionStatus = 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  isOnline: boolean;
  department?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: string;
  createdAt: string;
  projectsCount?: number;
  activeProjectsCount?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  createdById: string; // PM or Admin ID
  dueDate: string;
  createdAt: string;
  status: ProjectStatus;
  budget?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedDeveloperId: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  isOverdue?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  projectId: string;
  taskId?: string;
  actorId: string;
  action: 'CREATED_TASK' | 'STATUS_CHANGED' | 'ASSIGNED_TASK' | 'CREATED_PROJECT' | 'UPDATED_PRIORITY' | 'SYSTEM_FLAG' | 'EDITED_PROJECT';
  previousStatus?: TaskStatus;
  newStatus?: TaskStatus;
  message: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  actorId?: string;
  type: 'TASK_ASSIGNED' | 'TASK_IN_REVIEW' | 'TASK_OVERDUE' | 'PROJECT_UPDATE';
  taskId?: string;
  projectId?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface TaskFilters {
  status?: TaskStatus | 'ALL';
  priority?: Priority | 'ALL';
  projectId?: string | 'ALL';
  assignedDeveloperId?: string | 'ALL';
  searchQuery?: string;
  dateRange?: 'ALL' | 'OVERDUE' | 'DUE_TODAY' | 'DUE_THIS_WEEK';
  from?: string;
  to?: string;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
