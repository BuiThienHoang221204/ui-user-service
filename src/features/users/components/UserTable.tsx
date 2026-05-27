import React from 'react';
import { Edit2, Eye, Trash2, ArrowUpDown, Download } from 'lucide-react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface UserTableProps {
  users: User[];
  onDeleteClick: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onDeleteClick }) => {
  const navigate = useNavigate();

  // Helper to generate a unique vibrant gradient for each user based on their ID/Name
  const getGradient = (id: number) => {
    const gradients = [
      'from-violet-500 to-indigo-500',
      'from-pink-500 to-rose-500',
      'from-cyan-500 to-blue-500',
      'from-amber-500 to-orange-500',
      'from-emerald-500 to-teal-500',
    ];
    return gradients[id % gradients.length];
  };

  // Helper to render neonatal style pills for specific roles
  const getRoleStyle = (role?: string) => {
    const r = role?.toUpperCase() || 'STARTER';
    if (r === 'ADMIN') {
      return 'bg-violet-500/10 border border-violet-500/30 text-violet-400 font-bold';
    }
    if (r === 'PRO MEMBER') {
      return 'bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#A876FA] font-bold';
    }
    return 'bg-slate-800 border border-slate-700 text-slate-400 font-medium';
  };

  const getStatusStyle = (status: 'active' | 'inactive') => {
    return status === 'active'
      ? { text: 'Active', dot: 'bg-green-500', textClass: 'text-green-400 font-medium' }
      : { text: 'Idle', dot: 'bg-slate-500', textClass: 'text-slate-400 font-medium' };
  };

  // Sleek CSV download utility
  const handleExportCSV = () => {
    if (users.length === 0) return;
    const headers = ['ID', 'Full Name', 'Username', 'Email', 'Phone', 'Role', 'Status', 'CreatedAt'];
    const rows = users.map(u => [
      u.id,
      u.fullName,
      u.username || '',
      u.email,
      u.phone,
      u.role || 'STARTER',
      u.status,
      u.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lumina_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#131C2E] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl animate-fade-in flex flex-col h-full">
      {/* Table Header toolbar */}
      <div className="px-6 py-5 border-b border-slate-800/60 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Danh sách thành viên
        </h3>
        
        <div className="flex items-center gap-3">
          <button className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowUpDown size={15} />
          </button>
          <button 
            onClick={handleExportCSV}
            className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold px-3"
          >
            <Download size={14} />
            Tải CSV
          </button>
        </div>
      </div>

      {/* Table grid wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/60 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950/20">
              <th className="px-6 py-4">USER</th>
              <th className="px-6 py-4">ROLE</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4">LAST ACTIVE</th>
              <th className="px-6 py-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-slate-500 text-xs">Không tìm thấy thành viên nào.</span>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const status = getStatusStyle(user.status);
                return (
                  <tr key={user.id} className="hover:bg-slate-800/20 transition-all group">
                    {/* User profile with initials/avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className={`h-10 w-10 rounded-full bg-gradient-to-tr ${getGradient(user.id)} p-[1.5px] shadow-sm`}>
                          <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center text-white text-xs font-extrabold select-none">
                            {user.fullName.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors truncate">
                            {user.fullName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role Pill */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${getRoleStyle(user.role)}`}>
                        {user.role || 'STARTER'}
                      </span>
                    </td>

                    {/* Status indicator */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        <span className={`text-[10px] ${status.textClass}`}>
                          {status.text}
                        </span>
                      </div>
                    </td>

                    {/* Last active duration */}
                    <td className="px-6 py-4">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {user.lastActive || 'Vừa xong'}
                      </span>
                    </td>

                    {/* Row CRUD controls */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/users/${user.id}`)}
                          title="Xem chi tiết"
                          className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-[#7C3AED] hover:bg-violet-500/10 transition-all"
                        >
                          <Eye size={13} />
                        </button>
                        <button 
                          onClick={() => navigate(`/users/${user.id}/edit`)}
                          title="Chỉnh sửa"
                          className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-green-400 hover:bg-green-500/10 transition-all"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => onDeleteClick(user)}
                          title="Xóa thành viên"
                          className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
