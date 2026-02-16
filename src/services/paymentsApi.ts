import api from '../lib/axios';
import { Payment, Receipt } from '../types';

export interface CreatePaymentData {
  member_id: number;
  membership_id?: number;
  amount: number;
  method: string;
  status?: string;
}

export const paymentsApi = {
  // Get all payments
  getAll: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/payments');
    return response.data;
  },

  // Create new payment
  create: async (data: CreatePaymentData): Promise<Payment> => {
    const response = await api.post<Payment>('/payments', data);
    return response.data;
  },

  // Get payment by ID
  getById: async (id: number): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  // Generate receipt for payment
  generateReceipt: async (id: number): Promise<Receipt> => {
    const response = await api.get<Receipt>(`/payments/${id}/receipt`);
    return response.data;
  },

  // Get current user's payments
  myPayments: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/payments/my-payments');
    return response.data;
  },
};
