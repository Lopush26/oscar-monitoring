// lib/db.ts
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Baca file CA certificate
const caCert = fs.readFileSync(path.join(process.cwd(), 'lib', 'ca.pem'), 'utf8');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Konfigurasi SSL dengan CA certificate
  ssl: {
    ca: caCert,
    rejectUnauthorized: false, // Production: wajib verifikasi
  },
});

export { pool };

export function getPool() {
  return pool;
}