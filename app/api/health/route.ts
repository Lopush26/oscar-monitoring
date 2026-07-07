// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  try {
    // Cek koneksi database
    const pool = getPool();
    const [result] = await pool.query('SELECT 1 as connected');
    const dbStatus = 'connected';

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'OSCAR API',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        host: process.env.DB_HOST || 'localhost',
        name: process.env.DB_NAME || 'oscar_db',
      },
      uptime: process.uptime(),
    }, { status: 200 });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      service: 'OSCAR API',
      database: {
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 503 });
  }
}