import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FolderKanban,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectHealthBadge } from '../../components/common/StatusBadge';
import { CreateProjectModal } from '../../components/projects/CreateProjectModal';

export const ClientDetailsPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const { clients, projects, tasks, canCreateProjects } = useApp();
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  const client = clients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Client Not Found</h2>
        <button
          onClick={() => navigate('/clients')}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Return to Clients
        </button>
      </div>
    );
  }

  const clientProjects = projects.filter(p => p.clientId === client.id);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/clients')}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Clients Directory</span>
      </button>

      {/* Client Profile Card */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400 font-bold text-xl shadow-inner">
            {client.company.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">{client.company}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">{client.name}</span>
              <div className="flex items-center gap-1.5">
                <Mail size={13} className="text-slate-500" />
                <span>{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone size={13} className="text-slate-500" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-500" />
                  <span>{client.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {canCreateProjects() && (
          <button
            onClick={() => setCreateProjectOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all w-fit"
          >
            <Plus size={15} />
            <span>Launch Project</span>
          </button>
        )}
      </div>

      {/* Associated Projects Section */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-100">Client Projects Portfolio</h2>
          <span className="text-xs font-mono text-slate-400">{clientProjects.length} projects</span>
        </div>

        {clientProjects.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No projects registered for this client yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#232f44] text-slate-400 font-semibold">
                  <th className="py-3 px-3">Project Title</th>
                  <th className="py-3 px-3">Target Due</th>
                  <th className="py-3 px-3">Health Status</th>
                  <th className="py-3 px-3">Progress</th>
                  <th className="py-3 px-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e283b]">
                {clientProjects.map(proj => {
                  const projTasks = tasks.filter(t => t.projectId === proj.id);
                  const doneTasks = projTasks.filter(t => t.status === 'DONE').length;
                  const progressPct = projTasks.length > 0 ? Math.round((doneTasks / projTasks.length) * 100) : 0;

                  return (
                    <tr key={proj.id} className="hover:bg-[#182130] transition-colors">
                      <td className="py-3.5 px-3">
                        <Link
                          to={`/projects/${proj.id}`}
                          className="font-semibold text-slate-200 hover:text-blue-400 transition-colors"
                        >
                          {proj.name}
                        </Link>
                        <div className="text-[11px] text-slate-400 truncate max-w-sm">
                          {proj.description}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">{proj.dueDate}</td>
                      <td className="py-3.5 px-3">
                        <ProjectHealthBadge status={proj.status} />
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>{progressPct}%</span>
                            <span>{doneTasks}/{projTasks.length}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#1e283b] overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progressPct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link
                          to={`/projects/${proj.id}`}
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          <span>Open</span>
                          <ArrowUpRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {createProjectOpen && <CreateProjectModal onClose={() => setCreateProjectOpen(false)} />}
    </div>
  );
};
