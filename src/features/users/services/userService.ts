import { axiosClient } from '../../../shared/api/axiosClient';
import { User, UserCreateInput, UserUpdateInput, UserQueryFilters } from '../types';

export const userService = {
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
    return {
      ...res,
      data: res.data.map(userService.mapUserToFrontend),
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
