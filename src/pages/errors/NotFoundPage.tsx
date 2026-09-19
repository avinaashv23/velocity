import React from 'react';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-2xl border border-[#232f44] bg-[#161c29] text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1d273a] border border-[#273752] flex items-center justify-center text-slate-400 shadow-inner">
          <HelpCircle size={32} />
        </div>

        <div className="text-3xl font-black text-slate-300 font-mono">404</div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">
          Page Not Found
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed">
          The requested path could not be found or may have been relocated.
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
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-colors"
          >
            <Home size={14} />
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
