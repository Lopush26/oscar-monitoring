// app/api/measurements/[id]/route.ts
export const dynamic = 'force-dynamic'; 

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPool } from '@/lib/db';
import { withAuth } from '@/lib/middleware';

// Schema untuk PATCH update
const UpdateSchema = z.object({
  patient_id: z.string().optional(),
  status: z.enum(['raw', 'verified', 'rejected']).optional(),
  notes: z.string().optional(),
});

// ============================================
// GET: Ambil detail satu measurement
// ============================================
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const pool = getPool();

    // Cari berdasarkan id atau tracking_id
    const [rows] = await pool.query(
      `SELECT * FROM Measurements WHERE id = ? OR tracking_id = ?`,
      [isNaN(Number(id)) ? null : Number(id), id]
    );

    const measurements = rows as any[];
    if (measurements.length === 0) {
      return NextResponse.json({ error: 'Measurement not found' }, { status: 404 });
    }

    return NextResponse.json(measurements[0]);
  } catch (error) {
    console.error('Measurement GET detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============================================
// PATCH: Update measurement (dengan auth)
// ============================================
export const PATCH = withAuth(async (req: any, user: any) => {
  try {
    // Parse params
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const body = await req.json();
    const { patient_id, status, notes } = UpdateSchema.parse(body);

    const pool = getPool();

    // Cek apakah measurement ada
    const [existing] = await pool.query(
      'SELECT * FROM Measurements WHERE id = ?',
      [id]
    );
    const existingData = (existing as any[])[0];
    if (!existingData) {
      return NextResponse.json({ error: 'Measurement not found' }, { status: 404 });
    }

    // Buat query update dinamis
    const updates: string[] = [];
    const values: any[] = [];

    if (patient_id !== undefined) {
      updates.push('patient_id = ?');
      values.push(patient_id);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (status === 'verified' || status === 'rejected') {
      updates.push('verified_at = NOW()');
      updates.push('verified_by = ?');
      values.push(user.userId);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(id);
    const query = `UPDATE Measurements SET ${updates.join(', ')} WHERE id = ?`;
    await pool.query(query, values);

    // Insert audit log
    await pool.query(
      `INSERT INTO Audit_Logs (measurement_id, user_id, action, previous_value)
       VALUES (?, ?, ?, ?)`,
      [id, user.userId, 'update', JSON.stringify({ patient_id, status, notes })]
    );

    // Ambil data terbaru
    const [updated] = await pool.query(
      'SELECT * FROM Measurements WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: (updated as any[])[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Measurement PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// ============================================
// DELETE: Hapus measurement (admin only)
// ============================================
export const DELETE = withAuth(async (req: any, user: any) => {
  try {
    // Cek role admin
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const pool = getPool();

    const [result] = await pool.query(
      'DELETE FROM Measurements WHERE id = ?',
      [id]
    );

    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return NextResponse.json({ error: 'Measurement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Measurement DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});