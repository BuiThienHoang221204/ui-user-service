import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  Monitor, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  ArrowUpCircle
} from 'lucide-react';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Sidebar - Desktop */}
      <aside className="w-[260px] shrink-0 bg-[#0F172A] border-r border-slate-800/60 p-6 flex flex-col justify-between hidden md:flex h-full overflow-y-auto">
        <div className="flex flex-col gap-8">
          {/* Logo Title */}
          <div className="flex flex-col gap-1 cursor-pointer" onClick={() => navigate('/users')}>
            <span className="text-lg font-bold tracking-tight text-white font-sans">Lumina Studio</span>
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Pro-Studio Admin</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <NavLink 
              to="/workspace"
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`
              }
            >
              <LayoutDashboard size={16} />
              Workspace
            </NavLink>
            <NavLink 
              to="/monitoring"
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`
              }
            >
              <Monitor size={16} />
              Monitoring
            </NavLink>
            <NavLink 
              to="/results"
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`
              }
            >
              <BarChart3 size={16} />
              Results
            </NavLink>
            <NavLink 
              to="/users"
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`
              }
            >
              <Users size={16} />
              Users
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="flex flex-col gap-4">
          <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold bg-[#EBE5FC] text-[#7C3AED] hover:bg-[#E0D8FB] transition-all shadow-sm">
            <ArrowUpCircle size={15} />
            Upgrade Plan
          </button>
          <div className="border-t border-slate-800/80 my-2" />
          <nav className="flex flex-col gap-1.5">
            <NavLink 
              to="/settings"
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`
              }
            >
              <Settings size={15} />
              Settings
            </NavLink>
            <NavLink 
              to="/support"
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`
              }
            >
              <HelpCircle size={15} />
              Support
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-35 bg-[#0F172A] pt-20 px-6 pb-6 flex flex-col justify-between animate-fade-in">
          <nav className="flex flex-col gap-3">
            <NavLink 
              to="/workspace"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              <LayoutDashboard size={18} /> Workspace
            </NavLink>
            <NavLink 
              to="/monitoring"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              <Monitor size={18} /> Monitoring
            </NavLink>
            <NavLink 
              to="/results"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              <BarChart3 size={18} /> Results
            </NavLink>
            <NavLink 
              to="/users"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white animate-pulse"
            >
              <Users size={18} /> Users
            </NavLink>
          </nav>

          <div className="flex flex-col gap-4">
            <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold bg-[#EBE5FC] text-[#7C3AED]">
              Upgrade Plan
            </button>
          </div>
        </div>
      )}
    </>
  );
};
