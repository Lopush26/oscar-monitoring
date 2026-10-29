import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // If token already has username, return it
  if (user.username) {
    return NextResponse.json(user);
  }

  // Fallback: fetch username from database if not in token
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT id, username, role FROM Users WHERE id = ?',
      [user.userId]
    );
    if (rows && rows.length > 0) {
      return NextResponse.json({
        userId: rows[0].id,
        username: rows[0].username,
        role: rows[0].role,
      });
    }
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
  }

  return NextResponse.json(user);
}
