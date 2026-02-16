import api from '../lib/axios';
import { AuthResponse, LoginData, RegisterData, User } from '../types';

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/register', data); // ⭐ ADD /api
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/login', data); // ⭐ ADD /api
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/logout'); // ⭐ ADD /api
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get<User>('/api/user'); // ⭐ ADD /api
    return response.data;
  },
};