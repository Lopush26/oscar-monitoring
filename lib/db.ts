// lib/db.ts
import mysql from 'mysql2/promise';

type PoolType = any;
type ConnectionType = any;

let pool: PoolType | null = null;

export function getPool(): PoolType {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'oscar_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function getConnection(): Promise<ConnectionType> {
  const pool = getPool();
  return pool.getConnection();
}