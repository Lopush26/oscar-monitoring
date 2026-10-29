// app/api/measurements/[id]/verify/route.ts
export const dynamic = 'force-dynamic'; 

import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { z } from 'zod';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

const verifySchema = z.object({
  patient_id: z.string().min(1),
  status: z.enum(['verified', 'rejected']).default('verified'),
  notes: z.string().optional(),
});

export const POST = withAuth(async (
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params; // id = tracking_id (string)
    const body = await req.json();
    const { patient_id, status, notes } = verifySchema.parse(body);

    const pool = getPool();

    // 1. Ambil ID integer dari database berdasarkan tracking_id
    const [rows] = await pool.query(
      'SELECT id FROM Measurements WHERE tracking_id = ?',
      [id]
    );

    const measurements = rows as any[];
    if (measurements.length === 0) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    const measurementId = measurements[0].id;
    const userId = req.user?.userId || null;

    // 2. UPDATE menggunakan tracking_id
    await pool.query(
      `UPDATE Measurements 
       SET patient_id = ?, status = ?, verified_at = NOW(), verified_by = ?, notes = ?
       WHERE tracking_id = ?`,
      [patient_id, status, userId, notes || null, id]
    );

    // 3. Audit log
    await pool.query(
      `INSERT INTO Audit_Logs (measurement_id, user_id, action, previous_value)
       VALUES (?, ?, ?, ?)`,
      [measurementId, userId, 'verify', JSON.stringify({ status, notes })]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }
    console.error('❌ Verify error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
});