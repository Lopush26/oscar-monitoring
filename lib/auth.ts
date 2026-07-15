// lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Pastikan JWT_SECRET selalu ada
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const JWT_EXPIRY = '7d';

export interface TokenPayload {
  userId: number;
  role: string;
}

export function signToken(userId: number, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    // Pastikan token diverifikasi dengan secret yang benar
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    // Log error untuk debugging di Vercel
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