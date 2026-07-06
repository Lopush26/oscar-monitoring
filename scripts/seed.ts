// scripts/seed.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'oscar_db',
};

async function seed() {
  const connection = await mysql.createConnection({
    host: DB_CONFIG.host,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    database: DB_CONFIG.database,
  });

  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const dokterPassword = await bcrypt.hash('dokter123', 10);

  await connection.execute(
    `INSERT INTO Users (username, password_hash, role) VALUES 
     ('admin', ?, 'admin'),
     ('dokter1', ?, 'dokter'),
     ('dokter2', ?, 'dokter')
     ON DUPLICATE KEY UPDATE username = username`,
    [adminPassword, dokterPassword, dokterPassword]
  );
  console.log('✅ Users seeded');

  await connection.execute(
    `INSERT INTO Measurements 
     (tracking_id, mirna31, lactate_uM, il8_pg_mg, status, ai_pred_class, ai_probability) 
     VALUES 
     ('OSC-DEMO-001', 8.5, 3200, 404.9, 'verified', 'OSCC', 99.7),
     ('OSC-DEMO-002', 1.2, 500, 65.9, 'verified', 'Normal', 2.1),
     ('OSC-DEMO-003', 3.4, 88.5, 36.5, 'raw', NULL, NULL)
     ON DUPLICATE KEY UPDATE tracking_id = tracking_id`,
  );
  console.log('✅ Measurements seeded');

  await connection.end();
  console.log('✅ Seeding completed!');
}

seed().catch(console.error);