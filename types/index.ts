// types/index.ts
// Type definitions for OSCAR System

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'dokter';
  created_at: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserResponse {
  token: string;
  user: User;
}

export interface Measurement {
  id: number;
  tracking_id: string;
  mirna31: number;
  lactate_uM: number;
  il8_pg_mg: number;
  patient_id: string | null;
  status: 'raw' | 'verified' | 'rejected';
  ai_pred_class: 'OSCC' | 'Normal' | null;
  ai_probability: number | null;
  lat_obfuscated: number | null;
  lng_obfuscated: number | null;
  created_at: string;
  verified_at: string | null;
  verified_by: number | null;
}

export interface MeasurementRequest {
  mirna31: number;
  lactate_uM: number;
  il8_pg_mg: number;
  lat?: number;
  lng?: number;
}

export interface MeasurementResponse {
  status: string;
  tracking_id: string;
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface MeasurementQuery {
  status?: 'raw' | 'verified' | 'rejected';
  limit?: number;
  offset?: number;
}

export interface VerifyRequest {
  patient_id: string;
  status: 'verified' | 'rejected';
  notes?: string;
}

export interface DashboardStats {
  total: number;
  oscc_count: number;
  normal_count: number;
  pending_verification: number;
}

export interface BiomarkerData {
  mirna31: number;
  lactate_uM: number;
  il8_pg_mg: number;
}

export interface ChartData {
  timestamp: string;
  prob: number;
  status: number;
  mirna: number;
  lactate: number;
  il8: number;
}

export interface DbUser {
  id: number;
  username: string;
  password_hash: string;
  role: string;
  created_at: Date;
}

export interface DbMeasurement {
  id: number;
  tracking_id: string;
  mirna31: number;
  lactate_uM: number;
  il8_pg_mg: number;
  patient_id: string | null;
  status: string;
  ai_pred_class: string | null;
  ai_probability: number | null;
  lat_obfuscated: number | null;
  lng_obfuscated: number | null;
  created_at: Date;
  verified_at: Date | null;
  verified_by: number | null;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      JWT_SECRET: string;
      NEXT_PUBLIC_API_URL: string;
    }
  }
}

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type StatusType = 'raw' | 'verified' | 'rejected';
export type RoleType = 'admin' | 'dokter';
export type PredClass = 'OSCC' | 'Normal';