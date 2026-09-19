import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';
import { DashboardRedirect } from './routes/DashboardRedirect';
import { AppShell } from './components/layout/AppShell';

// Pages
import { Login } from './pages/auth/Login';
import { AdminDashboardPage } from './pages/dashboard/AdminDashboardPage';
import { PMDashboardPage } from './pages/dashboard/PMDashboardPage';
import { DeveloperDashboardPage } from './pages/dashboard/DeveloperDashboardPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { ProjectDetailsPage } from './pages/projects/ProjectDetailsPage';
import { TasksPage } from './pages/tasks/TasksPage';
import { TaskDetailsPage } from './pages/tasks/TaskDetailsPage';
import { ClientsPage } from './pages/clients/ClientsPage';
import { ClientDetailsPage } from './pages/clients/ClientDetailsPage';
import { TeamPage } from './pages/TeamPage';
import { ActivityPage } from './pages/ActivityPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { UnauthorizedPage } from './pages/errors/UnauthorizedPage';
import { NotFoundPage } from './pages/errors/NotFoundPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/login" element={<Login />} />

          {/* Root Redirects to Role-Specific Dashboard */}
          <Route path="/" element={<DashboardRedirect />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Protected Application Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            {/* Dashboards */}
            <Route
              path="/dashboard/admin"
              element={
                <RoleRoute allowedRoles={['ADMIN']}>
                  <AdminDashboardPage />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/project-manager"
              element={
                <RoleRoute allowedRoles={['PROJECT_MANAGER', 'ADMIN']}>
                  <PMDashboardPage />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/developer"
              element={
                <RoleRoute allowedRoles={['DEVELOPER', 'ADMIN', 'PROJECT_MANAGER']}>
                  <DeveloperDashboardPage />
                </RoleRoute>
              }
            />

            {/* Projects */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />

            {/* Tasks */}
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />

            {/* Clients (Admin Only) */}
            <Route
              path="/clients"
              element={
                <RoleRoute allowedRoles={['ADMIN']}>
                  <ClientsPage />
                </RoleRoute>
              }
            />
            <Route
              path="/clients/:clientId"
              element={
                <RoleRoute allowedRoles={['ADMIN']}>
                  <ClientDetailsPage />
                </RoleRoute>
              }
            />

            {/* Team Directory */}
            <Route path="/team" element={<TeamPage />} />

            {/* Activity Stream */}
            <Route path="/activity" element={<ActivityPage />} />

            {/* Notifications */}
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* Error Pages inside Shell */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
