// app/api/measurements/route.ts
export const dynamic = 'force-dynamic'; 

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPool } from '@/lib/db';
import { withAuth } from '@/lib/middleware';
import { MeasurementSchema, MeasurementQuerySchema } from '@/lib/validators';
import { generateTrackingId } from '@/lib/utils';

// ============================================
// POST: Kirim data dari Raspberry Pi
// ============================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mirna31, lactate_uM, il8_pg_mg, lat, lng } = MeasurementSchema.parse(body);

    const trackingId = generateTrackingId();
    const pool = getPool();

    await pool.execute(
      `INSERT INTO Measurements 
       (tracking_id, mirna31, lactate_uM, il8_pg_mg, status, lat_obfuscated, lng_obfuscated) 
       VALUES (?, ?, ?, ?, 'raw', ?, ?)`,
      [trackingId, mirna31, lactate_uM, il8_pg_mg, lat || null, lng || null]
    );

    return NextResponse.json(
      {
        status: 'ok',
        tracking_id: trackingId,
        message: 'Data received, waiting for verification',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Measurement POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============================================
// GET: List measurements (dengan filter)
// ============================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = 'SELECT * FROM Measurements';
    const params: any[] = [];

    if (status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const pool = getPool();
    const [rows] = await pool.query(query, params);

    // Hitung total untuk pagination
    let countQuery = 'SELECT COUNT(*) as total FROM Measurements';
    if (status !== 'all') {
      countQuery += ' WHERE status = ?';
    }
    const [countResult] = await pool.query(countQuery, status !== 'all' ? [status] : []);
    const total = (countResult as any[])[0]?.total || 0;

    return NextResponse.json({
      data: rows,
      pagination: {
        total,
        limit,
        offset,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Measurement GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}