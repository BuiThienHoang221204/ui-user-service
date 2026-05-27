import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useUsersList, useDeleteUser } from '../hooks/useUsers';
import { UserStats } from '../components/UserStats';
import { UserTable } from '../components/UserTable';
import { PermissionsAndActivity } from '../components/PermissionsAndActivity';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { ToastNotification } from '../../../shared/components/ToastNotification';
import { User } from '../types';

export const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchVal = searchParams.get('search') || '';

  // API query
  const { data: users, isLoading, error } = useUsersList({ email: searchVal });
  
  // States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Soft Delete Mutation
  const deleteMutation = useDeleteUser(() => {
    setToast({
      message: `Đã soft delete thành công tài khoản của ${userToDelete?.fullName}!`,
      type: 'success'
    });
    setIsDeleteOpen(false);
    setUserToDelete(null);
  });

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
    }
  };

  // Loading Skeleton State matches sleek cards
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-60 bg-slate-800 rounded-lg mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-800 rounded-2xl" />
          <div className="h-32 bg-slate-800 rounded-2xl" />
          <div className="h-32 bg-slate-800 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 h-96 bg-slate-800 rounded-2xl" />
          <div className="h-96 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error boundary state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-red-500/20 bg-red-500/5 rounded-2xl">
        <span className="text-sm font-bold text-red-400">Đã xảy ra lỗi khi tải danh sách người dùng.</span>
        <span className="text-xs text-slate-500 mt-1">Vui lòng thử tải lại trang hoặc kiểm tra kết nối gateway.</span>
      </div>
    );
  }

  const activeCount = users?.filter(u => u.status === 'active').length || 0;
  const totalCount = users?.length || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Title section and main call to action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold text-white tracking-wide">
            Quản lý Người dùng
          </h2>
          <p className="text-xs text-slate-400">
            Giám sát và phân quyền thành viên trong hệ thống studio của bạn.
          </p>
        </div>

        <button 
          onClick={() => navigate('/users/create')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-violet-600/10 shrink-0 self-start sm:self-center"
        >
          <Plus size={15} />
          Thêm thành viên mới
        </button>
      </div>

      {/* Stats Cards */}
      <UserStats 
        totalUsers={totalCount}
        activeUsers={activeCount}
      />

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Table list - 75% wide (3/4 cols) */}
        <div className="lg:col-span-3">
          <UserTable 
            users={users || []}
            onDeleteClick={handleDeleteClick}
          />
        </div>

        {/* Global Permissions & activity logs - 25% wide (1/4 col) */}
        <div className="lg:col-span-1">
          <PermissionsAndActivity />
        </div>
      </div>

      {/* Modal confirmations */}
      <DeleteConfirmModal 
        isOpen={isDeleteOpen}
        user={userToDelete}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />

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
