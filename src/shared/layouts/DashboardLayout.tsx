import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';
import { checkIsMockMode, setMockModeActive } from '../../features/users/hooks/useUsers';
import { ToastNotification } from '../components/ToastNotification';
import { Sidebar } from '../components/Sidebar';

export const DashboardLayout: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isMockMode, setIsMockMode] = useState(checkIsMockMode());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Keep search input in sync with URL params
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const handleMockChange = () => setIsMockMode(checkIsMockMode());
    window.addEventListener('mockModeChanged', handleMockChange);
    return () => window.removeEventListener('mockModeChanged', handleMockChange);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ search: searchTerm });
    } else {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
    // Auto redirect to user list if user searches from another page
    if (!location.pathname.startsWith('/users')) {
      navigate(`/users?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (!val.trim()) {
      searchParams.delete('search');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ search: val });
      if (!location.pathname.startsWith('/users')) {
        navigate(`/users?search=${encodeURIComponent(val)}`);
      }
    }
  };

  const toggleMockMode = () => {
    const active = !isMockMode;
    setMockModeActive(active);
    setToast({
      message: active ? 'Đã kích hoạt Chế độ Mock thủ công' : 'Đã chuyển về kết nối API Gateway Live',
      type: 'info'
    });
  };

  return (
    <div className={`h-screen overflow-hidden ${isDarkMode ? 'bg-[#0B111E] text-slate-100' : 'bg-slate-50 text-slate-900'} flex transition-colors duration-300 font-sans`}>
      
      {/* Sidebar Component */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0F172A] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-md font-bold text-white">Lumina Studio</span>
          <span className="text-[9px] text-violet-400 font-bold uppercase tracking-wider">Pro-Studio Admin</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0 h-full overflow-hidden">
        {/* Header toolbar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-slate-800/40">
          {/* Dynamic Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#131C2E] border border-slate-800 hover:border-slate-700 focus:border-violet-500/50 rounded-full pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition-all"
            />
          </form>

          {/* Right Header Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0">
            {/* Mode status badge */}
            {isMockMode && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                MOCK MODE
              </span>
            )}
            
            {/* Toggles */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setToast({ message: 'Thông báo hệ thống trống!', type: 'info' })}
                className="p-2 bg-slate-900 border border-slate-800/80 rounded-full text-slate-400 hover:text-slate-200 transition-all relative"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-violet-500 rounded-full" />
              </button>

              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 bg-slate-900 border border-slate-800/80 rounded-full text-slate-400 hover:text-slate-200 transition-all"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>

            {/* Profile Info block */}
            <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-xs font-bold text-slate-100">Admin Lumina</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">ADMINISTRATOR</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-violet-600 to-pink-500 p-[1.5px] shadow-[0_0_8px_#8b5cf6]/20">
                <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                    alt="Admin Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Render Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>

        {/* Dashboard Footer */}
        <footer className="p-6 border-t border-slate-800/80 max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_4px_#22c55e]" />
            <span>© 2026 Lumina Studio. All systems operational.</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <span>•</span>
            <button 
              onClick={toggleMockMode}
              className="hover:text-violet-400 transition-colors cursor-pointer"
            >
              Gateway Status: {isMockMode ? 'Offline (Mocked)' : 'Online'}
            </button>
          </div>
        </footer>
      </div>

      {toast && (
        <ToastNotification 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
