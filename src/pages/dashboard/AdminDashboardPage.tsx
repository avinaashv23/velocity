import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  AlertTriangle,
  Users,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Shield,
  Circle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectHealthBadge, StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { RoleBadge } from '../../components/common/RoleBadge';
import { CreateProjectModal } from '../../components/projects/CreateProjectModal';

export const AdminDashboardPage: React.FC = () => {
  const {
    projects,
    tasks,
    users,
    activities,
    livePresenceCount,
    connectionStatus,
    canCreateProjects,
  } = useApp();
  const navigate = useNavigate();

  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  // Computed metrics
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter(t => t.isOverdue || (t.status !== 'DONE' && t.dueDate < new Date().toISOString().split('T')[0]));
  const activeUsersCount = livePresenceCount;

  // Task status distribution
  const statusCounts = {
    TODO: tasks.filter(t => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    IN_REVIEW: tasks.filter(t => t.status === 'IN_REVIEW').length,
    DONE: tasks.filter(t => t.status === 'DONE').length,
  };

  // Project Health distribution
  const healthCounts = {
    ACTIVE: projects.filter(p => p.status === 'ACTIVE').length,
    AT_RISK: projects.filter(p => p.status === 'AT_RISK').length,
    ON_HOLD: projects.filter(p => p.status === 'ON_HOLD').length,
    COMPLETED: projects.filter(p => p.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/60 text-blue-300 border border-blue-800/40 uppercase tracking-wider">
              Executive Overview
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-time Telemetry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1">
            Global Operations Command
          </h1>
        </div>

        {canCreateProjects() && (
          <button
            onClick={() => setCreateProjectOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all w-fit"
          >
            <Plus size={15} />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Link
          to="/projects"
          className="p-5 rounded-2xl bg-[#151c28] border border-[#232f44] hover:border-blue-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Projects</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
              <FolderKanban size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-100 font-mono mt-3">{totalProjects}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
            <span>{healthCounts.ACTIVE} on track</span>
            <span>•</span>
            <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center">
              View all <ArrowUpRight size={12} />
            </span>
          </div>
        </Link>

        {/* Total Tasks */}
        <Link
          to="/tasks"
          className="p-5 rounded-2xl bg-[#151c28] border border-[#232f44] hover:border-blue-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
              <CheckSquare size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-100 font-mono mt-3">{totalTasks}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
            <span>{statusCounts.DONE} completed</span>
            <span>•</span>
            <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center">
              Task board <ArrowUpRight size={12} />
            </span>
          </div>
        </Link>

        {/* Overdue Tasks */}
        <Link
          to="/tasks?dateRange=OVERDUE"
          className="p-5 rounded-2xl bg-[#151c28] border border-rose-900/40 hover:border-rose-700/60 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300">Overdue Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono mt-3">{overdueTasks.length}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-rose-300/80 mt-2">
            <span>Requires urgent triage</span>
            <span className="group-hover:translate-x-0.5 transition-transform flex items-center">
              Filter list <ArrowUpRight size={12} />
            </span>
          </div>
        </Link>

        {/* Active Users */}
        <Link
          to="/team"
          className="p-5 rounded-2xl bg-[#151c28] border border-[#232f44] hover:border-blue-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Presence</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <Users size={16} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="text-3xl font-black text-slate-100 font-mono">{activeUsersCount}</div>
            <span className="text-xs font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/50">
              ● Live
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
            <span>WebSocket active</span>
            <span>•</span>
            <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center">
              Team roster <ArrowUpRight size={12} />
            </span>
          </div>
        </Link>
      </div>

      {/* Distributions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100">Task Status Distribution</h2>
            <Link to="/tasks" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
              View catalog →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Todo', count: statusCounts.TODO, color: 'bg-slate-500', pct: Math.round((statusCounts.TODO / totalTasks) * 100) || 0 },
              { label: 'In Progress', count: statusCounts.IN_PROGRESS, color: 'bg-blue-500', pct: Math.round((statusCounts.IN_PROGRESS / totalTasks) * 100) || 0 },
              { label: 'In Review', count: statusCounts.IN_REVIEW, color: 'bg-purple-500', pct: Math.round((statusCounts.IN_REVIEW / totalTasks) * 100) || 0 },
              { label: 'Done', count: statusCounts.DONE, color: 'bg-emerald-500', pct: Math.round((statusCounts.DONE / totalTasks) * 100) || 0 },
            ].map(s => (
              <div key={s.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{s.label}</span>
                  <span className="font-mono text-slate-400">
                    {s.count} ({s.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1e283b] overflow-hidden">
                  <div className={`h-full rounded-full ${s.color} transition-all duration-500`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Health Distribution */}
        <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100">Project Health Distribution</h2>
            <Link to="/projects" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
              Manage projects →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[#192334] border border-emerald-900/40">
              <span className="text-xs font-semibold text-emerald-400">On Track</span>
              <div className="text-2xl font-black text-slate-100 font-mono mt-1">{healthCounts.ACTIVE}</div>
              <p className="text-[11px] text-slate-400 mt-1">Normal velocity</p>
            </div>

            <div className="p-4 rounded-xl bg-[#192334] border border-rose-900/40">
              <span className="text-xs font-semibold text-rose-400">At Risk</span>
              <div className="text-2xl font-black text-rose-400 font-mono mt-1">{healthCounts.AT_RISK}</div>
              <p className="text-[11px] text-slate-400 mt-1">Due date pressure</p>
            </div>

            <div className="p-4 rounded-xl bg-[#192334] border border-amber-900/40">
              <span className="text-xs font-semibold text-amber-400">On Hold</span>
              <div className="text-2xl font-black text-slate-100 font-mono mt-1">{healthCounts.ON_HOLD}</div>
              <p className="text-[11px] text-slate-400 mt-1">Client awaiting feedback</p>
            </div>

            <div className="p-4 rounded-xl bg-[#192334] border border-blue-900/40">
              <span className="text-xs font-semibold text-blue-400">Completed</span>
              <div className="text-2xl font-black text-slate-100 font-mono mt-1">{healthCounts.COMPLETED}</div>
              <p className="text-[11px] text-slate-400 mt-1">Successfully delivered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Real-Time Activity & Online Team Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Global Activity Feed */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-blue-400" />
              <h2 className="text-sm font-bold text-slate-100">Global Activity Feed</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-[10px] font-bold border border-emerald-800/40">
                ● LIVE
              </span>
            </div>
            <Link to="/activity" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
              Audit log →
            </Link>
          </div>

          <div className="space-y-3 divide-y divide-[#1e283b]">
            {activities.slice(0, 5).map(act => {
              const actor = users.find(u => u.id === act.actorId);
              return (
                <div key={act.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#1b2537] border border-[#273752] text-slate-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {actor?.avatar || actor?.name.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-slate-200 font-medium leading-relaxed">{act.message}</p>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{actor?.name || 'System'}</span>
                        <span>•</span>
                        <span className="font-mono">
                          {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Online Team Roster */}
        <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100">Online Team Members</h2>
            <Link to="/team" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
              Directory →
            </Link>
          </div>

          <div className="space-y-2.5">
            {users.map(u => (
              <div
                key={u.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#192334] border border-[#233149] text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-blue-600/25 border border-blue-500/30 text-blue-300 font-bold text-xs flex items-center justify-center">
                      {u.avatar || u.name.charAt(0)}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#141b27] ${
                        u.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{u.name}</div>
                    <div className="text-[10px] text-slate-400">{u.role.replace('_', ' ')}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-mono ${u.isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {u.isOnline ? 'Connected' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {createProjectOpen && (
        <CreateProjectModal onClose={() => setCreateProjectOpen(false)} />
      )}
    </div>
  );
};
