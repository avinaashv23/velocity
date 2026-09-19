import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Activity,
  FolderKanban,
  FileCode2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { TaskStatus } from '../../types';

export const DeveloperDashboardPage: React.FC = () => {
  const {
    currentUser,
    projects,
    tasks,
    updateTaskStatus,
    getAccessibleTasks,
    getAccessibleActivities,
  } = useApp();
  const navigate = useNavigate();

  const myTasks = getAccessibleTasks();
  const myActivities = getAccessibleActivities();

  // Sort tasks by Priority (CRITICAL -> HIGH -> MEDIUM -> LOW) then dueDate
  const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  const sortedTasks = [...myTasks].sort((a, b) => {
    const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (diff !== 0) return diff;
    return a.dueDate.localeCompare(b.dueDate);
  });

  const inProgressCount = myTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const inReviewCount = myTasks.filter(t => t.status === 'IN_REVIEW').length;
  const overdueCount = myTasks.filter(
    t => t.isOverdue || (t.status !== 'DONE' && t.dueDate < new Date().toISOString().split('T')[0])
  ).length;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>, taskId: string) => {
    const newStatus = e.target.value as TaskStatus;
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/60 text-blue-300 border border-blue-800/40 uppercase tracking-wider">
              Developer Workstation
            </span>
            <span className="text-xs text-slate-400">Strictly scoped to assigned tasks</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1">
            Hello, {currentUser?.name}
          </h1>
        </div>

        <Link
          to="/tasks"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all w-fit"
        >
          <CheckSquare size={15} />
          <span>View All My Tasks</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#151c28] border border-[#232f44]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Assigned Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
              <CheckSquare size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-100 font-mono mt-3">{myTasks.length}</div>
          <div className="text-[11px] text-slate-400 mt-2">Personal workload queue</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151c28] border border-[#232f44]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
              <Play size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-400 font-mono mt-3">{inProgressCount}</div>
          <div className="text-[11px] text-slate-400 mt-2">Currently being implemented</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151c28] border border-[#232f44]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">In Review</span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-400 font-mono mt-3">{inReviewCount}</div>
          <div className="text-[11px] text-slate-400 mt-2">Pending PM acceptance</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151c28] border border-rose-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300">Overdue</span>
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono mt-3">{overdueCount}</div>
          <div className="text-[11px] text-rose-300/80 mt-2">Past scheduled due date</div>
        </div>
      </div>

      {/* Developer Task Queue */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-100">My Priority Workload</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Sorted by critical priority then earliest due date
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{sortedTasks.length} total tasks</span>
        </div>

        {sortedTasks.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No tasks currently assigned to your queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#232f44] text-slate-400 font-semibold">
                  <th className="py-3 px-3">Task Details</th>
                  <th className="py-3 px-3">Project</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-3">Current Status</th>
                  <th className="py-3 px-3 text-right">Quick Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e283b]">
                {sortedTasks.map(task => {
                  const proj = projects.find(p => p.id === task.projectId);
                  return (
                    <tr key={task.id} className="hover:bg-[#182130] transition-colors">
                      <td className="py-3.5 px-3">
                        <Link
                          to={`/tasks/${task.id}`}
                          className="font-semibold text-slate-200 hover:text-blue-400 transition-colors"
                        >
                          {task.title}
                        </Link>
                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                          {task.description}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 font-medium">
                        {proj?.name || 'Unknown Project'}
                      </td>
                      <td className="py-3.5 px-3">
                        <PriorityBadge priority={task.priority} size="sm" />
                      </td>
                      <td className="py-3.5 px-3 font-mono">
                        <span className={task.isOverdue ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {task.dueDate}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={task.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <select
                          value={task.status}
                          onChange={e => handleStatusChange(e, task.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#1e283b] border border-[#2b3a52] text-xs text-slate-200 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="TODO">Todo</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="IN_REVIEW">In Review</option>
                          <option value="DONE">Done</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-blue-400" />
            <h2 className="text-sm font-bold text-slate-100">My Task Updates & Mentions</h2>
          </div>
          <Link to="/activity" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
            Full activity →
          </Link>
        </div>

        <div className="space-y-3 divide-y divide-[#1e283b]">
          {myActivities.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No recent activity logged for your tasks.
            </div>
          ) : (
            myActivities.slice(0, 5).map(act => (
              <div key={act.id} className="pt-3 first:pt-0 text-xs">
                <p className="text-slate-200 font-medium">{act.message}</p>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  {new Date(act.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
