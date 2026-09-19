import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Mail,
  Shield,
  Circle,
  LogIn,
  X,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoleBadge } from '../components/common/RoleBadge';
import { Role, User as UserType } from '../types';

export const TeamPage: React.FC = () => {
  const {
    users,
    currentUser,
    loginAsUser,
    createUser,
    canManageTeam,
    livePresenceCount,
  } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('DEVELOPER');
  const [department, setDepartment] = useState('Frontend Engineering');
  const [error, setError] = useState<string | null>(null);

  const filteredUsers = users.filter((u: UserType) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }

    const res = createUser({
      name: name.trim(),
      email: email.trim(),
      role,
      department: department.trim(),
      isOnline: true,
    });

    if (res.success) {
      setAddModalOpen(false);
      setName('');
      setEmail('');
    } else {
      setError(res.error || 'Failed to add team member.');
    }
  };

  const handleSwitchPersona = (userId: string) => {
    loginAsUser(userId);
    const targetUser = users.find((u: UserType) => u.id === userId);
    if (targetUser) {
      if (targetUser.role === 'ADMIN') navigate('/dashboard/admin');
      else if (targetUser.role === 'PROJECT_MANAGER') navigate('/dashboard/project-manager');
      else navigate('/dashboard/developer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Team Directory</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-xs font-bold border border-emerald-800/40">
              {livePresenceCount} Active Online
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Access levels, department assignments, and live socket connection presence
          </p>
        </div>

        {canManageTeam() && (
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all w-fit"
          >
            <Plus size={15} />
            <span>Add Member</span>
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
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-[#192334] border border-[#27364f] text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Roles' },
            { id: 'ADMIN', label: 'Admins' },
            { id: 'PROJECT_MANAGER', label: 'Project Managers' },
            { id: 'DEVELOPER', label: 'Developers' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                roleFilter === tab.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1b2537]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((user: UserType) => {
          const isCurrent = user.id === currentUser?.id;

          return (
            <div
              key={user.id}
              className={`p-5 rounded-2xl bg-[#151c28] border transition-all flex flex-col justify-between ${
                isCurrent ? 'border-blue-500/50 shadow-md shadow-blue-500/10' : 'border-[#232f44] hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/25 border border-blue-500/30 text-blue-300 font-bold text-base flex items-center justify-center">
                      {user.avatar || user.name.charAt(0)}
                    </div>
                    <span
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#151c28] ${
                        user.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                      }`}
                      title={user.isOnline ? 'Online via WebSocket' : 'Offline'}
                    />
                  </div>

                  <RoleBadge role={user.role} />
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-bold text-slate-100">{user.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Mail size={12} className="text-slate-500" />
                    <span>{user.email}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">
                    {user.department || 'Engineering & Operations'}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#1f2a3c] flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}
                  />
                  {user.isOnline ? 'Connected' : 'Offline'}
                </span>

                {isCurrent ? (
                  <span className="px-2.5 py-1 rounded-lg bg-blue-950/60 text-blue-300 border border-blue-800/40 font-semibold text-[11px]">
                    Active Persona
                  </span>
                ) : (
                  <button
                    onClick={() => handleSwitchPersona(user.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#202c40] hover:bg-blue-600 text-slate-300 hover:text-white font-medium transition-colors"
                  >
                    <UserCheck size={13} />
                    <span>Login As</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#151c28] border border-[#26354f] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#232f44] pb-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-blue-400" />
                <h3 className="text-base font-bold text-slate-100">Add Team Member</h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
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

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Vikram Seth"
                  className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vikram@velozity.io"
                  className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">RBAC Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="DEVELOPER">Developer</option>
                    <option value="PROJECT_MANAGER">Project Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#192334] border border-[#273752] text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#232f44] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#202c40] hover:bg-[#283750] text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/25 transition-all"
                >
                  Invite Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
