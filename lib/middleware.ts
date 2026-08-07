// lib/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './auth';

export type AuthenticatedRequest = NextRequest & { user: any };

export function withAuth(handler: any) {
  return async (req: NextRequest, ...args: any[]) => {
    // Baca token dari cookie
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Teruskan user ke handler
    return handler(req, user, ...args);
  };
}