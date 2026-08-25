import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken, TokenPayload } from './auth';

export function requireAuth(): TokenPayload {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    redirect('/login');
  }

  return decoded;
}

export function requireAdmin(): TokenPayload {
  const user = requireAuth();
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }
  return user;
}

export function getCurrentUser(): TokenPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

