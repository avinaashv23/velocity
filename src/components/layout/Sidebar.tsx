import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Building2,
  Activity,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Circle,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoleBadge } from '../common/RoleBadge';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const {
    currentUser,
    unreadNotificationsCount,
    livePresenceCount,
    logout,
    resetToSeedData,
    isLiveSimulationActive,
    toggleLiveSimulation,
    connectionStatus,
  } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const role = currentUser.role;

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/dashboard/admin';
    if (role === 'PROJECT_MANAGER') return '/dashboard/project-manager';
    return '/dashboard/developer';
  };

  interface NavItem {
    to: string;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
  }

  const getNavItems = (): NavItem[] => {
    const commonTop: NavItem[] = [
      { to: getDashboardPath(), label: 'Dashboard', icon: LayoutDashboard },
      { to: '/projects', label: role === 'PROJECT_MANAGER' ? 'My Projects' : 'Projects', icon: FolderKanban },
      { to: '/tasks', label: role === 'DEVELOPER' ? 'My Tasks' : 'Tasks', icon: CheckSquare },
    ];

    const adminSpecific: NavItem[] = [
      { to: '/clients', label: 'Clients', icon: Building2 },
      { to: '/team', label: 'Team Directory', icon: Users },
    ];

    const commonBottom: NavItem[] = [
      { to: '/activity', label: role === 'ADMIN' ? 'Global Activity' : 'Activity Feed', icon: Activity },
      { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount || undefined },
    ];

    if (role === 'ADMIN') {
      return [...commonTop, ...adminSpecific, ...commonBottom];
    }
    return [...commonTop, ...commonBottom];
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-[#141a24] border-r border-[#222b3d] flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-[#222b3d] flex items-center justify-between">
        <div
          className="flex items-center gap-3 overflow-hidden cursor-pointer"
          onClick={() => navigate(getDashboardPath())}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
            <span className="text-white font-black text-lg tracking-wider">V</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-slate-100 font-bold text-sm tracking-tight leading-none">Velozity</span>
              <span className="text-slate-400 text-[11px] mt-1 font-medium">ProjectHub</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1f2838] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User Mini Card */}
      {!collapsed && (
        <div className="p-4 mx-3 mt-3 rounded-xl bg-[#18202d] border border-[#232f44] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600/25 border border-blue-500/30 text-blue-300 font-bold text-sm flex items-center justify-center flex-shrink-0">
            {currentUser.avatar || currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">{currentUser.name}</div>
            <div className="mt-1">
              <RoleBadge role={currentUser.role} size="sm" />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#1a2230]'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.badge !== undefined && Number(item.badge) > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white font-mono">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}

        <div className="pt-3 my-2 border-t border-[#222b3d]">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-[#1a2230]'
              }`
            }
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings size={17} className="flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </nav>

      {/* Footer Controls & Live Presence */}
      <div className="p-3 border-t border-[#222b3d] space-y-2 bg-[#12161f]">
        {/* Live Presence Indicator */}
        <div className="px-2 py-1.5 rounded-lg bg-[#18202d] border border-[#232f44] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {connectionStatus === 'CONNECTED' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  connectionStatus === 'CONNECTED'
                    ? 'bg-emerald-500'
                    : connectionStatus === 'RECONNECTING'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
            </span>
            {!collapsed && (
              <span className="text-slate-300 font-medium">
                {livePresenceCount} online <span className="text-emerald-400 font-semibold">● Live</span>
              </span>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={toggleLiveSimulation}
              className={`p-1 rounded transition-colors ${
                isLiveSimulationActive ? 'text-emerald-400' : 'text-slate-500'
              }`}
              title={isLiveSimulationActive ? 'WebSocket: Live Stream active' : 'WebSocket: Paused'}
            >
              <Zap size={13} />
            </button>
          )}
        </div>

        {/* Reset Seed Data */}
        {!collapsed && (
          <button
            onClick={resetToSeedData}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1a2230] text-[11px] font-medium transition-colors border border-transparent hover:border-[#26354f]"
          >
            <RotateCcw size={12} />
            <span>Reset Demo Seed Data</span>
          </button>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-xs font-medium transition-colors"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={15} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
