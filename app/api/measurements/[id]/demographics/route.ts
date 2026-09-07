// app/api/measurements/[id]/demographics/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { withAuth } from '@/lib/middleware';

export const PATCH = withAuth(async (req: any) => {
  try {
    // Semua user yang login (admin dan dokter) boleh update demographics
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const idIndex = parts.indexOf('demographics') - 1;
    const id = parts[idIndex];

    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    const { age, gender, location_name } = body;

    const pool = getPool();
    const isIdNumeric = !isNaN(Number(id));

    // Build dynamic SET clause
    const updates: string[] = [];
    const values: any[] = [];

    if (age !== undefined) { updates.push('age = ?'); values.push(age !== null ? Number(age) : null); }
    if (gender !== undefined) { updates.push('gender = ?'); values.push(gender || null); }
    if (location_name !== undefined) { updates.push('location_name = ?'); values.push(location_name || null); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // WHERE: id numeric or tracking_id
    values.push(isIdNumeric ? Number(id) : null);
    values.push(id);

    await pool.query(
      `UPDATE Measurements SET ${updates.join(', ')} WHERE id = ? OR tracking_id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // If location_name column doesn't exist yet, try without it
    if (error?.code === 'ER_BAD_FIELD_ERROR' && error?.message?.includes('location_name')) {
      try {
        const url = new URL(req.url);
        const parts = url.pathname.split('/');
        const idIndex = parts.indexOf('demographics') - 1;
        const id = parts[idIndex];
        const body = await req.json().catch(() => ({}));
        const { age, gender } = body;
        const pool = getPool();
        const isIdNumeric = !isNaN(Number(id));
        await pool.query(
          'UPDATE Measurements SET age = ?, gender = ? WHERE id = ? OR tracking_id = ?',
          [age ?? null, gender ?? null, isIdNumeric ? Number(id) : null, id]
        );
        return NextResponse.json({ success: true });
      } catch (e2) {
        console.error('Demographics PATCH fallback error:', e2);
      }
    }
    console.error('Demographics PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
