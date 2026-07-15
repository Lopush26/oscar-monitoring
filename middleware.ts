// middleware.ts (di root proyek)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const PROTECTED_PAGES = ['/dashboard', '/verify'];
const PUBLIC_PATHS = ['/api/auth/login', '/api/health'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log untuk debugging
  console.log('🔐 [Global Middleware] Path:', pathname);

  // Public paths
  if (
    PUBLIC_PATHS.some(p => pathname.startsWith(p)) ||
    pathname === '/login' ||
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Protected pages
  const isProtectedPage = PROTECTED_PAGES.some(p => pathname.startsWith(p));
  if (isProtectedPage) {
    const token = request.cookies.get('token')?.value;
    console.log('🔐 [Global Middleware] Token exists?', !!token);

    if (!token) {
      console.log('🔐 [Global Middleware] No token, redirect to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const user = verifyToken(token);
    console.log('🔐 [Global Middleware] User verified?', !!user);

    if (!user) {
      console.log('🔐 [Global Middleware] Invalid token, redirect to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('✅ [Global Middleware] Token valid, allow access to:', pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};