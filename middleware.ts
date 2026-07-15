// middleware.ts - FINAL
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const PROTECTED_PAGES = ['/dashboard', '/verify', '/pengukuran', '/admin', '/verifikasi'];
const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/logout', '/api/health'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log untuk debugging
  console.log(`🔍 [Middleware] Path: ${pathname}`);

  // Lewati file statis
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Lewati path publik
  if (
    PUBLIC_PATHS.some(p => pathname.startsWith(p)) ||
    pathname === '/login' ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Cek halaman yang dilindungi
  const isProtectedPage = PROTECTED_PAGES.some(p => pathname.startsWith(p));

  if (isProtectedPage) {
    // Ambil token dari cookie
    const token = request.cookies.get('token')?.value;

    console.log(`🍪 [Middleware] Token exists: ${!!token}`);
    console.log(`📨 [Middleware] Cookie header: ${request.headers.get('cookie') || 'none'}`);

    if (!token) {
      console.log('🚫 [Middleware] No token, redirect to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verifikasi token
    const user = verifyToken(token);
    console.log(`🔑 [Middleware] User verified: ${!!user}`);

    if (!user) {
      console.log('🚫 [Middleware] Invalid token, redirect to login');
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Hapus cookie yang tidak valid
      response.cookies.delete('token');
      return response;
    }

    console.log(`✅ [Middleware] Access granted to: ${pathname} by user: ${user.userId}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};