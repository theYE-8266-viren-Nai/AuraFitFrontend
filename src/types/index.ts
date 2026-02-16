// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'trainer' | 'member';
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  member?: Member;
  trainer?: Trainer;
}

// Member Types
export interface Member {
  id: number;
  user_id: number;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  created_at: string;
  updated_at: string;
  user?: User;
  memberships?: Membership[];
  workoutPlans?: WorkoutPlan[];
  payments?: Payment[];
  attendances?: Attendance[];
  activeMembership?: Membership;
}

// Trainer Types
export interface Trainer {
  id: number;
  user_id: number;
  specialization: string;
  created_at: string;
  updated_at: string;
  user?: User;
  workoutPlans?: WorkoutPlan[];
}

// Membership Types
export interface Membership {
  id: number;
  member_id: number;
  type: string;
  duration: number;
  fee: string | number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
  updated_at: string;
  member?: Member;
  payments?: Payment[];
}

// Payment Types
export interface Payment {
  id: number;
  member_id: number;
  membership_id?: number;
  amount: string | number;
  date: string;
  method: string;
  status: string;
  created_at: string;
  updated_at: string;
  member?: Member;
  membership?: Membership;
}

// Receipt Types
export interface Receipt {
  receipt_number: string;
  date: string;
  member_name: string;
  amount: string | number;
  method: string;
  status: string;
  membership_type: string;
}

// Attendance Types
export interface Attendance {
  id: number;
  member_id: number;
  date: string;
  check_in: string;
  check_out?: string;
  status: string;
  created_at: string;
  updated_at: string;
  member?: Member;
}

// Workout Plan Types
export interface WorkoutPlan {
  id: number;
  trainer_id: number;
  member_id: number;
  description: string;
  created_at: string;
  updated_at: string;
  trainer?: Trainer;
  member?: Member;
}

// Auth Response Types
export interface AuthResponse {
  user: User;
  token: string;
}

// Registration Data Types
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'trainer' | 'member';
  name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  specialization?: string;
}

// Login Data Types
export interface LoginData {
  email: string;
  password: string;
}

// Membership Status Response
export interface MembershipStatusResponse {
  member: Member;
  active_membership: Membership | null;
  has_active_membership: boolean;
}

// API Error Response
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
