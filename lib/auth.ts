// lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// 🔴 HAPUS FALLBACK! Pastikan JWT_SECRET selalu ada.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const JWT_EXPIRY = '7d';

export interface TokenPayload {
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
}

export function signToken(userId: number, role: string): string {
  console.log('🔐 Signing token for user:', userId, 'role:', role);
  console.log('🔐 JWT_SECRET exists?', !!JWT_SECRET);
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    console.log('🔐 Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log('✅ Token valid, userId:', decoded.userId, 'role:', decoded.role);
    return decoded;
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}