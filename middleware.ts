// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const PROTECTED_PAGES = ['/dashboard', '/verify', '/pengukuran', '/admin', '/verifikasi'];
const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/logout', '/api/health'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log untuk debugging (akan muncul di Vercel Functions Log)
  console.log(`🔍 [Middleware] Path: ${pathname}`);

  // Lewati path publik
  if (
    PUBLIC_PATHS.some(p => pathname.startsWith(p)) ||
    pathname === '/login' ||
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public') ||
    pathname.includes('.') // File statis (favicon, images, dll)
  ) {
    return NextResponse.next();
  }

  // Cek halaman yang dilindungi
  const isProtectedPage = PROTECTED_PAGES.some(p => pathname.startsWith(p));
  
  if (isProtectedPage) {
    // Ambil token dari cookie
    const token = request.cookies.get('token')?.value;
    console.log(`🍪 [Middleware] Token exists: ${!!token}`);

    if (!token) {
      console.log('🚫 [Middleware] No token, redirect to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verifikasi token
    const user = verifyToken(token);
    console.log(`🔑 [Middleware] Token valid: ${!!user}`);

    if (!user) {
      console.log('🚫 [Middleware] Invalid token, redirect to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('✅ [Middleware] Access granted to:', pathname);
  }

  return NextResponse.next();
}

// Konfigurasi matcher - middleware akan berjalan di semua path kecuali yang disebutkan
export const config = {
  matcher: [
    /*
     * Match semua request path kecuali:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};