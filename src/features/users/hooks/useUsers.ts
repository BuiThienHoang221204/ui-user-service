import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { UserCreateInput, UserUpdateInput } from '../types';

// Global reactive check for Mock Mode status (always false for real API integration)
export const checkIsMockMode = (): boolean => {
  return false;
};

export const setMockModeActive = (_active: boolean) => {
  // no-op
};

export const useUsersList = (filters?: { email?: string; phone?: string; username?: string }) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const res = await userService.getUsers(filters);
      return res.data;
    },
    retry: 1,
  });
};

export const useUserDetail = (id: string | number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await userService.getUserById(id);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useUserByEmail = (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  return useQuery({
    queryKey: ['user', 'email', normalizedEmail],
    queryFn: async () => {
      const res = await userService.getUserByEmail(normalizedEmail);
      return res.data;
    },
    enabled: !!normalizedEmail,
  });
};

export const useCreateUser = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserCreateInput) => {
      const res = await userService.createUser(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};

export const useUpdateUser = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UserUpdateInput }) => {
      const res = await userService.updateUser(id, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};

export const useDeleteUser = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await userService.deleteUser(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};
