import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { User } from '../types';

interface DeleteModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#060814]/70 backdrop-blur-md transition-all duration-300 animate-fade-in" 
      />
      
      {/* Card Content container */}
      <div className="relative w-full max-w-md bg-[#131C2E] border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden animate-scale-in">
        {/* Lil red/orange glow at top */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-red-500/50 via-rose-500/80 to-red-500/50" />
        
        {/* Header toolbar */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Text descriptions */}
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="text-sm font-bold text-white tracking-wide">
            Xác nhận xóa thành viên?
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hành động này sẽ thực hiện **soft delete** trên tài khoản của{' '}
            <span className="text-slate-200 font-bold">{user.fullName}</span> (
            <span className="text-violet-400 font-semibold">{user.email}</span>). 
            Tài khoản này sẽ không thể truy cập vào hệ thống cho tới khi được khôi phục.
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-300 transition-all hover:bg-slate-800"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white transition-all shadow-md shadow-red-600/10 disabled:opacity-50"
          >
            {isDeleting ? 'Đang xóa...' : 'Đồng ý xóa'}
          </button>
        </div>
      </div>
    </div>
  );
};
