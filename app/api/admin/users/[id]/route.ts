// app/api/admin/users/[id]/route.ts
export const dynamic = 'force-dynamic'; 

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPool } from '@/lib/db';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { hashPassword } from '@/lib/auth';

const UpdateUserSchema = z.object({
  username: z.string().min(3).optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['admin', 'dokter']).optional(),
});

// GET /api/admin/users/[id]
export const GET = withAuth(async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  if (req.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const pool = getPool();
  const [rows] = await pool.query('SELECT id, username, role, created_at FROM Users WHERE id = ?', [id]);
  const users = rows as any[];
  if (!users.length) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(users[0]);
});

// PUT /api/admin/users/[id]
export const PUT = withAuth(async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  if (req.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { username, password, role } = UpdateUserSchema.parse(body);

  const pool = getPool();
  const updates: string[] = [];
  const values: any[] = [];

  if (username) { updates.push('username = ?'); values.push(username); }
  if (password) { updates.push('password_hash = ?'); values.push(await hashPassword(password)); }
  if (role) { updates.push('role = ?'); values.push(role); }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  values.push(id);
  await pool.query(`UPDATE Users SET ${updates.join(', ')} WHERE id = ?`, values);

  const [updated] = await pool.query('SELECT id, username, role FROM Users WHERE id = ?', [id]);
  return NextResponse.json((updated as any[])[0]);
});

// DELETE /api/admin/users/[id]
export const DELETE = withAuth(async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  if (req.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  if (Number(id) === req.user.userId) {
    return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
  }

  const pool = getPool();
  const [result] = await pool.query('DELETE FROM Users WHERE id = ?', [id]);
  if ((result as any).affectedRows === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
});