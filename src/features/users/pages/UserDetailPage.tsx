import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, ShieldAlert, Mail, Phone, Calendar, Clock, Activity } from 'lucide-react';
import { useUserDetail } from '../hooks/useUsers';

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUserDetail(id || '');

  // Loading skeleton matching SaaS grid card
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse w-full h-full">
        <div className="h-6 w-32 bg-slate-800 rounded-lg" />
        <div className="bg-[#131C2E] border border-slate-800 rounded-2xl p-8 flex-1" />
      </div>
    );
  }

  // Error boundary
  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-red-500/20 bg-red-500/5 rounded-2xl w-full h-full">
        <ShieldAlert className="text-red-400 mb-3" size={32} />
        <span className="text-sm font-bold text-red-400">Không tìm thấy thành viên hoặc xảy ra lỗi tải.</span>
        <button 
          onClick={() => navigate('/users')}
          className="mt-4 px-4 py-2 bg-slate-900 border border-slate-850 rounded-xl text-xs font-bold text-slate-300"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

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

  const getRoleStyle = (role?: string) => {
    const r = role?.toUpperCase() || 'STARTER';
    if (r === 'ADMIN') return 'bg-violet-500/10 border border-violet-500/30 text-violet-400';
    if (r === 'PRO MEMBER') return 'bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#A876FA]';
    return 'bg-slate-800 border border-slate-700 text-slate-400';
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Navigation bar controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/users')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>

        <button 
          onClick={() => navigate(`/users/${user.id}/edit`)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all hover:bg-slate-850"
        >
          <Edit2 size={13} />
          Chỉnh sửa thông tin
        </button>
      </div>

      {/* Two-column layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden animate-scale-in">
        
        {/* Left Column: Primary Profiler Card (7/12 width) */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
          <div className="w-full flex-1 flex flex-col bg-[#131C2E] border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-600 to-pink-500" />
            
            {/* Banner with avatar circle floating */}
            <div className="h-32 bg-slate-950/40 border-b border-slate-800/40 relative flex items-end p-6 justify-between">
              <div className="flex items-end gap-5 translate-y-10">
                <div className={`h-24 w-24 rounded-2xl bg-gradient-to-tr ${getGradient(user.id)} p-[2px] shadow-2xl`}>
                  <div className="h-full w-full rounded-2xl bg-slate-950 flex items-center justify-center text-white text-3xl font-extrabold select-none">
                    {user.fullName.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                  </div>
                </div>
                <div className="flex flex-col gap-1 pb-2">
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {user.fullName}
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    @{user.username || user.fullName.toLowerCase().replace(/\s+/g, '')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pb-2">
                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${getRoleStyle(user.role)}`}>
                  {user.role || 'STARTER'}
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${user.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]/55' : 'bg-slate-500'}`} />
              </div>
            </div>

            {/* Detailed profiles section */}
            <div className="pt-16 p-8 flex flex-col gap-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Box 1: Email Address */}
                <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-slate-800/80 rounded-lg text-violet-400">
                    <Mail size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Địa chỉ Email</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{user.email}</span>
                  </div>
                </div>

                {/* Box 2: Phone number */}
                <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-slate-800/80 rounded-lg text-cyan-400">
                    <Phone size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Số điện thoại</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{user.phone}</span>
                  </div>
                </div>

                {/* Box 3: Created At date */}
                <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-slate-800/80 rounded-lg text-pink-400">
                    <Calendar size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Ngày gia nhập</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Box 4: Last active */}
                <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-slate-800/80 rounded-lg text-amber-400">
                    <Clock size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Hoạt động cuối</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5">
                      {user.lastActive || 'Vừa xong'}
                    </span>
                  </div>
                </div>
              </div>

              {/* System metadata properties */}
              {user.updatedAt && (
                <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-auto">
                  <span className="flex items-center gap-1.5">
                    <Activity size={12} />
                    ID Hệ thống: {user.id}
                  </span>
                  <span>Cập nhật lần cuối: {new Date(user.updatedAt).toLocaleString('vi-VN')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Permissions & Audit Logs Timeline (5/12 width) */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-y-auto">
          
          {/* Card 1: Permissions & Security */}
          <div className="bg-[#131C2E] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-4 shrink-0">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-600 to-indigo-600" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Phân quyền & Bảo mật</span>
              <h4 className="text-xs font-bold text-white mt-1">Trạng thái cấp phép tài khoản</h4>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center justify-between bg-slate-950/20 border border-slate-850/65 p-3.5 rounded-xl">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-bold text-slate-200">Truy cập API Gateway</span>
                  <span className="text-[9px] text-slate-500">Cấp quyền kết nối API từ ứng dụng ngoài.</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                  user.role === 'STARTER' 
                    ? 'bg-slate-850 text-slate-550 border-slate-800' 
                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                }`}>
                  {user.role === 'STARTER' ? 'Khóa' : 'Cho phép'}
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-950/20 border border-slate-850/65 p-3.5 rounded-xl">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-bold text-slate-200">Xác thực 2 lớp (2FA)</span>
                  <span className="text-[9px] text-slate-500">Bảo mật tài khoản nâng cao bằng mã OTP.</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-green-500/10 text-green-400 border border-green-500/20">
                  Đã bật
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-950/20 border border-slate-850/65 p-3.5 rounded-xl">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-bold text-slate-200">Mã hóa dữ liệu đầu cuối</span>
                  <span className="text-[9px] text-slate-500">Tự động mã hóa tệp hình ảnh tải lên.</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-green-500/10 text-green-400 border border-green-500/20">
                  Kích hoạt
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Recent Activities */}
          <div className="bg-[#131C2E] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-4 flex-1">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-pink-500 to-rose-500" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Nhật ký hoạt động</span>
              <h4 className="text-xs font-bold text-white mt-1">Lịch sử thao tác hệ thống</h4>
            </div>

            <div className="flex flex-col gap-4 pt-1 overflow-y-auto flex-1 min-h-[120px]">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="h-2 w-2 rounded-full bg-violet-500 ring-4 ring-violet-500/15 shrink-0" />
                  <span className="w-[1px] flex-1 bg-slate-800 my-1" />
                </div>
                <div className="flex flex-col gap-0.5 pb-2">
                  <span className="text-xs font-bold text-slate-200">Đăng nhập tài khoản</span>
                  <span className="text-[10px] text-slate-500 leading-normal">Từ thiết bị Mac - Chrome, IP: 113.23.45.18</span>
                  <span className="text-[9px] text-violet-400 font-bold mt-0.5">Vừa xong</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="h-2 w-2 rounded-full bg-pink-500 ring-4 ring-pink-500/15 shrink-0" />
                  <span className="w-[1px] flex-1 bg-slate-800 my-1" />
                </div>
                <div className="flex flex-col gap-0.5 pb-2">
                  <span className="text-xs font-bold text-slate-200">Cập nhật hồ sơ thành viên</span>
                  <span className="text-[10px] text-slate-500 leading-normal">Đã cập nhật trạng thái hoạt động tài khoản sang "Active"</span>
                  <span className="text-[9px] text-pink-400 font-bold mt-0.5">2 giờ trước</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center text-slate-650">
                  <span className="h-2 w-2 rounded-full bg-slate-600 ring-4 ring-slate-650/15 shrink-0" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-200">Tạo tài khoản thành công</span>
                  <span className="text-[10px] text-slate-500 leading-normal">Khởi tạo ID thành viên #{user.id}</span>
                  <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
