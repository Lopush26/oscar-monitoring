// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool } from '@/lib/db';

const LoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = LoginSchema.parse(body);

    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, username, password_hash, role FROM Users WHERE username = ?',
      [username]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: { id: user.id, username: user.username, role: user.role },
      },
      { status: 200 }
    );

    // 🔥 PERBAIKAN COOKIE
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 60 * 60 * 24, // 24 jam
      path: '/',
      sameSite: isProduction ? 'none' : 'lax', // 🔥 Kunci!
      domain: isProduction ? 'oscar-monitoringv1.vercel.app' : undefined,
    });

    console.log('✅ Cookie set:', {
      path: '/',
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      domain: isProduction ? 'oscar-monitoringv1.vercel.app' : 'localhost',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}