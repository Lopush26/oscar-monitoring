// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`🔍 [Middleware] Path: ${pathname} (mode: DISABLED)`);

  // Lewati path publik
  if (
    pathname === '/login' ||
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // ⚠️ MIDDLEWARE DINONAKTIFKAN SEMENTARA UNTUK DEBUG
  // Semua path lain diizinkan tanpa verifikasi token
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};