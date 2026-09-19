import React, { useState } from 'react';
import { X, Plus, FolderKanban } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectStatus } from '../../types';

interface CreateProjectModalProps {
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
  const { clients, currentUser, createProject } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [budget, setBudget] = useState('$50,000');
  const [status, setStatus] = useState<ProjectStatus>('ACTIVE');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!dueDate) {
      setError('Target due date is required.');
      return;
    }
    if (!clientId) {
      setError('Please select a client.');
      return;
    }

    const res = createProject({
      name: name.trim(),
      description: description.trim(),
      clientId,
      createdById: currentUser?.id || 'usr-1',
      dueDate,
      status,
      budget,
    });

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to create project.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#151c28] border border-[#26354f] p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#232f44] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
              <FolderKanban size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-100">Create New Project</h3>
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
            <label className="block text-slate-300 font-semibold mb-1">Project Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Enterprise Cloud Portal Migration"
              className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="High-level milestones, client scope, and core delivery specifications..."
              className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Client Organization</label>
              <select
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.name})
                  </option>
                ))}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Initial Health</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="ACTIVE">Active (On Track)</option>
                <option value="AT_RISK">At Risk</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Budget Allocation</label>
              <input
                type="text"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder="e.g. $75,000"
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
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
