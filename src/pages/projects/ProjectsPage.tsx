import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Search,
  Plus,
  Calendar,
  Building2,
  Users,
  CheckSquare,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectHealthBadge } from '../../components/common/StatusBadge';
import { CreateProjectModal } from '../../components/projects/CreateProjectModal';
import { EmptyState } from '../../components/common/EmptyState';

export const ProjectsPage: React.FC = () => {
  const {
    getAccessibleProjects,
    clients,
    tasks,
    users,
    canCreateProjects,
  } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const projects = getAccessibleProjects();

  const filteredProjects = projects.filter(p => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const client = clients.find(c => c.id === p.clientId);
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        client?.company.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Project Portfolios</h1>
          <p className="text-xs text-slate-400 mt-1">
            Deliverable tracks, milestones, and client accounts
          </p>
        </div>

        {canCreateProjects() && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all w-fit"
          >
            <Plus size={15} />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#151c28] border border-[#232f44] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects or clients..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-[#192334] border border-[#27364f] text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Health status pill filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Projects' },
            { id: 'ACTIVE', label: 'On Track' },
            { id: 'AT_RISK', label: 'At Risk' },
            { id: 'ON_HOLD', label: 'On Hold' },
            { id: 'COMPLETED', label: 'Completed' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1b2537]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl bg-[#151c28] border border-[#232f44]">
          <EmptyState
            title="No projects found"
            description="No active projects match your search criteria or permission scope."
            action={
              canCreateProjects() ? (
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  Create First Project
                </button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(project => {
            const client = clients.find(c => c.id === project.clientId);
            const creator = users.find(u => u.id === project.createdById);
            const projTasks = tasks.filter(t => t.projectId === project.id);
            const doneTasks = projTasks.filter(t => t.status === 'DONE').length;
            const progress = projTasks.length > 0 ? Math.round((doneTasks / projTasks.length) * 100) : 0;

            return (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="p-5 rounded-2xl bg-[#151c28] border border-[#232f44] hover:border-blue-500/50 cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold text-blue-400 font-mono">
                      {client?.company || 'Enterprise Client'}
                    </span>
                    <ProjectHealthBadge status={project.status} />
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors mt-2">
                    {project.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="mt-5 space-y-3 pt-4 border-t border-[#1f2a3c]">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Delivery Progress</span>
                      <span className="text-slate-200 font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#1f2b3e] overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5" title="Lead Manager">
                      <Users size={13} className="text-slate-500" />
                      <span className="truncate max-w-[110px]">{creator?.name || 'Admin'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono" title="Due Date">
                      <Calendar size={13} className="text-slate-500" />
                      <span>{project.dueDate}</span>
                    </div>

                    <div className="flex items-center gap-1 font-mono" title="Tasks count">
                      <CheckSquare size={13} className="text-slate-500" />
                      <span>{projTasks.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {createModalOpen && <CreateProjectModal onClose={() => setCreateModalOpen(false)} />}
    </div>
  );
};
