import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  AlertTriangle,
  Clock,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectHealthBadge, StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { CreateProjectModal } from '../../components/projects/CreateProjectModal';
import { CreateTaskModal } from '../../components/tasks/CreateTaskModal';

export const PMDashboardPage: React.FC = () => {
  const {
    currentUser,
    projects,
    tasks,
    clients,
    users,
    getAccessibleProjects,
    getAccessibleTasks,
    getAccessibleActivities,
  } = useApp();
  const navigate = useNavigate();

  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const pmProjects = getAccessibleProjects();
  const pmTasks = getAccessibleTasks();
  const pmActivities = getAccessibleActivities();

  const activeTasks = pmTasks.filter(t => t.status !== 'DONE');
  const highPriorityTasks = pmTasks.filter(
    t => (t.priority === 'HIGH' || t.priority === 'CRITICAL') && t.status !== 'DONE'
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const dueThisWeekTasks = pmTasks.filter(
    t => t.status !== 'DONE' && t.dueDate >= todayStr && t.dueDate <= nextWeekStr
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/60 text-blue-300 border border-blue-800/40 uppercase tracking-wider">
              Project Manager Cockpit
            </span>
            <span className="text-xs text-slate-400">Scoped to your managed portfolios</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1">
            Welcome, {currentUser?.name}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCreateTaskOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1d273a] hover:bg-[#253249] text-slate-200 text-xs font-semibold border border-[#27364e] transition-colors"
          >
            <Plus size={14} />
            <span>Create Task</span>
          </button>

          <button
            onClick={() => setCreateProjectOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all"
          >
            <Plus size={14} />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#151c28] border border-[#232f44]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">My Projects</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
              <FolderKanban size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-100 font-mono mt-3">{pmProjects.length}</div>
          <div className="text-[11px] text-slate-400 mt-2">Active portfolios under your lead</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151c28] border border-[#232f44]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
              <CheckSquare size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-100 font-mono mt-3">{activeTasks.length}</div>
          <div className="text-[11px] text-slate-400 mt-2">
            {pmTasks.filter(t => t.status === 'IN_REVIEW').length} awaiting your review
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151c28] border border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">High / Critical Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono mt-3">{highPriorityTasks.length}</div>
          <div className="text-[11px] text-amber-300/80 mt-2">High urgency backlog</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151c28] border border-[#232f44]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Due This Week</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-100 font-mono mt-3">{dueThisWeekTasks.length}</div>
          <div className="text-[11px] text-slate-400 mt-2">Expiring sprint milestones</div>
        </div>
      </div>

      {/* Managed Projects Table */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-100">Managed Projects Portfolio</h2>
            <p className="text-xs text-slate-400 mt-0.5">Track deliverables, client status, and sprint progression</p>
          </div>
          <Link to="/projects" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
            All projects →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#232f44] text-slate-400 font-semibold">
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Progress</th>
                <th className="py-3 px-3">Health</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e283b]">
              {pmProjects.map(proj => {
                const client = clients.find(c => c.id === proj.clientId);
                const projTasks = tasks.filter(t => t.projectId === proj.id);
                const doneTasks = projTasks.filter(t => t.status === 'DONE').length;
                const progressPct = projTasks.length > 0 ? Math.round((doneTasks / projTasks.length) * 100) : 0;

                return (
                  <tr key={proj.id} className="hover:bg-[#182130] transition-colors group">
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200">{proj.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{proj.description}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">{client?.company || 'N/A'}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-300">{proj.dueDate}</td>
                    <td className="py-3.5 px-3">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>{progressPct}%</span>
                          <span>
                            {doneTasks}/{projTasks.length} tasks
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#202b3d] overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <ProjectHealthBadge status={proj.status} />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => navigate(`/projects/${proj.id}`)}
                        className="px-2.5 py-1 rounded-lg bg-[#202c40] hover:bg-blue-600 text-slate-300 hover:text-white font-medium transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Deadlines & Project-Scoped Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-amber-400" />
              <h2 className="text-sm font-bold text-slate-100">Upcoming Task Deadlines</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">{dueThisWeekTasks.length} due</span>
          </div>

          <div className="space-y-2.5">
            {dueThisWeekTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No imminent deadlines this week.</div>
            ) : (
              dueThisWeekTasks.slice(0, 5).map(task => {
                const dev = users.find(u => u.id === task.assignedDeveloperId);
                return (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="p-3 rounded-xl bg-[#192334] border border-[#233149] hover:border-blue-500/40 cursor-pointer transition-all flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{task.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Assigned to: <span className="text-slate-300">{dev?.name || 'Unassigned'}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="font-mono text-amber-400 font-semibold">{task.dueDate}</span>
                      <div>
                        <PriorityBadge priority={task.priority} size="sm" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Project-Scoped Activity */}
        <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-blue-400" />
              <h2 className="text-sm font-bold text-slate-100">Portfolio Activity</h2>
            </div>
            <Link to="/activity" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
              Audit log →
            </Link>
          </div>

          <div className="space-y-3 divide-y divide-[#1e283b]">
            {pmActivities.slice(0, 5).map(act => {
              const actor = users.find(u => u.id === act.actorId);
              return (
                <div key={act.id} className="pt-3 first:pt-0 text-xs">
                  <p className="text-slate-200 font-medium">{act.message}</p>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                    <span>{actor?.name || 'System'}</span>
                    <span>•</span>
                    <span className="font-mono">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {createProjectOpen && <CreateProjectModal onClose={() => setCreateProjectOpen(false)} />}
      {createTaskOpen && <CreateTaskModal onClose={() => setCreateTaskOpen(false)} />}
    </div>
  );
};
