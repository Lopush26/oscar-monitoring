import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { withAuth } from '@/lib/middleware';

export const PATCH = withAuth(async (req: any, user: any) => {
  try {
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    // e.g. /api/measurements/123/demographics -> parts = ["", "api", "measurements", "123", "demographics"]
    // if basePath is something else it might differ, but Next.js router typically behaves such that the ID is just before demographics
    const idIndex = parts.indexOf('demographics') - 1;
    const id = parts[idIndex];

    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    const { age, gender } = body;

    const pool = getPool();
    const isIdNumeric = !isNaN(Number(id));

    await pool.query(
      'UPDATE Measurements SET age=?, gender=? WHERE id=? OR tracking_id=?',
      [age, gender, isIdNumeric ? Number(id) : null, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Demographics PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
