import React from 'react';
import { TrendingUp, Users, HardDrive } from 'lucide-react';

interface StatsProps {
  totalUsers: number;
  activeUsers: number;
}

export const UserStats: React.FC<StatsProps> = ({ totalUsers, activeUsers }) => {
  const displayTotal = totalUsers > 0 ? totalUsers : 8420;
  const displayActive = activeUsers > 0 ? activeUsers : 1237;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
      {/* Total Users */}
      <div className="bg-[#131C2E] border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/10 transition-all duration-300" />
        
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            TỔNG SỐ NGƯỜI DÙNG
          </span>
          <div className="p-2 bg-slate-800/80 rounded-xl text-violet-400">
            <Users size={18} />
          </div>
        </div>
        
        <div className="flex items-baseline gap-4 mt-2">
          <span className="text-3xl md:text-4xl font-bold text-white tracking-tight animate-scale-in">
            {displayTotal.toLocaleString('en-US')}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 border border-green-500/20 text-green-400">
            <TrendingUp size={12} />
            +12%
          </span>
        </div>
      </div>

      {/* Active Users */}
      <div className="bg-[#131C2E] border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-600/5 rounded-full blur-2xl group-hover:bg-cyan-600/10 transition-all duration-300" />
        
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            NGƯỜI DÙNG ĐANG HOẠT ĐỘNG
          </span>
          <div className="relative">
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <div className="p-2 bg-slate-800/80 rounded-xl text-cyan-400">
              <Users size={18} />
            </div>
          </div>
        </div>
        
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl md:text-4xl font-bold text-white tracking-tight animate-scale-in">
            {displayActive.toLocaleString('en-US')}
          </span>
          <span className="text-xs font-semibold text-slate-500 italic">
            Real-time
          </span>
        </div>
      </div>

      {/* Storage Limit */}
      <div className="bg-[#131C2E] border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-600/5 rounded-full blur-2xl group-hover:bg-pink-600/10 transition-all duration-300" />
        
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            DUNG LƯỢNG LƯU TRỮ
          </span>
          <div className="p-2 bg-slate-800/80 rounded-xl text-pink-400">
            <HardDrive size={18} />
          </div>
        </div>
        
        <div className="flex items-baseline justify-between mb-3 mt-1">
          <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            12.4 <span className="text-xl text-slate-400">TB</span>
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Giới hạn <span className="text-white font-semibold">20 TB</span>
          </span>
        </div>

        {/* Pink/purple gradient progress bar */}
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full transition-all duration-500" 
            style={{ width: '62%' }} 
          />
        </div>
      </div>
    </div>
  );
};
