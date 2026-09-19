import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/common/EmptyState';
import { Notification } from '../types';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useApp();

  const [filterMode, setFilterMode] = useState<'ALL' | 'UNREAD'>('ALL');

  if (!currentUser) return null;

  const userNotifications = notifications.filter((n: Notification) => n.recipientId === currentUser.id);

  const filtered = userNotifications.filter((n: Notification) => {
    if (filterMode === 'UNREAD') return !n.isRead;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Notification Center</h1>
            {unreadNotificationsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-300 text-xs font-bold font-mono">
                {unreadNotificationsCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time assignment alerts, review requests, and deadline reminders
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e283b] hover:bg-[#28374f] text-blue-300 text-xs font-semibold border border-[#2b3a52] transition-colors w-fit"
          >
            <CheckCheck size={15} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#232f44] pb-1 text-xs">
        <button
          onClick={() => setFilterMode('ALL')}
          className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
            filterMode === 'ALL'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#182130]'
          }`}
        >
          All Notifications ({userNotifications.length})
        </button>
        <button
          onClick={() => setFilterMode('UNREAD')}
          className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
            filterMode === 'UNREAD'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#182130]'
          }`}
        >
          Unread Only ({unreadNotificationsCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="p-6 rounded-2xl bg-[#151c28] border border-[#232f44] space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            title="You're completely caught up"
            description="No notifications currently match your active filter."
            icon={<Inbox size={24} className="text-slate-500" />}
          />
        ) : (
          <div className="space-y-2.5 divide-y divide-[#1e283b]">
            {filtered.map((notif: Notification) => (
              <div
                key={notif.id}
                className={`pt-3 first:pt-0 p-3.5 rounded-xl transition-all flex items-start justify-between gap-4 ${
                  !notif.isRead
                    ? 'bg-[#182233] border border-blue-500/30 shadow-sm'
                    : 'bg-[#141b26] border border-transparent hover:border-[#222e42]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      !notif.isRead
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'bg-[#1c2637] text-slate-400 border border-[#26354d]'
                    }`}
                  >
                    <Bell size={15} />
                  </div>

                  <div className="space-y-1">
                    <p className={`text-xs ${!notif.isRead ? 'font-semibold text-slate-100' : 'text-slate-300'}`}>
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="font-mono">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>

                      {notif.taskId && (
                        <Link
                          to={`/tasks/${notif.taskId}`}
                          className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
                        >
                          <span>Inspect Task</span>
                          <ArrowRight size={11} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {!notif.isRead && (
                  <button
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 whitespace-nowrap font-medium transition-colors"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
