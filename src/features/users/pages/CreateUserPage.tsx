import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, AlertCircle } from 'lucide-react';
import { useCreateUser } from '../hooks/useUsers';
import { UserCreateInput } from '../types';
import { ToastNotification } from '../../../shared/components/ToastNotification';

export const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Form State
  const [formData, setFormData] = useState<UserCreateInput>({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    role: 'PRO MEMBER',
    status: 'active',
  });

  // Validation Errors
  const [errors, setErrors] = useState<Partial<Record<keyof UserCreateInput, string>>>({});

  // API Mutation
  const createMutation = useCreateUser(() => {
    setToast({
      message: `Đã thêm thành công thành viên ${formData.fullName}!`,
      type: 'success'
    });
    // Redirect after brief delay to let toast display
    setTimeout(() => {
      navigate('/users');
    }, 1500);
  });

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserCreateInput, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên bắt buộc nhập';
    }

    if (!formData.username?.trim()) {
      newErrors.username = 'Tên đăng nhập bắt buộc nhập';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email bắt buộc nhập';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Định dạng email không hợp lệ (ví dụ: name@domain.com)';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nền tảng bắt buộc nhập';
    } else if (formData.phone.trim().length < 2 || formData.phone.trim().length > 50) {
      newErrors.phone = 'Nền tảng phải từ 2 đến 50 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error on type
    if (errors[name as keyof UserCreateInput]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    createMutation.mutate(formData, {
      onError: (err: any) => {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi tạo tài khoản!';
        if (status === 409) {
          setToast({
            message: 'Tên đăng nhập hoặc Email đã tồn tại.',
            type: 'error'
          });
        } else {
          setToast({
            message: `Lỗi: ${msg}`,
            type: 'error'
          });
        }
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Back button */}
      <div>
        <button 
          onClick={() => navigate('/users')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>
      </div>

      {/* Two-column layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* Left Column: Form Card (2/3 width on desktop) */}
        <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
          <div className="w-full flex-1 flex flex-col bg-[#131C2E] border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden animate-scale-in relative">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-600 to-indigo-600" />
            
            {/* Form header */}
            <div className="px-8 py-6 border-b border-slate-800/40 flex items-center gap-3.5 bg-slate-950/20">
              <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl">
                <UserPlus size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Thêm thành viên mới
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold">
                  Khai báo và cấp quyền cho thành viên mới trong hệ thống.
                </span>
              </div>
            </div>

            {/* Input fields */}
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5 flex-1 overflow-y-auto">
              {/* FullName input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Ví dụ: Sarah Connor"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={createMutation.isPending}
                  className={`w-full bg-[#0B111E] border rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition-all ${
                    errors.fullName ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 hover:border-slate-750 focus:border-violet-500/50'
                  }`}
                />
                {errors.fullName && (
                  <span className="flex items-center gap-1 text-[10px] text-red-400 font-semibold mt-0.5">
                    <AlertCircle size={10} />
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* Username input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="username"
                  placeholder="Ví dụ: sarahconnor"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={createMutation.isPending}
                  className={`w-full bg-[#0B111E] border rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition-all ${
                    errors.username ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 hover:border-slate-750 focus:border-violet-500/50'
                  }`}
                />
                {errors.username && (
                  <span className="flex items-center gap-1 text-[10px] text-red-400 font-semibold mt-0.5">
                    <AlertCircle size={10} />
                    {errors.username}
                  </span>
                )}
              </div>

              {/* Grid wrapper for email and phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Địa chỉ Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="email"
                    placeholder="sarah.c@lumina.io"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={createMutation.isPending}
                    className={`w-full bg-[#0B111E] border rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition-all ${
                      errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 hover:border-slate-750 focus:border-violet-500/50'
                    }`}
                  />
                  {errors.email && (
                    <span className="flex items-center gap-1 text-[10px] text-red-400 font-semibold mt-0.5">
                      <AlertCircle size={10} />
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Phone input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Nền tảng <span className="text-red-500">*</span>
                    </label>
                  <input 
                    type="text" 
                    name="phone"
                      placeholder="Ví dụ: google-oauth"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={createMutation.isPending}
                    className={`w-full bg-[#0B111E] border rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition-all ${
                      errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 hover:border-slate-750 focus:border-violet-500/50'
                    }`}
                  />
                  {errors.phone && (
                    <span className="flex items-center gap-1 text-[10px] text-red-400 font-semibold mt-0.5">
                      <AlertCircle size={10} />
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Grid wrapper for role and status dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Vai trò
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={createMutation.isPending}
                    className="w-full bg-[#0B111E] border border-slate-800 hover:border-slate-750 focus:border-violet-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition-all"
                  >
                    <option value="PRO MEMBER">PRO MEMBER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="STARTER">STARTER</option>
                  </select>
                </div>

                {/* Status select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Trạng thái hoạt động
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={createMutation.isPending}
                    className="w-full bg-[#0B111E] border border-slate-800 hover:border-slate-750 focus:border-violet-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition-all"
                  >
                    <option value="active">Active (Hoạt động)</option>
                    <option value="inactive">Idle (Ngoại tuyến)</option>
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3.5 border-t border-slate-800/60 pt-6 mt-2">
                <button
                  type="button"
                  onClick={() => navigate('/users')}
                  disabled={createMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-300 transition-all hover:bg-slate-850 disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-violet-600/10 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Đang thêm...' : 'Thêm thành viên'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Live Profile Preview & Roles Guideline (1/3 width) */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto animate-scale-in">
          
          {/* Member Badge Live Preview */}
          <div className="bg-[#131C2E] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-4 shrink-0">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-600 to-indigo-600" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Thẻ thành viên (Live Preview)</span>
            
            <div className="bg-slate-950/40 border border-slate-850/65 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${
                  formData.role === 'ADMIN' 
                    ? 'from-violet-500 to-indigo-500' 
                    : formData.role === 'PRO MEMBER'
                    ? 'from-pink-500 to-rose-500'
                    : 'from-slate-650 to-slate-750'
                } p-[1.5px] shadow-lg shadow-violet-500/5`}>
                  <div className="h-full w-full rounded-2xl bg-slate-950 flex items-center justify-center text-white text-lg font-bold select-none">
                    {formData.fullName 
                      ? formData.fullName.split(' ').filter(Boolean).map(n => n[0]).slice(0,2).join('').toUpperCase() 
                      : '?'}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{formData.fullName || 'Tên thành viên'}</h4>
                  <span className="text-[10px] text-slate-500 truncate">@{formData.fullName ? formData.fullName.toLowerCase().replace(/\s+/g, '') : 'username'}</span>
                </div>
              </div>
              
              <div className="border-t border-slate-850/60 pt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-semibold">Vai trò chính</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    formData.role === 'ADMIN' 
                      ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' 
                      : formData.role === 'PRO MEMBER'
                      ? 'bg-[#7C3AED]/20 text-[#A876FA] border border-[#7C3AED]/35'
                      : 'bg-slate-850 text-slate-400 border border-slate-800'
                  }`}>{formData.role}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-semibold">Trạng thái</span>
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className={`h-1.5 w-1.5 rounded-full ${formData.status === 'active' ? 'bg-green-500 shadow-[0_0_6px_#22c55e]' : 'bg-slate-550'}`} />
                    <span className="text-slate-300 capitalize text-[9px]">{formData.status === 'active' ? 'Active' : 'Idle'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Guideline Card */}
          <div className="bg-[#131C2E] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-4">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-pink-500 to-rose-500" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Quy định vai trò hệ thống</span>
            
            <div className="flex flex-col gap-3.5">
              <div className="flex gap-3 text-xs leading-normal">
                <span className="text-base select-none">👑</span>
                <div className="flex flex-col">
                  <span className="font-bold text-violet-400 text-xs">ADMIN</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Toàn quyền quản trị, thêm/xóa thành viên và xuất báo cáo dữ liệu.</span>
                </div>
              </div>
              <div className="border-b border-slate-850/60" />
              
              <div className="flex gap-3 text-xs leading-normal">
                <span className="text-base select-none">⚡</span>
                <div className="flex flex-col">
                  <span className="font-bold text-[#A876FA] text-xs">PRO MEMBER</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Tải tài nguyên Pro không giới hạn và sử dụng 20TB lưu trữ đám mây.</span>
                </div>
              </div>
              <div className="border-b border-slate-850/60" />

              <div className="flex gap-3 text-xs leading-normal">
                <span className="text-base select-none">👤</span>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-400 text-xs">STARTER</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Thành viên dùng thử cơ bản, giới hạn dung lượng lưu trữ 5GB.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

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
