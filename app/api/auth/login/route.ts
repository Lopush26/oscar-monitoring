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

    console.log('🔐 Login attempt:', username);

    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, username, password_hash, role FROM Users WHERE username = ?',
      [username]
    );

    const users = rows as any[];

    if (users.length === 0) {
      console.log('❌ User not found:', username);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      console.log('❌ Invalid password for:', username);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    console.log('✅ Password valid for:', username);

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    console.log('✅ Token generated successfully');

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: { id: user.id, username: user.username, role: user.role },
      },
      { status: 200 }
    );

    // 🔥 COOKIE SETTING - FINAL (SIMPLE & CORRECT)
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 jam
      path: '/',
      sameSite: 'lax',
    });

    console.log('🍪 Cookie set with path: /, secure:', process.env.NODE_ENV === 'production');

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}