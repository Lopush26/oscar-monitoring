// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const PROTECTED_PAGES = ['/dashboard', '/verify'];
const PUBLIC_PATHS = ['/api/auth/login', '/api/health'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log 1: Path yang diakses
  console.log(`🔍 [Middleware] Mengakses path: ${pathname}`);

  // Lewati path publik
  if (
    PUBLIC_PATHS.some(p => pathname.startsWith(p)) ||
    pathname === '/login' ||
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Cek halaman yang dilindungi
  const isProtectedPage = PROTECTED_PAGES.some(p => pathname.startsWith(p));
  if (isProtectedPage) {
    // Log 2: Cek isi cookie
    const token = request.cookies.get('token')?.value;
    console.log(`🍪 [Middleware] Token dari cookie: ${token ? 'Ada' : 'TIDAK ADA'}`);

    if (!token) {
      console.log('🚫 [Middleware] Token tidak ditemukan, redirect ke login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Log 3: Hasil verifikasi token
    const user = verifyToken(token);
    console.log(`🔑 [Middleware] Hasil verifikasi token: ${user ? 'BERHASIL' : 'GAGAL'}`);

    if (!user) {
      console.log('🚫 [Middleware] Token tidak valid, redirect ke login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('✅ [Middleware] Token valid, akses diizinkan');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};