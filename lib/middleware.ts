// lib/middleware.ts - TANPA PROTEKSI
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export type AuthenticatedRequest = NextRequest & { user: any };

export function withAuth(handler: any) {
  return async (req: NextRequest, ...args: any[]) => {
    // ✅ LANGSUNG LANJUTKAN TANPA CEK TOKEN
    return handler(req, ...args);
  };
}