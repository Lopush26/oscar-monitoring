// app/api/admin/users/route.ts
export const dynamic = 'force-dynamic'; 

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPool } from '@/lib/db';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { hashPassword } from '@/lib/auth';

const CreateUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['admin', 'dokter']).default('dokter'),
});

// GET /api/admin/users
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  if (req.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const pool = getPool();
  const [rows] = await pool.query('SELECT id, username, role, created_at FROM Users ORDER BY id DESC');
  return NextResponse.json(rows);
});

// POST /api/admin/users
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  if (req.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { username, password, role } = CreateUserSchema.parse(body);

  const hashed = await hashPassword(password);
  const pool = getPool();
  const [result] = await pool.query(
    'INSERT INTO Users (username, password_hash, role) VALUES (?, ?, ?)',
    [username, hashed, role]
  );

  return NextResponse.json({
    success: true,
    user: { id: (result as any).insertId, username, role },
  }, { status: 201 });
});