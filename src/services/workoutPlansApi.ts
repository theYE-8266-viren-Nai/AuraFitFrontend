import api from '../lib/axios';
import { WorkoutPlan } from '../types';

export interface CreateWorkoutPlanData {
  member_id: number;
  description: string;
  trainer_id?: number;
}

// ⭐ Form data type (used for React state - no id needed)
export interface UpdateWorkoutPlanFormData {
  description: string;
}

// ⭐ API parameter type (includes id for the API call)
export interface UpdateWorkoutPlanData extends UpdateWorkoutPlanFormData {
  id: number;
}

export const workoutPlansApi = {
  // Get all workout plans (filtered by trainer if trainer is logged in)
  getAll: async (): Promise<WorkoutPlan[]> => {
    const response = await api.get<WorkoutPlan[]>('/workout-plans');
    return response.data;
  },

  // Create new workout plan (Trainer)
  create: async (data: CreateWorkoutPlanData): Promise<WorkoutPlan> => {
    const response = await api.post<WorkoutPlan>('/workout-plans', data);
    return response.data;
  },

  // Get workout plan by ID
  getById: async (id: number): Promise<WorkoutPlan> => {
    const response = await api.get<WorkoutPlan>(`/workout-plans/${id}`);
    return response.data;
  },

  // Update workout plan (Trainer)
  // ⭐ Now accepts single object parameter with id
  update: async (params: UpdateWorkoutPlanData): Promise<WorkoutPlan> => {
    const { id, ...data } = params;
    const response = await api.put<WorkoutPlan>(`/workout-plans/${id}`, data);
    return response.data;
  },

  // Delete workout plan
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/workout-plans/${id}`);
    return response.data;
  },

  // Get current user's workout plans (Member)
  myPlans: async (): Promise<WorkoutPlan[]> => {
    const response = await api.get<WorkoutPlan[]>('/workout-plans/my-plans');
    return response.data;
  },
};