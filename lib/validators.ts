// lib/validators.ts
import { z } from 'zod';

// Login
export const LoginSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(3, 'Password minimal 3 karakter'),
});

// Measurement (dari RPi)
export const MeasurementSchema = z.object({
  mirna31: z.number().min(0),
  lactate_uM: z.number().min(0),
  il8_pg_mg: z.number().min(0),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Verify (dokter)
export const VerifySchema = z.object({
  patient_id: z.string().min(1, 'Patient ID wajib diisi'),
  status: z.enum(['verified', 'rejected']),
  notes: z.string().optional(),
});

// Query params
export const MeasurementQuerySchema = z.object({
  status: z.enum(['raw', 'verified', 'rejected']).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type MeasurementInput = z.infer<typeof MeasurementSchema>;
export type VerifyInput = z.infer<typeof VerifySchema>;
export type MeasurementQuery = z.infer<typeof MeasurementQuerySchema>;