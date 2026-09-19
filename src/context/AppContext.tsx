import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import {
  ActivityLog,
  Client,
  ConnectionStatus,
  Notification,
  Project,
  Role,
  Task,
  TaskFilters,
  TaskStatus,
  ToastItem,
  User,
} from '../types';
import {
  SEED_ACTIVITIES,
  SEED_CLIENTS,
  SEED_NOTIFICATIONS,
  SEED_PROJECTS,
  SEED_TASKS,
  SEED_USERS,
} from '../data/seedData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  activities: ActivityLog[];
  notifications: Notification[];
  connectionStatus: ConnectionStatus;
  missedEventsCount: number;
  livePresenceCount: number;
  isLiveSimulationActive: boolean;
  toasts: ToastItem[];

  // Authentication & Persona
  loginAsUser: (userId: string) => void;
  loginWithCredentials: (email: string, role?: Role) => boolean;
  logout: () => void;

  // Task Operations
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => { success: boolean; error?: string };
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; error?: string; task?: Task };
  updateTask: (taskId: string, updates: Partial<Task>) => { success: boolean; error?: string };
  deleteTask: (taskId: string) => { success: boolean; error?: string };

  // Project Operations
  createProject: (projectData: Omit<Project, 'id' | 'createdAt'>) => { success: boolean; error?: string; project?: Project };
  updateProject: (projectId: string, updates: Partial<Project>) => { success: boolean; error?: string };

  // Client Operations
  createClient: (clientData: Omit<Client, 'id' | 'createdAt'>) => { success: boolean; error?: string; client?: Client };

  // Team Operations
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => { success: boolean; error?: string; user?: User };

  // Notification Operations
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Socket & Simulation Operations
  connectionStatusText: string;
  simulateDisconnect: () => void;
  simulateReconnect: () => void;
  toggleLiveSimulation: () => void;
  resetToSeedData: () => void;

  // UI Toasts
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // RBAC Scoping & Policy Helpers
  canManageProject: (projectId: string) => boolean;
  canEditTask: (taskId: string) => boolean;
  canManageClients: () => boolean;
  canManageTeam: () => boolean;
  canCreateProjects: () => boolean;
  getAccessibleProjects: () => Project[];
  getAccessibleTasks: () => Task[];
  getAccessibleActivities: () => ActivityLog[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or initialize with seed data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('vph_users');
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('vph_clients');
    return saved ? JSON.parse(saved) : SEED_CLIENTS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('vph_projects');
    return saved ? JSON.parse(saved) : SEED_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('vph_tasks');
    return saved ? JSON.parse(saved) : SEED_TASKS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('vph_activities');
    return saved ? JSON.parse(saved) : SEED_ACTIVITIES;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('vph_notifications');
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  // Default to Admin User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem('vph_current_user_id');
    if (savedId) {
      const found = (SEED_USERS).find(u => u.id === savedId);
      if (found) return found;
    }
    return SEED_USERS[0]; // Admin User
  });

  // Socket Connection State
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('CONNECTED');
  const [missedEventsCount, setMissedEventsCount] = useState<number>(0);
  const [livePresenceCount, setLivePresenceCount] = useState<number>(14);
  const [isLiveSimulationActive, setIsLiveSimulationActive] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Persist main state changes to localStorage
  useEffect(() => {
    localStorage.setItem('vph_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('vph_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('vph_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('vph_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('vph_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('vph_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vph_current_user_id', currentUser.id);
    } else {
      localStorage.removeItem('vph_current_user_id');
    }
  }, [currentUser]);

  // Periodic Overdue Tasks Checker (Background Job simulation)
  useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date().toISOString().split('T')[0];
      setTasks(prevTasks => {
        let hasChanges = false;
        const updated = prevTasks.map(task => {
          if (task.status !== 'DONE' && task.dueDate < now && !task.isOverdue) {
            hasChanges = true;
            return { ...task, isOverdue: true };
          }
          return task;
        });
        return hasChanges ? updated : prevTasks;
      });
    };

    checkOverdueTasks();
    const interval = setInterval(checkOverdueTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  // Presence simulation: subtle realistic fluctuations between 11 and 17
  useEffect(() => {
    if (!isLiveSimulationActive || connectionStatus !== 'CONNECTED') return;
    const interval = setInterval(() => {
      setLivePresenceCount(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return Math.min(18, Math.max(10, next));
      });
    }, 12000);
    return () => clearInterval(interval);
  }, [isLiveSimulationActive, connectionStatus]);

  const addToast = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts(prev => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Socket Disconnect / Reconnect Simulator
  const simulateDisconnect = useCallback(() => {
    setConnectionStatus('DISCONNECTED');
    addToast('WebSocket connection closed. Offline mode active.', 'warning');
  }, [addToast]);

  const simulateReconnect = useCallback(() => {
    setConnectionStatus('RECONNECTING');
    setTimeout(() => {
      setConnectionStatus('CONNECTED');
      const missedCount = Math.floor(Math.random() * 8) + 4;
      setMissedEventsCount(missedCount);
      addToast(`✓ Connection restored. Loaded ${missedCount} missed activities from database.`, 'success');
    }, 1200);
  }, [addToast]);

  const toggleLiveSimulation = useCallback(() => {
    setIsLiveSimulationActive(prev => {
      const next = !prev;
      addToast(next ? 'Live WebSocket background simulation resumed.' : 'Live simulation paused.', 'info');
      return next;
    });
  }, [addToast]);

  // Live WebSocket activity simulation: periodically emits realistic team activities
  useEffect(() => {
    if (!isLiveSimulationActive || connectionStatus !== 'CONNECTED') return;

    const simulationInterval = setInterval(() => {
      // Pick random action
      const devs = users.filter(u => u.role === 'DEVELOPER');
      const pms = users.filter(u => u.role === 'PROJECT_MANAGER');
      if (devs.length === 0 || pms.length === 0) return;

      const randomDev = devs[Math.floor(Math.random() * devs.length)];
      const randomPm = pms[Math.floor(Math.random() * pms.length)];

      const possibleTasks = tasks.filter(t => t.status !== 'DONE');
      if (possibleTasks.length === 0) return;
      const targetTask = possibleTasks[Math.floor(Math.random() * possibleTasks.length)];

      const actions = ['PROGRESS_UPDATE', 'STATUS_REVIEW', 'COMMENT'];
      const chosen = actions[Math.floor(Math.random() * actions.length)];

      if (chosen === 'STATUS_REVIEW' && targetTask.status === 'IN_PROGRESS') {
        const updatedTask = { ...targetTask, status: 'IN_REVIEW' as TaskStatus, updatedAt: new Date().toISOString() };
        setTasks(prev => prev.map(t => (t.id === targetTask.id ? updatedTask : t)));

        const newActivity: ActivityLog = {
          id: `act-live-${Date.now()}`,
          projectId: targetTask.projectId,
          taskId: targetTask.id,
          actorId: targetTask.assignedDeveloperId || randomDev.id,
          action: 'STATUS_CHANGED',
          previousStatus: 'IN_PROGRESS',
          newStatus: 'IN_REVIEW',
          message: `${randomDev.name} moved "${targetTask.title}" from In Progress to In Review.`,
          createdAt: new Date().toISOString(),
        };
        setActivities(prev => [newActivity, ...prev]);

        // Trigger notification for project PM
        const targetProj = projects.find(p => p.id === targetTask.projectId);
        if (targetProj) {
          const newNotif: Notification = {
            id: `notif-${Date.now()}`,
            recipientId: targetProj.createdById,
            actorId: randomDev.id,
            type: 'TASK_IN_REVIEW',
            taskId: targetTask.id,
            projectId: targetProj.id,
            message: `Task "${targetTask.title}" requires your review in ${targetProj.name}.`,
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications(prev => [newNotif, ...prev]);
        }
      }
    }, 45000);

    return () => clearInterval(simulationInterval);
  }, [isLiveSimulationActive, connectionStatus, users, tasks, projects]);

  // RBAC Policy Checks
  const canManageProject = (projectId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'ADMIN') return true;
    if (currentUser.role === 'PROJECT_MANAGER') {
      const project = projects.find(p => p.id === projectId);
      return project?.createdById === currentUser.id;
    }
    return false;
  };

  const canEditTask = (taskId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'ADMIN') return true;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;
    if (currentUser.role === 'DEVELOPER') {
      return task.assignedDeveloperId === currentUser.id;
    }
    if (currentUser.role === 'PROJECT_MANAGER') {
      const project = projects.find(p => p.id === task.projectId);
      return project?.createdById === currentUser.id;
    }
    return false;
  };

  const canManageClients = (): boolean => {
    return currentUser?.role === 'ADMIN';
  };

  const canManageTeam = (): boolean => {
    return currentUser?.role === 'ADMIN';
  };

  const canCreateProjects = (): boolean => {
    return currentUser?.role === 'ADMIN' || currentUser?.role === 'PROJECT_MANAGER';
  };

  const getAccessibleProjects = useCallback((): Project[] => {
    if (!currentUser) return [];
    if (currentUser.role === 'ADMIN') return projects;
    if (currentUser.role === 'PROJECT_MANAGER') {
      return projects.filter(p => p.createdById === currentUser.id);
    }
    // Developer: projects where developer has assigned tasks
    const devTaskProjectIds = new Set(
      tasks.filter(t => t.assignedDeveloperId === currentUser.id).map(t => t.projectId)
    );
    return projects.filter(p => devTaskProjectIds.has(p.id));
  }, [currentUser, projects, tasks]);

  const getAccessibleTasks = useCallback((): Task[] => {
    if (!currentUser) return [];
    if (currentUser.role === 'ADMIN') return tasks;
    if (currentUser.role === 'PROJECT_MANAGER') {
      const pmProjectIds = new Set(
        projects.filter(p => p.createdById === currentUser.id).map(p => p.id)
      );
      return tasks.filter(t => pmProjectIds.has(t.projectId));
    }
    // Developer: ONLY assigned tasks
    return tasks.filter(t => t.assignedDeveloperId === currentUser.id);
  }, [currentUser, tasks, projects]);

  const getAccessibleActivities = useCallback((): ActivityLog[] => {
    if (!currentUser) return [];
    if (currentUser.role === 'ADMIN') return activities;
    if (currentUser.role === 'PROJECT_MANAGER') {
      const pmProjectIds = new Set(
        projects.filter(p => p.createdById === currentUser.id).map(p => p.id)
      );
      return activities.filter(a => pmProjectIds.has(a.projectId));
    }
    // Developer: activity on tasks assigned to developer
    const devTaskIds = new Set(
      tasks.filter(t => t.assignedDeveloperId === currentUser.id).map(t => t.id)
    );
    return activities.filter(a => a.taskId && devTaskIds.has(a.taskId));
  }, [currentUser, activities, projects, tasks]);

  const unreadNotificationsCount = useMemo(() => {
    if (!currentUser) return 0;
    return notifications.filter(n => n.recipientId === currentUser.id && !n.isRead).length;
  }, [notifications, currentUser]);

  // Actions
  const loginAsUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      addToast(`Switched active persona to ${user.name} (${user.role})`, 'success');
    }
  };

  const loginWithCredentials = (email: string, role?: Role): boolean => {
    let matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matched && role) {
      matched = users.find(u => u.role === role);
    }
    if (matched) {
      setCurrentUser(matched);
      addToast(`Welcome back, ${matched.name}!`, 'success');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Logged out of session.', 'info');
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: 'Unauthorized' };

    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, error: 'Task not found' };

    // RBAC Check
    if (currentUser.role === 'DEVELOPER' && task.assignedDeveloperId !== currentUser.id) {
      addToast('Security Violation: You can only update tasks assigned to your account.', 'error');
      return { success: false, error: 'Cannot update tasks assigned to other developers.' };
    }

    if (currentUser.role === 'PROJECT_MANAGER') {
      const project = projects.find(p => p.id === task.projectId);
      if (project?.createdById !== currentUser.id) {
        addToast('Security Violation: You do not own this project.', 'error');
        return { success: false, error: 'Cannot update tasks in another PM’s project.' };
      }
    }

    const previousStatus = task.status;
    if (previousStatus === newStatus) return { success: true };

    const updatedTask: Task = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => prev.map(t => (t.id === taskId ? updatedTask : t)));

    // Log Activity
    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      projectId: task.projectId,
      taskId: task.id,
      actorId: currentUser.id,
      action: 'STATUS_CHANGED',
      previousStatus,
      newStatus,
      message: `${currentUser.name} moved "${task.title}" from ${previousStatus.replace('_', ' ')} to ${newStatus.replace('_', ' ')}.`,
      createdAt: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);

    // Send Notification to PM if moved to IN_REVIEW
    if (newStatus === 'IN_REVIEW') {
      const project = projects.find(p => p.id === task.projectId);
      if (project && project.createdById !== currentUser.id) {
        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          recipientId: project.createdById,
          actorId: currentUser.id,
          type: 'TASK_IN_REVIEW',
          taskId: task.id,
          projectId: project.id,
          message: `${currentUser.name} submitted "${task.title}" for review in ${project.name}.`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    }

    addToast(`Task transitioned to ${newStatus.replace('_', ' ')}`, 'success');
    return { success: true };
  };

  const createTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): { success: boolean; error?: string; task?: Task } => {
    if (!currentUser) return { success: false, error: 'Unauthorized' };

    if (!canManageProject(taskData.projectId)) {
      addToast('Security Violation: You do not have permission to add tasks to this project.', 'error');
      return { success: false, error: 'Unauthorized to add tasks to this project.' };
    }

    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOverdue: false,
    };

    setTasks(prev => [newTask, ...prev]);

    // Log activity
    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      projectId: newTask.projectId,
      taskId: newTask.id,
      actorId: currentUser.id,
      action: 'CREATED_TASK',
      message: `${currentUser.name} created task "${newTask.title}".`,
      createdAt: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);

    // Notify assigned developer
    if (newTask.assignedDeveloperId && newTask.assignedDeveloperId !== currentUser.id) {
      const proj = projects.find(p => p.id === newTask.projectId);
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        recipientId: newTask.assignedDeveloperId,
        actorId: currentUser.id,
        type: 'TASK_ASSIGNED',
        taskId: newTask.id,
        projectId: newTask.projectId,
        message: `${currentUser.name} assigned you "${newTask.title}" in ${proj?.name || 'project'}.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    addToast(`Task "${newTask.title}" created successfully`, 'success');
    return { success: true, task: newTask };
  };

  const updateTask = (taskId: string, updates: Partial<Task>): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: 'Unauthorized' };

    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, error: 'Task not found' };

    if (!canEditTask(taskId)) {
      addToast('Security Violation: Insufficient permissions to modify this task.', 'error');
      return { success: false, error: 'Unauthorized' };
    }

    const updated = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
    addToast('Task details updated.', 'success');
    return { success: true };
  };

  const deleteTask = (taskId: string): { success: boolean; error?: string } => {
    if (!currentUser || currentUser.role === 'DEVELOPER') {
      addToast('Security Violation: Developers cannot delete tasks.', 'error');
      return { success: false, error: 'Unauthorized' };
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, error: 'Task not found' };

    if (currentUser.role === 'PROJECT_MANAGER' && !canManageProject(task.projectId)) {
      addToast('Security Violation: You can only delete tasks in your own projects.', 'error');
      return { success: false, error: 'Unauthorized' };
    }

    setTasks(prev => prev.filter(t => t.id !== taskId));
    addToast('Task removed from system.', 'info');
    return { success: true };
  };

  const createProject = (
    projectData: Omit<Project, 'id' | 'createdAt'>
  ): { success: boolean; error?: string; project?: Project } => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'PROJECT_MANAGER')) {
      addToast('Security Violation: Insufficient role permissions to create projects.', 'error');
      return { success: false, error: 'Unauthorized' };
    }

    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setProjects(prev => [newProject, ...prev]);

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      projectId: newProject.id,
      actorId: currentUser.id,
      action: 'CREATED_PROJECT',
      message: `${currentUser.name} created new project "${newProject.name}".`,
      createdAt: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);

    addToast(`Project "${newProject.name}" created.`, 'success');
    return { success: true, project: newProject };
  };

  const updateProject = (projectId: string, updates: Partial<Project>): { success: boolean; error?: string } => {
    if (!canManageProject(projectId)) {
      addToast('Security Violation: You do not have permission to edit this project.', 'error');
      return { success: false, error: 'Unauthorized' };
    }

    setProjects(prev => prev.map(p => (p.id === projectId ? { ...p, ...updates } : p)));

    if (currentUser) {
      const newActivity: ActivityLog = {
        id: `act-${Date.now()}`,
        projectId,
        actorId: currentUser.id,
        action: 'EDITED_PROJECT',
        message: `${currentUser.name} updated project metadata.`,
        createdAt: new Date().toISOString(),
      };
      setActivities(prev => [newActivity, ...prev]);
    }

    addToast('Project settings saved.', 'success');
    return { success: true };
  };

  const createClient = (
    clientData: Omit<Client, 'id' | 'createdAt'>
  ): { success: boolean; error?: string; client?: Client } => {
    if (!canManageClients()) {
      addToast('Security Violation: Only Admins can create client accounts.', 'error');
      return { success: false, error: 'Unauthorized' };
    }

    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setClients(prev => [newClient, ...prev]);
    addToast(`Client organization "${newClient.company}" registered.`, 'success');
    return { success: true, client: newClient };
  };

  const createUser = (
    userData: Omit<User, 'id' | 'createdAt'>
  ): { success: boolean; error?: string; user?: User } => {
    if (!canManageTeam()) {
      addToast('Security Violation: Only Admins can invite team members.', 'error');
      return { success: false, error: 'Unauthorized' };
    }

    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [newUser, ...prev]);
    addToast(`Team member "${newUser.name}" added to organization.`, 'success');
    return { success: true, user: newUser };
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev =>
      prev.map(n => (n.recipientId === currentUser.id ? { ...n, isRead: true } : n))
    );
    addToast('All notifications marked as read.', 'info');
  };

  const resetToSeedData = () => {
    localStorage.removeItem('vph_users');
    localStorage.removeItem('vph_clients');
    localStorage.removeItem('vph_projects');
    localStorage.removeItem('vph_tasks');
    localStorage.removeItem('vph_activities');
    localStorage.removeItem('vph_notifications');
    localStorage.removeItem('vph_current_user_id');

    setUsers(SEED_USERS);
    setClients(SEED_CLIENTS);
    setProjects(SEED_PROJECTS);
    setTasks(SEED_TASKS);
    setActivities(SEED_ACTIVITIES);
    setNotifications(SEED_NOTIFICATIONS);
    setCurrentUser(SEED_USERS[0]);

    addToast('System database reset to initial assessment seed data.', 'success');
  };

  const connectionStatusText = useMemo(() => {
    if (connectionStatus === 'CONNECTED') return 'Connected';
    if (connectionStatus === 'RECONNECTING') return 'Reconnecting...';
    return 'Disconnected';
  }, [connectionStatus]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        clients,
        projects,
        tasks,
        activities,
        notifications,
        connectionStatus,
        missedEventsCount,
        livePresenceCount,
        isLiveSimulationActive,
        toasts,

        loginAsUser,
        loginWithCredentials,
        logout,

        updateTaskStatus,
        createTask,
        updateTask,
        deleteTask,

        createProject,
        updateProject,
        createClient,
        createUser,

        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,

        connectionStatusText,
        simulateDisconnect,
        simulateReconnect,
        toggleLiveSimulation,
        resetToSeedData,

        addToast,
        dismissToast,

        canManageProject,
        canEditTask,
        canManageClients,
        canManageTeam,
        canCreateProjects,
        getAccessibleProjects,
        getAccessibleTasks,
        getAccessibleActivities,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
