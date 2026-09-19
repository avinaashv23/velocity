import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Mail, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoleBadge } from '../../components/common/RoleBadge';

export const Login: React.FC = () => {
  const { users, loginWithCredentials, loginAsUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const success = loginWithCredentials(email.trim());
      setLoading(false);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid credentials or unregistered account.');
      }
    }, 400);
  };

  const handleQuickPersona = (userId: string) => {
    loginAsUser(userId);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0d121b] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/25">
            <span className="text-white font-black text-2xl tracking-wider">V</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none">Velozity</h1>
            <p className="text-xs text-slate-400 font-semibold tracking-wide mt-1">ProjectHub Enterprise</p>
          </div>
        </div>

        <h2 className="text-center text-sm text-slate-400 max-w-xs mx-auto">
          Role-Based Access Control & Live Project Intelligence Platform
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#141b27] py-8 px-6 sm:px-8 border border-[#232f44] rounded-2xl shadow-2xl space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 flex items-center gap-2.5 text-xs text-rose-300">
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@velozity.io"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#192334] border border-[#27364f] text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <span className="text-[11px] text-slate-500 italic">Assessment Demo (Any)</span>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#192334] border border-[#27364f] text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Quick Evaluator Access Section */}
          <div className="pt-5 border-t border-[#222e42] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">One-Click Evaluator Personas</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/40 font-mono">
                RBAC Sandbox
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {users.slice(0, 4).map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickPersona(u.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#192334] hover:bg-[#202c40] border border-[#25344d] hover:border-blue-500/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600/25 border border-blue-500/30 text-blue-300 font-bold text-xs flex items-center justify-center">
                      {u.avatar || u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-white">
                        {u.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{u.email}</div>
                    </div>
                  </div>
                  <RoleBadge role={u.role} size="sm" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
