import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  RotateCcw,
  Calendar,
  User,
  FolderKanban,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { parseTaskFilters, serializeTaskFilters } from '../../utils/taskFilters';
import { TaskDrawer } from '../../components/tasks/TaskDrawer';
import { CreateTaskModal } from '../../components/tasks/CreateTaskModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TaskStatus, Priority } from '../../types';

export const TasksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    getAccessibleTasks,
    getAccessibleProjects,
    users,
    canEditTask,
    updateTaskStatus,
    currentUser,
    canCreateProjects,
  } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedDrawerTaskId, setSelectedDrawerTaskId] = useState<string | null>(null);

  // Parse filters from URL search params
  const filters = useMemo(() => parseTaskFilters(searchParams), [searchParams]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const combined = { ...filters, ...newFilters };
    const serialized = serializeTaskFilters(combined);
    setSearchParams(serialized);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const accessibleTasks = getAccessibleTasks();
  const accessibleProjects = getAccessibleProjects();
  const developers = users.filter(u => u.role === 'DEVELOPER');

  // Filter tasks based on URL parameters
  const filteredTasks = useMemo(() => {
    return accessibleTasks.filter(task => {
      // Status filter
      if (filters.status && filters.status !== 'ALL' && task.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority && filters.priority !== 'ALL' && task.priority !== filters.priority) {
        return false;
      }

      // Project filter
      if (filters.projectId && filters.projectId !== 'ALL' && task.projectId !== filters.projectId) {
        return false;
      }

      // Assigned Developer filter
      if (
        filters.assignedDeveloperId &&
        filters.assignedDeveloperId !== 'ALL' &&
        task.assignedDeveloperId !== filters.assignedDeveloperId
      ) {
        return false;
      }

      // Search query filter (title or description)
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Date Range filter
      const todayStr = new Date().toISOString().split('T')[0];
      if (filters.dateRange === 'OVERDUE') {
        const isOverdue = task.status !== 'DONE' && task.dueDate < todayStr;
        if (!isOverdue) return false;
      } else if (filters.dateRange === 'DUE_TODAY') {
        if (task.dueDate !== todayStr) return false;
      } else if (filters.dateRange === 'DUE_THIS_WEEK') {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];
        if (task.dueDate < todayStr || task.dueDate > nextWeekStr) return false;
      }

      // Custom from/to date
      if (filters.from && task.dueDate < filters.from) return false;
      if (filters.to && task.dueDate > filters.to) return false;

      return true;
    });
  }, [accessibleTasks, filters]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>, taskId: string) => {
    updateTaskStatus(taskId, e.target.value as TaskStatus);
  };

  const isFiltered =
    filters.status !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.projectId !== 'ALL' ||
    filters.assignedDeveloperId !== 'ALL' ||
    Boolean(filters.searchQuery) ||
    filters.dateRange !== 'ALL' ||
    Boolean(filters.from) ||
    Boolean(filters.to);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Task Tracking Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            URL-synchronized task filtering, sprint prioritization, and RBAC management
          </p>
        </div>

        {currentUser?.role !== 'DEVELOPER' && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all w-fit"
          >
            <Plus size={15} />
            <span>Create Task</span>
          </button>
        )}
      </div>

      {/* Advanced URL Filter Bar */}
      <div className="p-5 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={filters.searchQuery || ''}
              onChange={e => updateFilters({ searchQuery: e.target.value })}
              placeholder="Filter by keyword or title..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-[#192334] border border-[#27364f] text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202c40] hover:bg-[#2a3a54] text-slate-300 text-xs font-medium transition-colors"
              >
                <RotateCcw size={13} />
                <span>Reset Filters</span>
              </button>
            )}
            <span className="text-xs font-mono text-slate-400">
              Showing {filteredTasks.length} of {accessibleTasks.length} tasks
            </span>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-[#1f2b3e] text-xs">
          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Status</label>
            <select
              value={filters.status || 'ALL'}
              onChange={e => updateFilters({ status: e.target.value as any })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#192334] border border-[#27364f] text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Priority</label>
            <select
              value={filters.priority || 'ALL'}
              onChange={e => updateFilters({ priority: e.target.value as any })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#192334] border border-[#27364f] text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Project filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Project</label>
            <select
              value={filters.projectId || 'ALL'}
              onChange={e => updateFilters({ projectId: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#192334] border border-[#27364f] text-slate-200 focus:outline-none focus:border-blue-500 truncate"
            >
              <option value="ALL">All Projects</option>
              {accessibleProjects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Developer filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Assignee</label>
            <select
              value={filters.assignedDeveloperId || 'ALL'}
              onChange={e => updateFilters({ assignedDeveloperId: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#192334] border border-[#27364f] text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Assignees</option>
              {developers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date range filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Due Window</label>
            <select
              value={filters.dateRange || 'ALL'}
              onChange={e => updateFilters({ dateRange: e.target.value as any })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#192334] border border-[#27364f] text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Any Time</option>
              <option value="OVERDUE">Overdue</option>
              <option value="DUE_TODAY">Due Today</option>
              <option value="DUE_THIS_WEEK">Due This Week</option>
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Due Before</label>
            <input
              type="date"
              value={filters.to || ''}
              onChange={e => updateFilters({ to: e.target.value || undefined })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#192334] border border-[#27364f] text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Task Catalog Table */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] overflow-x-auto">
        {filteredTasks.length === 0 ? (
          <EmptyState
            title="No tasks match your criteria"
            description="Try relaxing your status, priority, or date filters to see more tasks."
            action={
              isFiltered ? (
                <button
                  onClick={resetFilters}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                >
                  Clear All Filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#232f44] text-slate-400 font-semibold">
                <th className="py-3 px-3">Task Details</th>
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Assignee</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e283b]">
              {filteredTasks.map(task => {
                const proj = accessibleProjects.find(p => p.id === task.projectId);
                const dev = users.find(u => u.id === task.assignedDeveloperId);
                const canEdit = canEditTask(task.id);

                return (
                  <tr key={task.id} className="hover:bg-[#182130] transition-colors group">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDrawerTaskId(task.id)}
                          className="font-semibold text-slate-200 hover:text-blue-400 transition-colors text-left"
                        >
                          {task.title}
                        </button>
                        {task.isOverdue && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40">
                            Overdue
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                        {task.description}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300 font-medium">
                      <Link
                        to={`/projects/${task.projectId}`}
                        className="hover:text-blue-400 transition-colors"
                      >
                        {proj?.name || 'Project'}
                      </Link>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-blue-600/25 text-blue-300 font-bold text-[10px] flex items-center justify-center">
                          {dev?.avatar || dev?.name.charAt(0) || 'U'}
                        </div>
                        <span>{dev?.name || 'Unassigned'}</span>
                      </div>
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

      {/* Task Drawer */}
      <TaskDrawer
        taskId={selectedDrawerTaskId}
        onClose={() => setSelectedDrawerTaskId(null)}
      />

      {createModalOpen && <CreateTaskModal onClose={() => setCreateModalOpen(false)} />}
    </div>
  );
};
