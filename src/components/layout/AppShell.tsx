import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { NotificationToastContainer } from '../common/NotificationToast';

export const AppShell: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d121b] text-slate-100 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Collapsible Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Top Navigation */}
      <TopNav sidebarCollapsed={sidebarCollapsed} />

      {/* Main View Container */}
      <main
        className={`flex-1 transition-all duration-300 mt-16 p-6 sm:p-8 max-w-[1600px] mx-auto w-full ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Outlet />
      </main>

      {/* System Toast Notifications */}
      <NotificationToastContainer />
    </div>
  );
};
