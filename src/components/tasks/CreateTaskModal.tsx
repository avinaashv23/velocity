import React, { useState } from 'react';
import { X, CheckSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Priority, TaskStatus } from '../../types';

interface CreateTaskModalProps {
  defaultProjectId?: string;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ defaultProjectId, onClose }) => {
  const { getAccessibleProjects, users, createTask } = useApp();

  const accessibleProjects = getAccessibleProjects();
  const developers = users.filter(u => u.role === 'DEVELOPER');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || accessibleProjects[0]?.id || '');
  const [assignedDeveloperId, setAssignedDeveloperId] = useState(developers[0]?.id || '');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (!projectId) {
      setError('Please select a project.');
      return;
    }
    if (!dueDate) {
      setError('Target due date is required.');
      return;
    }

    const res = createTask({
      title: title.trim(),
      description: description.trim(),
      projectId,
      assignedDeveloperId,
      priority,
      status,
      dueDate,
    });

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to create task.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#151c28] border border-[#26354f] p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#232f44] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
              <CheckSquare size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-100">Create Task</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e283b] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/50 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Implement OAuth 2.0 PKCE Callback Flow"
              className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description & Acceptance Criteria</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed functional requirements, edge cases, and testing scope..."
              className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Project</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500"
              >
                {accessibleProjects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assigned Developer</label>
              <select
                value={assignedDeveloperId}
                onChange={e => setAssignedDeveloperId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500"
              >
                {developers.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.department || 'Eng'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Initial Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#232f44] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#202c40] hover:bg-[#283750] text-slate-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/25 transition-all"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
