import React, { useState } from 'react';
import {
  Activity,
  Filter,
  Circle,
  Calendar,
  User,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/common/EmptyState';
import { ActivityLog } from '../types';

export const ActivityPage: React.FC = () => {
  const {
    getAccessibleActivities,
    users,
    projects,
    connectionStatus,
    isLiveSimulationActive,
    toggleLiveSimulation,
  } = useApp();

  const [filterAction, setFilterAction] = useState<string>('ALL');

  const activities = getAccessibleActivities();

  const filtered = activities.filter((a: ActivityLog) => {
    if (filterAction === 'ALL') return true;
    return a.action === filterAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Real-Time Activity Audit</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-xs font-bold border border-emerald-800/40">
              ● LIVE STREAM
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            WebSocket broadcast feed, state transitions, task reassignments, and RBAC events
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLiveSimulation}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isLiveSimulationActive
                ? 'bg-emerald-950/50 border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-[#1e273a] border-[#29374f] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap size={14} />
            <span>{isLiveSimulationActive ? 'Live Simulation Active' : 'Simulation Paused'}</span>
          </button>
        </div>
      </div>

      {/* Action Filters */}
      <div className="p-4 rounded-2xl bg-[#151c28] border border-[#232f44] flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs">
          {[
            { id: 'ALL', label: 'All Activities' },
            { id: 'STATUS_CHANGED', label: 'Status Transitions' },
            { id: 'CREATED_TASK', label: 'Created Tasks' },
            { id: 'CREATED_PROJECT', label: 'Created Projects' },
            { id: 'ASSIGNED_TASK', label: 'Assignments' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterAction(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterAction === tab.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1b2537]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400 whitespace-nowrap hidden sm:inline">
          {filtered.length} entries recorded
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            title="No activity records found"
            description="No recent operations match the selected action filter."
          />
        ) : (
          <div className="space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-[#202b3d]">
            {filtered.map((act: ActivityLog) => {
              const actor = users.find(u => u.id === act.actorId);
              const project = projects.find(p => p.id === act.projectId);

              return (
                <div key={act.id} className="relative pl-8 text-xs group">
                  {/* Timeline dot */}
                  <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#151c28] shadow-sm group-hover:scale-125 transition-transform" />

                  <div className="p-4 rounded-xl bg-[#182130] border border-[#233148] hover:border-slate-600 transition-colors space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-semibold text-slate-100 leading-snug">{act.message}</span>
                      <span className="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(act.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <div className="flex items-center gap-1">
                        <User size={12} className="text-blue-400" />
                        <span className="text-slate-300">{actor?.name || 'System Operator'}</span>
                        <span className="text-slate-500">({actor?.role || 'SYSTEM'})</span>
                      </div>

                      {project && (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">• Project:</span>
                          <span className="text-blue-400 font-medium">{project.name}</span>
                        </div>
                      )}

                      <span className="px-1.5 py-0.5 rounded bg-[#131924] font-mono text-[10px] text-slate-400 border border-[#232f44]">
                        {act.action}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
