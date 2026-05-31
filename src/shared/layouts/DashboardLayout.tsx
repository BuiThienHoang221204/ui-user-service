import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthSession } from '../hooks/useAuthSession';

export const DashboardLayout: React.FC = () => {
  useAuthSession();

  return (
    <div className="min-h-screen bg-[#0B111E] text-slate-100">
      <main className="min-w-0 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};
