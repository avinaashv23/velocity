import React from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const getDashboardPath = () => {
    if (!currentUser) return '/auth/login';
    if (currentUser.role === 'ADMIN') return '/dashboard/admin';
    if (currentUser.role === 'PROJECT_MANAGER') return '/dashboard/project-manager';
    return '/dashboard/developer';
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-2xl border border-rose-900/40 bg-[#16141c] text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400 shadow-inner">
          <ShieldAlert size={32} />
        </div>

        <div className="text-3xl font-black text-rose-400 font-mono">403</div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">
          Access Restricted by Policy
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed">
          You don't have authorization to view this resource under your current role (
          <span className="text-slate-200 font-semibold">{currentUser?.role || 'Guest'}</span>). Role-Based Access Control (RBAC) boundaries are enforced.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#21293a] hover:bg-[#2c374d] text-slate-300 text-xs font-medium transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => navigate(getDashboardPath())}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-colors"
          >
            <Home size={14} />
            <span>Go to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
