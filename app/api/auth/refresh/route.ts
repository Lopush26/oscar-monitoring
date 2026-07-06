// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'No token provided' },
      { status: 401 }
    );
  }

  try {
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Generate new token
    const newToken = jwt.sign(
      { userId: payload.userId, role: payload.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json(
      { message: 'Token refreshed successfully' },
      { status: 200 }
    );

    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}