import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  User,
  FolderKanban,
  Clock,
  CheckSquare,
  Shield,
  Activity,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { UnauthorizedPage } from '../errors/UnauthorizedPage';
import { TaskStatus } from '../../types';

export const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const {
    tasks,
    projects,
    users,
    activities,
    currentUser,
    canEditTask,
    updateTaskStatus,
    deleteTask,
  } = useApp();

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Task Not Found</h2>
        <p className="text-xs text-slate-400">The requested task does not exist or was deleted.</p>
        <button
          onClick={() => navigate('/tasks')}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Return to Tasks
        </button>
      </div>
    );
  }

  // RBAC Access Check
  if (currentUser?.role === 'DEVELOPER' && task.assignedDeveloperId !== currentUser.id) {
    return <UnauthorizedPage />;
  }

  const project = projects.find(p => p.id === task.projectId);
  if (currentUser?.role === 'PROJECT_MANAGER' && project?.createdById !== currentUser.id) {
    return <UnauthorizedPage />;
  }

  const assignee = users.find(u => u.id === task.assignedDeveloperId);
  const taskActivities = activities.filter(a => a.taskId === task.id);
  const canEdit = canEditTask(task.id);
  const canDelete =
    currentUser?.role === 'ADMIN' ||
    (currentUser?.role === 'PROJECT_MANAGER' && project?.createdById === currentUser.id);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTaskStatus(task.id, e.target.value as TaskStatus);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
      navigate('/tasks');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back</span>
      </button>

      {/* Main Task Card */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
              {task.isOverdue && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40">
                  Overdue
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black text-slate-100 tracking-tight">{task.title}</h1>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Belongs to project:</span>
              <Link
                to={`/projects/${task.projectId}`}
                className="text-blue-400 hover:underline font-semibold"
              >
                {project?.name || 'Project'}
              </Link>
            </div>
          </div>

          {canDelete && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 text-xs font-semibold transition-colors"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          )}
        </div>

        {/* Status Transition Control */}
        <div className="p-4 rounded-xl bg-[#182130] border border-[#243147] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-200">Task Status Workflow</span>
            <p className="text-[11px] text-slate-400">
              {canEdit
                ? 'Update sprint delivery stage with instant team notification'
                : 'Status transitions are restricted to assigned developers or project managers'}
            </p>
          </div>

          {canEdit ? (
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="px-3 py-2 rounded-lg bg-[#141b26] border border-[#2b3a52] text-xs text-slate-100 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
          ) : (
            <div className="text-xs font-semibold text-slate-400 px-3 py-1.5 bg-[#141b26] rounded-lg border border-[#232f44]">
              {task.status.replace('_', ' ')} (Read-only)
            </div>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#182130] border border-[#243147] text-xs">
          <div>
            <span className="text-slate-500 text-[11px] block">Assignee</span>
            <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-200">
              <User size={13} className="text-blue-400" />
              <span>{assignee?.name || 'Unassigned'}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 text-[11px] block">Target Due Date</span>
            <div
              className={`flex items-center gap-1.5 mt-1 font-mono font-semibold ${
                task.isOverdue ? 'text-rose-400' : 'text-slate-200'
              }`}
            >
              <Calendar size={13} />
              <span>{task.dueDate}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 text-[11px] block">Created Date</span>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-slate-400">
              <Clock size={13} />
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 text-[11px] block">Last Updated</span>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-slate-400">
              <Clock size={13} />
              <span>{new Date(task.updatedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Scope & Specifications
          </h3>
          <div className="p-4 rounded-xl bg-[#192334] border border-[#273752] text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {task.description || 'No detailed specifications provided.'}
          </div>
        </div>

        {/* Task Audit History */}
        <div className="space-y-3 pt-4 border-t border-[#1f2b3e]">
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-blue-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Task Audit History
            </h3>
          </div>

          {taskActivities.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">No activity recorded for this task.</div>
          ) : (
            <div className="space-y-2 divide-y divide-[#1e283b]">
              {taskActivities.map(act => {
                const actor = users.find(u => u.id === act.actorId);
                return (
                  <div key={act.id} className="pt-2 first:pt-0 text-xs">
                    <p className="text-slate-200 font-medium">{act.message}</p>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{actor?.name || 'System'}</span>
                      <span>•</span>
                      <span className="font-mono">{new Date(act.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
