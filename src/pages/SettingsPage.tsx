import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Radio,
  RotateCcw,
  Zap,
  Wifi,
  WifiOff,
  User,
  Database,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoleBadge } from '../components/common/RoleBadge';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    connectionStatus,
    simulateDisconnect,
    simulateReconnect,
    isLiveSimulationActive,
    toggleLiveSimulation,
    resetToSeedData,
  } = useApp();

  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (confirm('Reset all projects, tasks, clients, and activity logs back to fresh demo seed data?')) {
      resetToSeedData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">System Configuration</h1>
        <p className="text-xs text-slate-400 mt-1">
          Profile authorization matrix, live WebSocket socket telemetry, and test seed data resets
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>Demo database restored to initial seed state successfully!</span>
        </div>
      )}

      {/* Profile & RBAC Card */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950/70 border border-blue-800/40 text-blue-400 flex items-center justify-center">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Active Profile & RBAC Role</h2>
            <p className="text-xs text-slate-400">Current authenticated session capabilities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-[#192334] border border-[#26354d]">
            <span className="text-slate-500 text-[11px] block">Full Name</span>
            <span className="font-bold text-slate-200 mt-0.5 block">{currentUser?.name}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#192334] border border-[#26354d]">
            <span className="text-slate-500 text-[11px] block">Email Address</span>
            <span className="font-mono text-slate-200 mt-0.5 block">{currentUser?.email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#192334] border border-[#26354d]">
            <span className="text-slate-500 text-[11px] block">Authorization Level</span>
            <div className="mt-1">
              {currentUser && <RoleBadge role={currentUser.role} />}
            </div>
          </div>
        </div>

        {/* Permissions list */}
        <div className="p-4 rounded-xl bg-[#182130] border border-[#243147] space-y-2 text-xs">
          <span className="font-semibold text-slate-300 block">Active Role Privileges:</span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 text-[11px]">
            {currentUser?.role === 'ADMIN' && (
              <>
                <li className="flex items-center gap-1.5 text-emerald-400">✓ Full System Administration</li>
                <li className="flex items-center gap-1.5 text-emerald-400">✓ Manage all Projects & Tasks</li>
                <li className="flex items-center gap-1.5 text-emerald-400">✓ Client Accounts & Contracts</li>
                <li className="flex items-center gap-1.5 text-emerald-400">✓ Team Directory & Role Management</li>
              </>
            )}
            {currentUser?.role === 'PROJECT_MANAGER' && (
              <>
                <li className="flex items-center gap-1.5 text-blue-400">✓ Manage Own Created Projects</li>
                <li className="flex items-center gap-1.5 text-blue-400">✓ Create, Edit & Assign Tasks</li>
                <li className="flex items-center gap-1.5 text-blue-400">✓ Project Health & Budget Controls</li>
                <li className="flex items-center gap-1.5 text-slate-500">✗ Cross-project Administration (Restricted)</li>
              </>
            )}
            {currentUser?.role === 'DEVELOPER' && (
              <>
                <li className="flex items-center gap-1.5 text-purple-400">✓ Update Assigned Task Status Workflow</li>
                <li className="flex items-center gap-1.5 text-purple-400">✓ View Assigned Sprint Workload</li>
                <li className="flex items-center gap-1.5 text-slate-500">✗ Cannot Modify Projects (Restricted)</li>
                <li className="flex items-center gap-1.5 text-slate-500">✗ Cannot Manage Team (Restricted)</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Real-time WebSocket Telemetry */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-800/40 text-purple-400 flex items-center justify-center">
            <Radio size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">WebSocket & Event Telemetry</h2>
            <p className="text-xs text-slate-400">Real-time socket connection and background simulation controls</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#192334] border border-[#26354d]">
            <span className="text-slate-500 text-[11px] block">Connection State</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'CONNECTED'
                    ? 'bg-emerald-400'
                    : connectionStatus === 'RECONNECTING'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-rose-400'
                }`}
              />
              <span className="font-bold text-slate-200">{connectionStatus}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#192334] border border-[#26354d]">
            <span className="text-slate-500 text-[11px] block">Simulated Latency</span>
            <span className="font-mono font-bold text-slate-200 mt-1 block">
              {connectionStatus === 'CONNECTED' ? '18ms' : '---'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#192334] border border-[#26354d]">
            <span className="text-slate-500 text-[11px] block">Live Events Generator</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-semibold text-slate-200">
                {isLiveSimulationActive ? 'Running' : 'Suspended'}
              </span>
              <button
                onClick={toggleLiveSimulation}
                className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold"
              >
                {isLiveSimulationActive ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 mr-2">Simulate Connection Disruptions:</span>
          <button
            onClick={simulateReconnect}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              connectionStatus === 'CONNECTED'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 font-semibold'
                : 'bg-[#1e283b] border-[#29374f] text-slate-400 hover:text-slate-200'
            }`}
          >
            Trigger Reconnect
          </button>
          <button
            onClick={simulateDisconnect}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              connectionStatus === 'DISCONNECTED'
                ? 'bg-rose-950/60 border-rose-800 text-rose-300 font-semibold'
                : 'bg-[#1e283b] border-[#29374f] text-slate-400 hover:text-slate-200'
            }`}
          >
            Sever Connection (Offline)
          </button>
        </div>
      </div>

      {/* Demo Seed Reset */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-950/70 border border-rose-800/40 text-rose-400 flex items-center justify-center">
              <Database size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Seed Data Management</h2>
              <p className="text-xs text-slate-400">
                Restore initial projects, users, client accounts, and demo tasks in localStorage
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-semibold border border-rose-800/60 transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
