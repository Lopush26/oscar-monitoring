// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool } from '@/lib/db';

const LoginSchema = z.object({
  username: z.string().min(1, 'Username tidak boleh kosong'),
  password: z.string().min(1, 'Password tidak boleh kosong'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = LoginSchema.parse(body);

    console.log('🔐 Login attempt for:', username);

    const pool = getPool();
    // Gunakan LOWER(username) agar case-insensitive
    const [rows] = await pool.execute(
      'SELECT id, username, password_hash, role FROM Users WHERE LOWER(username) = LOWER(?)',
      [username]
    );

    const users = rows as any[];

    if (users.length === 0) {
      console.log('❌ User not found:', username);
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      console.log('❌ Invalid password for:', username);
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    console.log('✅ Password valid for:', username);

    const secret = process.env.JWT_SECRET || 'oscar_super_secret_jwt_key_2026';
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      secret,
      { expiresIn: '24h' }
    );

    console.log('✅ Token generated successfully for:', user.username);

    const response = NextResponse.json(
      {
        message: 'Login berhasil',
        user: { id: user.id, username: user.username, role: user.role },
      },
      { status: 200 }
    );

    // Set HTTP-only Cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 jam
      path: '/',
      sameSite: 'lax',
    });

    console.log('🍪 Cookie token set successfully');
    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors.map(e => e.message).join(', ') }, { status: 400 });
    }
    console.error('❌ Login API error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan pada server login' },
      { status: 500 }
    );
  }
}