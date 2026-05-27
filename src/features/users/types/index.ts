export interface User {
  id: number;
  username?: string;
  fullName: string;
  email: string;
  phone: string; // matches phoneNumber in detail spec, let's map phone to phone/phoneNumber consistently
  status: 'active' | 'inactive';
  role?: string;
  lastActive?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserCreateInput {
  fullName: string;
  email: string;
  phone: string;
  username?: string;
  role?: string;
  status: 'active' | 'inactive';
}

export interface UserUpdateInput {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: 'active' | 'inactive';
}

export interface UserQueryFilters {
  email?: string;
  phone?: string;
  username?: string;
}
