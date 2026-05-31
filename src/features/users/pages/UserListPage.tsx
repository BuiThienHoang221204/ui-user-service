import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Activity, BadgeCheck, Calendar, Clock, Edit2, Mail, Phone, RefreshCw, ShieldAlert, ShieldCheck, UserCircle2, Save, ImagePlus } from 'lucide-react';
import { useUserByEmail } from '../hooks/useUsers';
import { useAuthSession } from '../../../shared/hooks/useAuthSession';

type ViewUser = {
  id: string | number;
  avatarUrl?: string;
  username?: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  role?: string;
  lastActive?: string;
  createdAt: string;
  updatedAt?: string;
};

type ProfileDraft = {
  avatarUrl: string;
  username: string;
  fullName: string;
  phone: string;
};

const PROFILE_STORAGE_KEY = 'ui-user-service:custom-profile';
const UPLOAD_API_URL = import.meta.env.VITE_UPLOAD_API_URL || '/api/upload';
const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1';

const readProfileDraft = (): Partial<ProfileDraft> => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<ProfileDraft>) : {};
  } catch {
    return {};
  }
};

const getInitials = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 'ME';

  return trimmed
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const buildS3PublicUrl = (bucket: string, key: string) => {
  const encodedKey = key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `https://${bucket}.s3.${AWS_REGION}.amazonaws.com/${encodedKey}`;
};

export const UserListPage: React.FC = () => {
  const { accessToken, user: sessionUser, isReady } = useAuthSession();
  const currentUserEmail = (sessionUser?.email || '').trim().toLowerCase();
  const { data: profile, isLoading, error, refetch } = useUserByEmail(currentUserEmail);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProfileDraft>({
    avatarUrl: '',
    username: '',
    fullName: '',
    phone: '',
  });

  useEffect(() => {
    const stored = readProfileDraft();
    setDraft({
      avatarUrl: stored.avatarUrl || '',
      username: stored.username || '',
      fullName: stored.fullName || '',
      phone: stored.phone || '',
    });
  }, []);

  const normalizedProfile = useMemo(() => {
    if (!profile) return null;

    if (Array.isArray(profile)) {
      const exactMatch = profile.find((item) => {
        const email = String(item?.email || '').trim().toLowerCase();
        return email && email === currentUserEmail;
      });

      return exactMatch || profile[0] || null;
    }

    return profile;
  }, [profile, currentUserEmail]);

  if (import.meta.env.DEV) {
    try {
      // eslint-disable-next-line no-console
      console.info('[UserListPage] currentUserEmail=', currentUserEmail, 'profile=', profile, 'normalized=', normalizedProfile);
    } catch (e) {
      // ignore
    }
  }

  const fallbackUser: ViewUser | null = sessionUser
    ? {
        id: currentUserEmail || sessionUser.id || sessionUser.userId || sessionUser._id || 0,
        avatarUrl: sessionUser.avatarUrl,
        username: sessionUser.username || '',
        fullName: sessionUser.fullName || sessionUser.name || sessionUser.username || 'Tài khoản của tôi',
        email: sessionUser.email || '',
        phone: sessionUser.phoneNumber || sessionUser.phone || '',
        status: sessionUser.status === 'inactive' ? 'inactive' : 'active',
        role: sessionUser.role || 'USER',
        lastActive: 'Vừa xong',
        createdAt: sessionUser.createdAt || new Date().toISOString(),
        updatedAt: sessionUser.updatedAt,
      }
    : null;

  const displayUser = (normalizedProfile as ViewUser | undefined) || fallbackUser;

  const mergedUser = useMemo(() => {
    if (!displayUser) return null;

    return {
      ...displayUser,
      avatarUrl: draft.avatarUrl || displayUser.avatarUrl || '',
      username: draft.username || displayUser.username || '',
      fullName: draft.fullName || displayUser.fullName,
      phone: draft.phone || displayUser.phone || '',
    };
  }, [displayUser, draft.avatarUrl, draft.username, draft.fullName, draft.phone]);

  const persistProfile = (nextDraft: ProfileDraft, message: string) => {
    if (!displayUser) return;

    const nextProfile: ViewUser & { avatarUrl?: string } = {
      ...displayUser,
      avatarUrl: nextDraft.avatarUrl.trim(),
      username: nextDraft.username.trim(),
      fullName: nextDraft.fullName.trim() || displayUser.fullName,
      phone: nextDraft.phone.trim(),
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextDraft));

      const currentRawUser = window.localStorage.getItem('auth_user') || window.localStorage.getItem('authUser');
      const currentUser = currentRawUser ? JSON.parse(currentRawUser) : null;
      const sessionPayload = {
        ...(currentUser || {}),
        ...nextProfile,
        name: nextProfile.fullName,
        phoneNumber: nextProfile.phone,
        avatarUrl: nextProfile.avatarUrl,
      };

      window.localStorage.setItem('auth_user', JSON.stringify(sessionPayload));
      window.localStorage.setItem('authUser', JSON.stringify(sessionPayload));
    }

    setDraft(nextDraft);
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(null), 2500);
  };

  const handleSaveProfile = () => {
    if (!displayUser) return;

    setIsSaving(true);
    try {
      persistProfile(draft, 'Đã lưu thay đổi hồ sơ cá nhân.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File | null) => {
    if (!file || !displayUser) return;

    setIsUploadingAvatar(true);
    setSaveMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(UPLOAD_API_URL, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setSaveMessage(`Đang tải avatar lên S3... ${percentCompleted}%`);
          }
        },
      });

      if (!response.data?.success || !response.data.bucket || !response.data.key) {
        throw new Error(response.data?.error || 'Tải avatar thất bại');
      }

      const publicUrl = buildS3PublicUrl(response.data.bucket, response.data.key);
      persistProfile({ ...draft, avatarUrl: publicUrl }, 'Đã cập nhật avatar lên S3.');
    } catch (uploadError) {
      setSaveMessage('Không tải được avatar. Vui lòng thử lại.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const triggerAvatarPicker = () => {
    avatarInputRef.current?.click();
  };

  if (!isReady || (isLoading && !displayUser)) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-800 rounded-lg" />
        <div className="h-[420px] w-full bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (error && !displayUser) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-red-500/20 bg-red-500/5 rounded-2xl">
        <ShieldAlert className="text-red-400 mb-3" size={32} />
        <span className="text-sm font-bold text-red-400">Không tải được hồ sơ của bạn.</span>
        <span className="text-xs text-slate-500 mt-1">Vui lòng kiểm tra email đăng nhập hoặc tải lại trang.</span>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2"
        >
          <RefreshCw size={13} />
          Tải lại
        </button>
      </div>
    );
  }

  if (!displayUser) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-700/60 bg-slate-900/30 rounded-2xl">
        <UserCircle2 className="text-slate-400 mb-3" size={36} />
        <span className="text-sm font-bold text-slate-200">Chưa có thông tin người dùng hiện tại.</span>
        <span className="text-xs text-slate-500 mt-1">Hãy đăng nhập lại trong shell để đồng bộ theo email.</span>
      </div>
    );
  }

  const getGradient = (value: string | number) => {
    const gradients = [
      'from-violet-500 to-indigo-500',
      'from-pink-500 to-rose-500',
      'from-cyan-500 to-blue-500',
      'from-amber-500 to-orange-500',
      'from-emerald-500 to-teal-500',
    ];

    const index = typeof value === 'number'
      ? value % gradients.length
      : value.toString().split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % gradients.length;

    return gradients[index];
  };

  const normalizedRole = (displayUser.role || 'USER').toUpperCase();
  const isActive = displayUser.status !== 'inactive';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-violet-400">
          <BadgeCheck size={13} />
          Tài khoản của tôi
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Hồ sơ người dùng hiện tại</h2>
      </div>

      <div className="flex flex-col gap-6 animate-scale-in">
        <div className="flex flex-col w-full bg-[#131C2E] border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-600 to-pink-500" />

          <div className="h-32 bg-slate-950/40 border-b border-slate-800/40 relative flex items-end p-6 justify-between">
            <div className="flex items-end gap-5 translate-y-10">
              <button
                type="button"
                onClick={triggerAvatarPicker}
                className={`group relative h-24 w-24 rounded-2xl bg-gradient-to-tr ${getGradient(displayUser.id)} p-[2px] shadow-2xl`}
              >
                <div className="h-full w-full rounded-2xl bg-slate-950 flex items-center justify-center text-white text-3xl font-extrabold select-none overflow-hidden">
                  {mergedUser?.avatarUrl ? (
                    <img
                      src={mergedUser.avatarUrl}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(mergedUser?.fullName || displayUser.fullName)
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/0 text-white/0 transition-colors group-hover:bg-slate-950/45 group-hover:text-white">
                  <ImagePlus size={18} />
                </div>
              </button>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  void handleAvatarUpload(e.target.files?.[0] || null);
                  e.currentTarget.value = '';
                }}
              />

              <div className="flex flex-col gap-1 pb-2">
                <h3 className="text-lg font-bold text-white tracking-wide">{mergedUser?.fullName || displayUser.fullName}</h3>
                <span className="text-xs text-slate-500 font-semibold">@{mergedUser?.username || displayUser.username || displayUser.email || 'current-user'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${normalizedRole === 'ADMIN'
                ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                : 'bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#A876FA]'
                }`}>
                {normalizedRole}
              </span>
              <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]/55' : 'bg-slate-500'}`} />
            </div>
          </div>

          <div className="pt-16 p-8 flex flex-col gap-6 flex-1">
            <div className="bg-slate-950/20 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Edit2 className="text-violet-400" size={16} />
                <h3 className="text-xs font-bold text-white tracking-wide">Chỉnh sửa hồ sơ</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Avatar URL</span>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                    <ImagePlus size={14} className="text-slate-500" />
                    <input
                      value={draft.avatarUrl}
                      onChange={(e) => setDraft((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Username</span>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                    <span className="text-slate-500 text-xs">@</span>
                    <input
                      value={draft.username}
                      onChange={(e) => setDraft((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="username"
                      className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tên hiển thị</span>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                    <span className="text-slate-500 text-xs">Aa</span>
                    <input
                      value={draft.fullName}
                      onChange={(e) => setDraft((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Tên của bạn"
                      className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nền tảng</span>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                    <Phone size={14} className="text-slate-500" />
                    <input
                      value={draft.phone}
                      onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Ví dụ: google-oauth"
                      className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-[10px] text-slate-500">Avatar được tải lên S3, còn tên và nền tảng lưu cục bộ ở UI.</p>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving || isUploadingAvatar}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
                >
                  <Save size={14} />
                  {isSaving ? 'Đang lưu...' : isUploadingAvatar ? 'Đang tải avatar...' : 'Lưu hồ sơ'}
                </button>
              </div>

              {saveMessage && (
                <div className="text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
                  {saveMessage}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-slate-800/80 rounded-lg text-violet-400"><Mail size={16} /></div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Địa chỉ Email</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{displayUser.email || 'Chưa có email'}</span>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-slate-800/80 rounded-lg text-cyan-400"><Phone size={16} /></div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Nền tảng</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{displayUser.phone || 'Chưa có nền tảng'}</span>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-slate-800/80 rounded-lg text-pink-400"><Calendar size={16} /></div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Ngày gia nhập</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5">
                    {new Date(displayUser.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-slate-800/80 rounded-lg text-amber-400"><Clock size={16} /></div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Hoạt động cuối</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5">{mergedUser?.lastActive || displayUser.lastActive || 'Vừa xong'}</span>
                </div>
              </div>
            </div>

            {displayUser.updatedAt && (
              <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-auto gap-3 flex-wrap">
                <span className="flex items-center gap-1.5"><Activity size={12} />ID Hệ thống: {String(displayUser.id)}</span>
                <span>Cập nhật lần cuối: {new Date(displayUser.updatedAt).toLocaleString('vi-VN')}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
