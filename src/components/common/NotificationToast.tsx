import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Notification } from '../../types';

export const NotificationToast: React.FC = () => {
  const { notifications, currentUser } = useApp();
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  useEffect(() => {
    if (!currentUser || notifications.length === 0) return;

    // Grab the latest unread notification
    const latest = notifications[0];
    if (latest && !latest.isRead && latest.recipientId === currentUser.id) {
      // Check if it's within the last 10 seconds
      const diff = Date.now() - new Date(latest.createdAt).getTime();
      if (diff < 10000) {
        setActiveToast(latest);
        const timer = setTimeout(() => {
          setActiveToast(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications, currentUser]);

  if (!activeToast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 rounded-2xl bg-[#192334] border border-blue-500/50 shadow-2xl flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bell size={15} />
        </div>
        <div className="flex-1 text-xs">
          <p className="font-semibold text-slate-100 leading-snug">{activeToast.message}</p>
          <span className="text-[10px] text-slate-400 mt-1 block font-mono">Just now</span>
        </div>
        <button
          onClick={() => setActiveToast(null)}
          className="p-1 rounded text-slate-400 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export const NotificationToastContainer = NotificationToast;

