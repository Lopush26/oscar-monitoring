// lib/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, TokenPayload } from './auth';

export type AuthenticatedRequest = NextRequest & {
  user: TokenPayload;
};

/**
 * Middleware untuk melindungi API routes dengan JWT.
 * Mendukung handler dengan parameter tambahan (misal: params).
 */
export function withAuth(
  handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    console.log('🔐 [withAuth] Request path:', req.nextUrl.pathname);
    
    const authHeader = req.headers.get('authorization');
    console.log('🔐 [withAuth] Authorization header exists?', !!authHeader);
    
    if (!authHeader) {
      console.warn('⚠️ [withAuth] No authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.warn('⚠️ [withAuth] No token in authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      console.warn('⚠️ [withAuth] Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('✅ [withAuth] User authenticated:', user.userId, user.role);
    const reqWithUser = req as AuthenticatedRequest;
    reqWithUser.user = user;
    return handler(reqWithUser, ...args);
  };
}