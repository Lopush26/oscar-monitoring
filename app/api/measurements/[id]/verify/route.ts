// app/api/measurements/[id]/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { withAuth } from '@/lib/middleware';
import { z } from 'zod';

const verifySchema = z.object({
  patient_id: z.string().min(1),
  status: z.enum(['verified', 'rejected']).default('verified'),
  notes: z.string().optional(),
});

export const POST = withAuth(async (req: any, user: any) => {
  try {
    // Ambil id dari URL
    const url = new URL(req.url);
    const id = url.pathname.split('/')[3]; // /api/measurements/[id]/verify

    const body = await req.json();
    const { patient_id, status, notes } = verifySchema.parse(body);

    const pool = getPool();
    await pool.query(
      `UPDATE Measurements 
       SET patient_id = ?, status = ?, verified_at = NOW(), verified_by = ?
       WHERE id = ?`,
      [patient_id, status, user.userId, id]
    );

    // Insert audit log
    await pool.query(
      `INSERT INTO Audit_Logs (measurement_id, user_id, action, previous_value)
       VALUES (?, ?, ?, ?)`,
      [id, user.userId, 'verify', JSON.stringify({ status, notes })]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});