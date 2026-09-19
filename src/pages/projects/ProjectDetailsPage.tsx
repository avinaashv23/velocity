import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Plus,
  Edit,
  CheckSquare,
  Activity,
  AlertCircle,
  FileText,
  Clock,
  Shield,
  Circle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectHealthBadge, StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { EditProjectModal } from '../../components/projects/EditProjectModal';
import { CreateTaskModal } from '../../components/tasks/CreateTaskModal';
import { TaskStatus, Task } from '../../types';
import { UnauthorizedPage } from '../errors/UnauthorizedPage';

export const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const {
    projects,
    clients,
    tasks,
    users,
    activities,
    currentUser,
    canManageProject,
    canEditTask,
    updateTaskStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'activity'>('overview');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('ALL');

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Project Not Found</h2>
        <p className="text-xs text-slate-400">The requested project ID does not exist.</p>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  // RBAC Access validation
  if (currentUser?.role === 'PROJECT_MANAGER' && project.createdById !== currentUser.id) {
    return <UnauthorizedPage />;
  }

  const projTasks = tasks.filter(t => t.projectId === project.id);
  if (currentUser?.role === 'DEVELOPER') {
    const hasAssignedTask = projTasks.some(t => t.assignedDeveloperId === currentUser.id);
    if (!hasAssignedTask) {
      return <UnauthorizedPage />;
    }
  }

  const client = clients.find(c => c.id === project.clientId);
  const leadManager = users.find(u => u.id === project.createdById);
  const projectActivities = activities.filter(a => a.projectId === project.id);

  const doneTasks = projTasks.filter(t => t.status === 'DONE').length;
  const progressPct = projTasks.length > 0 ? Math.round((doneTasks / projTasks.length) * 100) : 0;

  // Status counts
  const statusCounts = {
    TODO: projTasks.filter(t => t.status === 'TODO').length,
    IN_PROGRESS: projTasks.filter(t => t.status === 'IN_PROGRESS').length,
    IN_REVIEW: projTasks.filter(t => t.status === 'IN_REVIEW').length,
    DONE: projTasks.filter(t => t.status === 'DONE').length,
  };

  // Distinct assigned developers
  const devIds = Array.from(new Set(projTasks.map(t => t.assignedDeveloperId).filter(Boolean)));
  const assignedTeam = users.filter(u => devIds.includes(u.id));

  // Filtered tasks for task tab
  const filteredTasks = projTasks.filter(t => {
    if (taskStatusFilter !== 'ALL' && t.status !== taskStatusFilter) return false;
    return true;
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>, taskId: string) => {
    updateTaskStatus(taskId, e.target.value as TaskStatus);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Projects Directory</span>
        </button>
      </div>

      {/* Project Header Card */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-400 font-mono">
                {client?.company || 'Enterprise Client'}
              </span>
              <span>•</span>
              <ProjectHealthBadge status={project.status} />
            </div>

            <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1">
              {project.name}
            </h1>

            <p className="text-xs text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canManageProject(project.id) && (
              <>
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1d273a] hover:bg-[#25334c] text-slate-300 text-xs font-semibold border border-[#2a3850] transition-colors"
                >
                  <Edit size={13} />
                  <span>Edit Project</span>
                </button>

                <button
                  onClick={() => setCreateTaskOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all"
                >
                  <Plus size={14} />
                  <span>Add Task</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Project Meta Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#1f2b3e] text-xs">
          <div>
            <span className="text-slate-500 text-[11px] block">Lead Manager</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">{leadManager?.name || 'Admin'}</span>
          </div>

          <div>
            <span className="text-slate-500 text-[11px] block">Target Due Date</span>
            <span className="font-mono text-slate-200 font-semibold mt-0.5 block">{project.dueDate}</span>
          </div>

          <div>
            <span className="text-slate-500 text-[11px] block">Budget Allocation</span>
            <span className="font-mono text-slate-200 font-semibold mt-0.5 block">
              {project.budget || '$50,000'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[11px] block">Tasks Completion</span>
            <span className="font-mono text-blue-400 font-bold mt-0.5 block">
              {progressPct}% ({doneTasks}/{projTasks.length})
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#232f44] pb-1">
        {[
          { id: 'overview', label: 'Overview & Analytics', icon: FileText },
          { id: 'tasks', label: `Project Tasks (${projTasks.length})`, icon: CheckSquare },
          { id: 'activity', label: `Activity Feed (${projectActivities.length})`, icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-[#161e2c]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#141b27]'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Status Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#151c28] border border-[#232f44]">
              <span className="text-xs text-slate-400 font-medium">Todo</span>
              <div className="text-2xl font-black text-slate-100 font-mono mt-1">{statusCounts.TODO}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#151c28] border border-[#232f44]">
              <span className="text-xs text-blue-400 font-medium">In Progress</span>
              <div className="text-2xl font-black text-blue-400 font-mono mt-1">{statusCounts.IN_PROGRESS}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#151c28] border border-[#232f44]">
              <span className="text-xs text-purple-400 font-medium">In Review</span>
              <div className="text-2xl font-black text-purple-400 font-mono mt-1">{statusCounts.IN_REVIEW}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#151c28] border border-[#232f44]">
              <span className="text-xs text-emerald-400 font-medium">Done</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{statusCounts.DONE}</div>
            </div>
          </div>

          {/* Assigned Team Roster */}
          <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Assigned Team Members</h3>

            {assignedTeam.length === 0 ? (
              <div className="text-xs text-slate-400 py-4">No team members assigned to tasks yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {assignedTeam.map(u => {
                  const userTasks = projTasks.filter(t => t.assignedDeveloperId === u.id);
                  return (
                    <div
                      key={u.id}
                      className="p-3 rounded-xl bg-[#192334] border border-[#243147] flex items-center gap-3 text-xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-600/25 border border-blue-500/30 text-blue-300 font-bold flex items-center justify-center flex-shrink-0">
                        {u.avatar || u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{userTasks.length} tasks assigned</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Project Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['ALL', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map(st => (
                <button
                  key={st}
                  onClick={() => setTaskStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    taskStatusFilter === st
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-[#192334] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            {canManageProject(project.id) && (
              <button
                onClick={() => setCreateTaskOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                <Plus size={13} />
                <span>New Task</span>
              </button>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] overflow-x-auto">
            {filteredTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No tasks match the selected filter.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#232f44] text-slate-400 font-semibold">
                    <th className="py-3 px-3">Task</th>
                    <th className="py-3 px-3">Assignee</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Due Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Transition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e283b]">
                  {filteredTasks.map(task => {
                    const dev = users.find(u => u.id === task.assignedDeveloperId);
                    const canEdit = canEditTask(task.id);

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
                          {dev?.name || 'Unassigned'}
                        </td>
                        <td className="py-3.5 px-3">
                          <PriorityBadge priority={task.priority} size="sm" />
                        </td>
                        <td className="py-3.5 px-3 font-mono text-slate-300">{task.dueDate}</td>
                        <td className="py-3.5 px-3">
                          <StatusBadge status={task.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          {canEdit ? (
                            <select
                              value={task.status}
                              onChange={e => handleStatusChange(e, task.id)}
                              className="px-2 py-1 rounded-lg bg-[#1e283b] border border-[#2b3a52] text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              <option value="TODO">Todo</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="IN_REVIEW">In Review</option>
                              <option value="DONE">Done</option>
                            </select>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">Read-only</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Project Activity */}
      {activeTab === 'activity' && (
        <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Real-Time Project Activity</h3>

          {projectActivities.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No activity recorded for this project yet.</div>
          ) : (
            <div className="space-y-3 divide-y divide-[#1e283b]">
              {projectActivities.map(act => {
                const actor = users.find(u => u.id === act.actorId);
                return (
                  <div key={act.id} className="pt-3 first:pt-0 text-xs">
                    <p className="text-slate-200 font-medium">{act.message}</p>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
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
      )}

      {editModalOpen && <EditProjectModal project={project} onClose={() => setEditModalOpen(false)} />}
      {createTaskOpen && (
        <CreateTaskModal defaultProjectId={project.id} onClose={() => setCreateTaskOpen(false)} />
      )}
    </div>
  );
};
