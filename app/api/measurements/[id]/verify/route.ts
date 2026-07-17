// app/api/measurements/[id]/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { z } from 'zod';

const verifySchema = z.object({
  patient_id: z.string().min(1),
  status: z.enum(['verified', 'rejected']).default('verified'),
  notes: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // id = tracking_id (string)
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

    // 2. UPDATE menggunakan tracking_id (bukan id)
    await pool.query(
      `UPDATE Measurements 
       SET patient_id = ?, status = ?, verified_at = NOW(), notes = ?
       WHERE tracking_id = ?`,
      [patient_id, status, notes || null, id] // ← PASTIKAN tracking_id!
    );

    // 3. Audit log menggunakan measurementId (integer)
    await pool.query(
      `INSERT INTO Audit_Logs (measurement_id, action, previous_value)
       VALUES (?, ?, ?)`,
      [measurementId, 'verify', JSON.stringify({ status, notes })]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }
    console.error('❌ Verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}