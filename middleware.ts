// middleware.ts - Global Next.js Middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Protected routes (pages)
const PROTECTED_PAGES = ['/dashboard', '/verify'];

// API routes that need auth (handled separately in lib/middleware)
const PROTECTED_API = ['/api/measurements', '/api/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login, health, public assets
  const isPublic = 
    pathname === '/api/auth/login' ||
    pathname === '/api/health' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public');

  if (isPublic) {
    return NextResponse.next();
  }

  // Check if it's a protected page
  const isProtectedPage = PROTECTED_PAGES.some(p => pathname.startsWith(p));
  if (isProtectedPage) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Verify token (optional - can be done in page too)
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // API routes - token validation is done in each API route via withAuth
  // Just pass through, the route will handle validation

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};