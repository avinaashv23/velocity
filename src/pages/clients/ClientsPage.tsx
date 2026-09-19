import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  Plus,
  Mail,
  Phone,
  FolderKanban,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CreateClientModal } from '../../components/clients/CreateClientModal';
import { EmptyState } from '../../components/common/EmptyState';

export const ClientsPage: React.FC = () => {
  const { clients, projects, canManageClients } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const filteredClients = clients.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.company.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Client Accounts</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise partner directories, engagements, and contract assignments
          </p>
        </div>

        {canManageClients() && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all w-fit"
          >
            <Plus size={15} />
            <span>Register Client</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#151c28] border border-[#232f44]">
        <div className="relative w-full max-w-md">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by company or contact name..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-[#192334] border border-[#27364f] text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <EmptyState
          title="No clients found"
          description="No clients match your search criteria."
          action={
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              Add Client
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map(client => {
            const clientProjects = projects.filter(p => p.clientId === client.id);
            const activeProjects = clientProjects.filter(p => p.status === 'ACTIVE').length;

            return (
              <div
                key={client.id}
                onClick={() => navigate(`/clients/${client.id}`)}
                className="p-5 rounded-2xl bg-[#151c28] border border-[#232f44] hover:border-blue-500/50 cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400 font-bold text-sm">
                      {client.company.charAt(0)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {clientProjects.length} portfolios
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors mt-3">
                    {client.company}
                  </h3>

                  <div className="mt-3 space-y-1 text-xs text-slate-300">
                    <div className="font-semibold text-slate-200">{client.name}</div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Mail size={12} className="text-slate-500" />
                      <span>{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Phone size={12} className="text-slate-500" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#1f2a3c] flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium">
                    {activeProjects} Active Projects
                  </span>
                  <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Details <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {createModalOpen && <CreateClientModal onClose={() => setCreateModalOpen(false)} />}
    </div>
  );
};
