import { axiosClient } from '../../../shared/api/axiosClient';
import { User, UserCreateInput, UserUpdateInput, UserQueryFilters } from '../types';

export const userService = {
  normalizeEmail: (value: string) => value.trim().toLowerCase(),

  matchesEmail: (user: any, email: string) => {
    if (!user || !email) return false;

    return String(user.email || '').trim().toLowerCase() === email;
  },

  mapUserToFrontend: (user: any): User => {
    if (!user) return user;
    
    // Determine professional role based on user properties:
    // 1. If username or email indicates administrative privileges -> ADMIN
    // 2. If status is active -> PRO MEMBER
    // 3. Otherwise -> STARTER
    const lowerUsername = user.username?.toLowerCase() || '';
    const lowerEmail = user.email?.toLowerCase() || '';
    const isSystemAdmin = lowerUsername.includes('admin') || lowerEmail.includes('admin');
    
    const determinedRole = isSystemAdmin 
      ? 'ADMIN' 
      : (user.status === 'active' ? 'PRO MEMBER' : 'STARTER');

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phoneNumber || user.phone || '',
      status: user.status === 'inactive' ? 'inactive' : 'active',
      role: user.role || determinedRole,
      lastActive: user.lastActive || 'Vừa xong',
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt,
    };
  },

  mapInputToBackend: (data: any): any => {
    if (!data) return data;
    const backendData: any = {};
    if (data.username !== undefined) backendData.username = data.username;
    if (data.email !== undefined) backendData.email = data.email;
    if (data.fullName !== undefined) backendData.fullName = data.fullName;
    if (data.phone !== undefined) backendData.phoneNumber = data.phone;
    return backendData;
  },

  getUsers: async (params?: UserQueryFilters) => {
    const res = await axiosClient.get<any[]>('/users', { params });
    const users = res.data.map(userService.mapUserToFrontend);

    return {
      ...res,
      data: params?.email
        ? users.filter((user) => userService.matchesEmail(user, userService.normalizeEmail(params.email || '')))
        : users,
    };
  },

  getUserByEmail: async (email: string) => {
    const normalizedEmail = userService.normalizeEmail(email);
    if (!normalizedEmail) {
      return {
        data: null,
      };
    }

    const res = await axiosClient.get<any[]>('/users', { params: { email: normalizedEmail } });
    const mappedUsers = res.data.map(userService.mapUserToFrontend);
    const exactMatch = mappedUsers.find((user) => userService.matchesEmail(user, normalizedEmail)) || null;

    if (import.meta.env.DEV) {
      console.info(
        `[userService] email lookup ${normalizedEmail} -> ${exactMatch ? 'match' : 'empty'} (${mappedUsers.length} row(s) returned)`
      );
    }

    return {
      ...res,
      data: exactMatch,
    };
  },
  
  getUserById: async (id: string | number) => {
    const res = await axiosClient.get<any>(`/users/${id}`);
    return {
      ...res,
      data: userService.mapUserToFrontend(res.data),
    };
  },
  
  createUser: async (data: UserCreateInput) => {
    const payload = userService.mapInputToBackend(data);
    const res = await axiosClient.post<any>('/users', payload);
    return {
      ...res,
      data: userService.mapUserToFrontend(res.data),
    };
  },
  
  updateUser: async (id: string | number, data: UserUpdateInput) => {
    const payload = userService.mapInputToBackend(data);
    const res = await axiosClient.put<any>(`/users/${id}`, payload);
    return {
      ...res,
      data: userService.mapUserToFrontend(res.data),
    };
  },
  
  deleteUser: (id: string | number) => 
    axiosClient.delete(`/users/${id}`),
};
