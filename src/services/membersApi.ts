import api from '../lib/axios';
import { Member } from '../types';

export interface CreateMemberData {
  username: string;
  email: string;
  password: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
}

export interface UpdateMemberData {
  name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  username?: string;
  email?: string;
}

export const membersApi = {
  // Get all members (Admin only)
  getAll: async (): Promise<Member[]> => {
    const response = await api.get<Member[]>('/members');
    return response.data;
  },

  // Create new member (Admin only)
  create: async (data: CreateMemberData): Promise<Member> => {
    const response = await api.post<Member>('/members', data);
    return response.data;
  },

  // Get member by ID (Admin only)
  getById: async (id: number): Promise<Member> => {
    const response = await api.get<Member>(`/members/${id}`);
    return response.data;
  },

  // Update member (Admin only)
  update: async (id: number, data: UpdateMemberData): Promise<Member> => {
    const response = await api.put<Member>(`/members/${id}`, data);
    return response.data;
  },

  // Delete member (Admin only)
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/members/${id}`);
    return response.data;
  },

  // Get current member's profile
  getProfile: async (): Promise<Member> => {
    const response = await api.get<Member>('/members/profile');
    return response.data;
  },
};
