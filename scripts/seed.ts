import { pool } from '../lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
  const connection = await pool.getConnection();
  console.log('🌱 Seeding database...');

  try {
    const adminPassword = await bcrypt.hash('admin123', 10);
    await connection.query(
      `INSERT IGNORE INTO Users (username, password_hash, role) VALUES (?, ?, ?)`,
      ['admin', adminPassword, 'admin']
    );
    console.log('✅ User admin created: admin / admin123');

    const dokterPassword = await bcrypt.hash('dokter123', 10);
    await connection.query(
      `INSERT IGNORE INTO Users (username, password_hash, role) VALUES 
       ('dokter1', ?, 'dokter'),
       ('dokter2', ?, 'dokter')`,
      [dokterPassword, dokterPassword]
    );
    console.log('✅ User dokter created: dokter1 / dokter123, dokter2 / dokter123');

    await connection.query(
      `INSERT IGNORE INTO Measurements 
       (tracking_id, mirna31, lactate_uM, il8_pg_mg, status, ai_pred_class, ai_probability) 
       VALUES 
       ('OSC-DEMO-001', 8.5, 3200, 404.9, 'verified', 'OSCC', 99.7),
       ('OSC-DEMO-002', 1.2, 500, 65.9, 'verified', 'Normal', 2.1),
       ('OSC-DEMO-003', 3.4, 88.5, 36.5, 'raw', NULL, NULL)`
    );
    console.log('✅ Sample measurements seeded');
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    connection.release();
  }
  console.log('✅ Seeding completed!');
}

seed().catch(console.error);