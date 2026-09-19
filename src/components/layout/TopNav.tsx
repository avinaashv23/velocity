import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  Search,
  ChevronDown,
  UserCheck,
  CheckCheck,
  Circle,
  ExternalLink,
  Shield,
  Briefcase,
  Code2,
  Wifi,
  WifiOff,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoleBadge } from '../common/RoleBadge';

interface TopNavProps {
  sidebarCollapsed: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ sidebarCollapsed }) => {
  const {
    currentUser,
    users,
    loginAsUser,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    livePresenceCount,
    connectionStatus,
    simulateDisconnect,
    simulateReconnect,
    logout,
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [connectionMenuOpen, setConnectionMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const connRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleSwitcherOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setUserProfileOpen(false);
      }
      if (connRef.current && !connRef.current.contains(e.target as Node)) {
        setConnectionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  // Breadcrumbs generator
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) {
      return [{ label: 'Dashboard', path: '/dashboard' }];
    }
    if (path.startsWith('/projects/')) {
      return [
        { label: 'Projects', path: '/projects' },
        { label: 'Project Details', path },
      ];
    }
    if (path === '/projects') {
      return [{ label: 'Projects', path: '/projects' }];
    }
    if (path.startsWith('/tasks/')) {
      return [
        { label: 'Tasks', path: '/tasks' },
        { label: 'Task Details', path },
      ];
    }
    if (path === '/tasks') {
      return [{ label: 'Task Catalog', path: '/tasks' }];
    }
    if (path.startsWith('/clients/')) {
      return [
        { label: 'Clients', path: '/clients' },
        { label: 'Client Details', path },
      ];
    }
    if (path === '/clients') {
      return [{ label: 'Client Accounts', path: '/clients' }];
    }
    if (path === '/team') {
      return [{ label: 'Team Directory', path: '/team' }];
    }
    if (path === '/activity') {
      return [{ label: 'Real-Time Activity', path: '/activity' }];
    }
    if (path === '/notifications') {
      return [{ label: 'Notifications', path: '/notifications' }];
    }
    if (path === '/settings') {
      return [{ label: 'Settings', path: '/settings' }];
    }
    return [{ label: 'ProjectHub', path: '/' }];
  };

  const breadcrumbs = getBreadcrumbs();
  const userNotifications = notifications.filter(n => n.recipientId === currentUser.id);

  const handleRoleSwitch = (userId: string) => {
    loginAsUser(userId);
    setRoleSwitcherOpen(false);
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      if (targetUser.role === 'ADMIN') navigate('/dashboard/admin');
      else if (targetUser.role === 'PROJECT_MANAGER') navigate('/dashboard/project-manager');
      else navigate('/dashboard/developer');
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 z-30 bg-[#131924] border-b border-[#222b3d] flex items-center justify-between px-6 transition-all duration-300 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Left: Dynamic Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.path}>
            {idx > 0 && <span className="text-slate-500 font-mono">/</span>}
            {idx === breadcrumbs.length - 1 ? (
              <span className="font-semibold text-slate-100">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="text-slate-400 hover:text-slate-200 transition-colors">
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}

        <span className="hidden md:inline-block ml-3 text-[11px] px-2 py-0.5 rounded bg-[#182130] text-slate-400 border border-[#27364e]">
          RBAC Policy: <strong className="text-slate-200">{currentUser.role}</strong>
        </span>
      </div>

      {/* Right: Controls & Menus */}
      <div className="flex items-center gap-3">
        {/* Socket Connection Status Badge */}
        <div className="relative" ref={connRef}>
          <button
            onClick={() => setConnectionMenuOpen(!connectionMenuOpen)}
            className={`hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              connectionStatus === 'CONNECTED'
                ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                : connectionStatus === 'RECONNECTING'
                ? 'bg-amber-950/40 border-amber-800/40 text-amber-300'
                : 'bg-rose-950/40 border-rose-800/40 text-rose-300'
            }`}
            title="WebSocket Connection Status (Click to test socket events)"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'CONNECTED'
                  ? 'bg-emerald-400 animate-pulse'
                  : connectionStatus === 'RECONNECTING'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-rose-400'
              }`}
            />
            <span>
              {connectionStatus === 'CONNECTED'
                ? 'Connected'
                : connectionStatus === 'RECONNECTING'
                ? 'Reconnecting...'
                : 'Disconnected'}
            </span>
            <ChevronDown size={12} className="opacity-70" />
          </button>

          {connectionMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[#27364e] bg-[#17202f] shadow-2xl p-3 z-50 text-xs space-y-2">
              <div className="font-semibold text-slate-200">WebSocket Simulator</div>
              <p className="text-[11px] text-slate-400">
                Test real-time socket disconnect, recovery, and missed event catch-up.
              </p>
              <div className="pt-2 border-t border-[#232f44] flex flex-col gap-1.5">
                {connectionStatus === 'CONNECTED' ? (
                  <button
                    onClick={() => {
                      simulateDisconnect();
                      setConnectionMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-left transition-colors"
                  >
                    <WifiOff size={14} />
                    <span>Simulate Disconnect</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      simulateReconnect();
                      setConnectionMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-left transition-colors"
                  >
                    <Wifi size={14} />
                    <span>Simulate Reconnect & Catch-up</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Persona Switcher (For Evaluators) */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182130] hover:bg-[#202c40] border border-[#27364e] text-xs font-semibold text-slate-200 transition-colors"
          >
            <UserCheck size={14} className="text-blue-400" />
            <span className="hidden md:inline">Switch Persona</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-[#27364e] bg-[#17202f] shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-[#232f44] mb-1">
                <div className="text-xs font-bold text-slate-100">Evaluator Persona Switcher</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Instant switch to preview role-specific scoping
                </div>
              </div>

              <div className="space-y-1 max-h-80 overflow-y-auto">
                {users.map(u => {
                  const isSelected = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleRoleSwitch(u.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        isSelected ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-[#1f2b3d] text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-600/25 border border-blue-500/30 text-blue-300 font-bold text-xs flex items-center justify-center">
                          {u.avatar || u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200 text-xs">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.department || u.email}</div>
                        </div>
                      </div>
                      <RoleBadge role={u.role} size="sm" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#182130] transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center font-mono ring-2 ring-[#131924]">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#27364e] bg-[#161e2c] shadow-2xl overflow-hidden z-50 animate-in fade-in">
              <div className="px-4 py-3 border-b border-[#232f44] flex items-center justify-between bg-[#131924]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-300 text-[10px] font-bold font-mono">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#1e283b]">
                {userNotifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No notifications for this account yet.
                  </div>
                ) : (
                  userNotifications.slice(0, 6).map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3.5 text-xs transition-colors cursor-pointer ${
                        !n.isRead ? 'bg-[#1a2333]' : 'hover:bg-[#192231]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs ${!n.isRead ? 'text-slate-100 font-semibold' : 'text-slate-300'}`}>
                          {n.message}
                        </p>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-[#232f44] bg-[#131924] text-center">
                <Link
                  to="/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setUserProfileOpen(!userProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#182130] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-center">
              {currentUser.avatar || currentUser.name.charAt(0)}
            </div>
            <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
          </button>

          {userProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#27364e] bg-[#161e2c] shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-[#232f44]">
                <div className="text-xs font-bold text-slate-100 truncate">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{currentUser.email}</div>
                <div className="mt-1.5">
                  <RoleBadge role={currentUser.role} size="sm" />
                </div>
              </div>

              <div className="pt-1">
                <Link
                  to="/settings"
                  onClick={() => setUserProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1f2b3d] text-xs transition-colors"
                >
                  <span>Profile & Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setUserProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-xs transition-colors"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
