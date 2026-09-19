import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  X,
  Calendar,
  User,
  FolderKanban,
  Clock,
  CheckSquare,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { Task, TaskStatus } from '../../types';

interface TaskDrawerProps {
  taskId: string | null;
  onClose: () => void;
}

export const TaskDrawer: React.FC<TaskDrawerProps> = ({ taskId, onClose }) => {
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
  const navigate = useNavigate();

  if (!taskId) return null;

  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;

  const project = projects.find(p => p.id === task.projectId);
  const assignee = users.find(u => u.id === task.assignedDeveloperId);
  const taskActivities = activities.filter(a => a.taskId === task.id);
  const canEdit = canEditTask(task.id);
  const canDelete = currentUser?.role === 'ADMIN' || (currentUser?.role === 'PROJECT_MANAGER' && project?.createdById === currentUser.id);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTaskStatus(task.id, e.target.value as TaskStatus);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md h-full bg-[#151c28] border-l border-[#243147] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#232f44] flex items-center justify-between bg-[#131924]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-blue-400">
              {project?.name || 'Project Task'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/tasks/${task.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e283b] transition-colors"
              title="Open full page"
            >
              <ExternalLink size={15} />
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e283b] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Title & Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PriorityBadge priority={task.priority} size="sm" />
              <StatusBadge status={task.status} size="sm" />
              {task.isOverdue && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40">
                  Overdue
                </span>
              )}
            </div>

            <h2 className="text-lg font-black text-slate-100 leading-snug">{task.title}</h2>
          </div>

          {/* Quick Transition Selector */}
          <div className="p-3.5 rounded-xl bg-[#192334] border border-[#27364f] space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span>Task Status Workflow</span>
              {canEdit ? (
                <span className="text-[10px] text-blue-400">Editable</span>
              ) : (
                <span className="text-[10px] text-slate-500 italic">Read-only</span>
              )}
            </div>

            {canEdit ? (
              <select
                value={task.status}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 rounded-lg bg-[#141b26] border border-[#2b3a52] text-slate-100 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            ) : (
              <div className="p-2 rounded bg-[#131924] text-slate-400 text-xs">
                {task.status.replace('_', ' ')}
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#182130] border border-[#243147]">
            <div>
              <span className="text-slate-500 text-[11px] block">Assigned Developer</span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 font-bold text-[10px] flex items-center justify-center">
                  {assignee?.avatar || assignee?.name.charAt(0) || 'U'}
                </div>
                <span className="font-semibold text-slate-200 truncate">{assignee?.name || 'Unassigned'}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Due Date</span>
              <span className={`font-mono font-semibold mt-1 block ${task.isOverdue ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                {task.dueDate}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Created</span>
              <span className="font-mono text-slate-400 mt-1 block">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Last Updated</span>
              <span className="font-mono text-slate-400 mt-1 block">
                {new Date(task.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-slate-300 font-semibold">Description</h4>
            <p className="text-slate-300 leading-relaxed bg-[#182130] p-3.5 rounded-xl border border-[#243147] whitespace-pre-line">
              {task.description || 'No description provided.'}
            </p>
          </div>

          {/* Task Activity Timeline */}
          <div className="space-y-3">
            <h4 className="text-slate-300 font-semibold">Task Audit History</h4>
            {taskActivities.length === 0 ? (
              <div className="p-3 text-slate-500 text-center">No activity history for this task.</div>
            ) : (
              <div className="space-y-2 divide-y divide-[#1e283b]">
                {taskActivities.map(act => {
                  const actor = users.find(u => u.id === act.actorId);
                  return (
                    <div key={act.id} className="pt-2 first:pt-0">
                      <p className="text-slate-200 font-medium">{act.message}</p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(act.createdAt).toLocaleString()} by {actor?.name || 'System'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {canDelete && (
          <div className="p-4 border-t border-[#232f44] bg-[#131924] flex justify-between items-center">
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-colors"
            >
              <Trash2 size={14} />
              <span>Delete Task</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#202c40] text-slate-300 text-xs font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
