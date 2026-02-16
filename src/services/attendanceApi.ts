import api from '../lib/axios';
import { Attendance } from '../types';

export interface CreateAttendanceData {
  member_id: number;
  date?: string;
  check_in?: string;
  status?: string;
}

// ⭐ Form data type (used for React state - no id needed)
export interface UpdateAttendanceFormData {
  check_out?: string;
  status?: string;
}

// ⭐ API parameter type (includes id for the API call)
export interface UpdateAttendanceData extends UpdateAttendanceFormData {
  id: number;
}

export const attendanceApi = {
  // Get all attendance records (Admin/Trainer)
  getAll: async (): Promise<Attendance[]> => {
    const response = await api.get<Attendance[]>('/attendance');
    return response.data;
  },

  // Create attendance record (Admin)
  create: async (data: CreateAttendanceData): Promise<Attendance> => {
    const response = await api.post<Attendance>('/attendance', data);
    return response.data;
  },

  // ⭐ FIXED: Update attendance record - now accepts single object parameter
  update: async (params: UpdateAttendanceData): Promise<Attendance> => {
    const { id, ...data } = params;
    const response = await api.put<Attendance>(`/attendance/${id}`, data);
    return response.data;
  },

  // Mark attendance (Member - check in/out)
  markAttendance: async (): Promise<Attendance> => {
    const response = await api.post<Attendance>('/attendance/mark');
    return response.data;
  },

  // Get current user's attendance records
  myAttendance: async (): Promise<Attendance[]> => {
    const response = await api.get<Attendance[]>('/attendance/my-attendance');
    return response.data;
  },
};