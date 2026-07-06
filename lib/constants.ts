// lib/constants.ts

export const API_PATHS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  MEASUREMENTS: '/api/measurements',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_LOGS: '/api/admin/logs',
  HEALTH: '/api/health',
} as const;

export const STATUS = {
  RAW: 'raw',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  DOKTOR: 'dokter',
} as const;

export const JWT_CONFIG = {
  EXPIRY: '7d',
  ALGORITHM: 'HS256',
} as const;

export const THINGSPEAK = {
  INTERVAL_SECONDS: 15,
  MAX_RETRY: 3,
} as const;

export const BIOMARKER_LIMITS = {
  MIRNA_MIN: 0,
  MIRNA_MAX: 20,
  LACTATE_MIN: 0,
  LACTATE_MAX: 10000,
  IL8_MIN: 0,
  IL8_MAX: 1000,
} as const;