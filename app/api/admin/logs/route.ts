// app/api/admin/logs/route.ts
export const dynamic = 'force-dynamic'; 

import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  if (req.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT al.*, u.username 
    FROM Audit_Logs al
    LEFT JOIN Users u ON al.user_id = u.id
    ORDER BY al.timestamp DESC
    LIMIT 100
  `);

  return NextResponse.json({ data: rows });
});