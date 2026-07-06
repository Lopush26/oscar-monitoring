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
    // FIX: Hapus <mysql2.RowDataPacket[]> karena pool bertipe any
    const [rows] = await pool.execute(
      'SELECT id, username, password_hash, role FROM Users WHERE username = ?',
      [username]
    );

    // Cast hasil query ke array of any (tidak mempengaruhi runtime)
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

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
      sameSite: 'lax',
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