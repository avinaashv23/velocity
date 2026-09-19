import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full animate-pulse space-y-3 p-4">
      <div className="h-9 bg-[#1d273a] rounded-lg w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-3 border-b border-[#202c40]">
          <div className="h-5 bg-[#1b2436] rounded w-1/3" />
          <div className="h-5 bg-[#1b2436] rounded w-1/6" />
          <div className="h-5 bg-[#1b2436] rounded w-1/6" />
          <div className="h-5 bg-[#1b2436] rounded w-1/6" />
          <div className="h-5 bg-[#1b2436] rounded w-1/12 ml-auto" />
        </div>
      ))}
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full animate-pulse space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-[#161d2b] border border-[#232f44] rounded-xl p-4 space-y-3">
            <div className="h-4 bg-[#202a3d] rounded w-1/2" />
            <div className="h-8 bg-[#202a3d] rounded w-1/3" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-[#161d2b] border border-[#232f44] rounded-xl" />
        <div className="h-72 bg-[#161d2b] border border-[#232f44] rounded-xl" />
      </div>
    </div>
  );
};

export const ActivitySkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="w-full animate-pulse space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl bg-[#172030] border border-[#243147] space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-[#233149] rounded w-1/4" />
            <div className="h-3 bg-[#233149] rounded w-16" />
          </div>
          <div className="h-4 bg-[#233149] rounded w-3/4" />
        </div>
      ))}
    </div>
  );
};
