import api from '../lib/axios';
import { Membership, MembershipStatusResponse } from '../types';

export interface CreateMembershipData {
  member_id: number;
  type: string;
  duration: number;
  fee: number;
}

// ⭐ Form data type (used for React state - no id needed)
export interface UpdateMembershipFormData {
  status?: 'active' | 'expired' | 'cancelled';
  end_date?: string;
}

// ⭐ API parameter type (includes id for the API call)
export interface UpdateMembershipData extends UpdateMembershipFormData {
  id: number;
}

export const membershipsApi = {
  // Get all memberships
  getAll: async (): Promise<Membership[]> => {
    const response = await api.get<Membership[]>('/memberships');
    return response.data;
  },

  // Create new membership
  create: async (data: CreateMembershipData): Promise<Membership> => {
    const response = await api.post<Membership>('/memberships', data);
    return response.data;
  },

  // Get membership by ID
  getById: async (id: number): Promise<Membership> => {
    const response = await api.get<Membership>(`/memberships/${id}`);
    return response.data;
  },

  // ⭐ FIXED: Update membership - now accepts single object parameter
  update: async (params: UpdateMembershipData): Promise<Membership> => {
    const { id, ...data } = params;
    const response = await api.put<Membership>(`/memberships/${id}`, data);
    return response.data;
  },

  // Delete membership
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/memberships/${id}`);
    return response.data;
  },

  // Get membership status (for current user)
  getStatus: async (): Promise<MembershipStatusResponse> => {
    const response = await api.get<MembershipStatusResponse>('/memberships/status');
    return response.data;
  },
};