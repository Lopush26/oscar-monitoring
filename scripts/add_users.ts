import { pool } from '../lib/db';
import bcrypt from 'bcryptjs';

async function addUsers() {
  const connection = await pool.getConnection();
  console.log('🌱 Adding 5 new users to database...');

  const usersToAdd = ['Rifaldi', 'Diba', 'Hizkia', 'Alya', 'Yazid'];
  const rawPassword = 'Pimnas39';

  try {
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    for (const username of usersToAdd) {
      // Check if user exists
      const [existing]: any = await connection.query(
        'SELECT id FROM Users WHERE LOWER(username) = LOWER(?)',
        [username]
      );

      if (existing.length > 0) {
        // Update password if user already exists
        await connection.query(
          'UPDATE Users SET password_hash = ? WHERE id = ?',
          [passwordHash, existing[0].id]
        );
        console.log(`✅ Updated existing user: ${username} (password: ${rawPassword})`);
      } else {
        // Insert new user with role 'dokter'
        await connection.query(
          'INSERT INTO Users (username, password_hash, role) VALUES (?, ?, ?)',
          [username, passwordHash, 'dokter']
        );
        console.log(`✅ Created new user: ${username} (role: dokter, password: ${rawPassword})`);
      }
    }

    // Print all users in DB
    const [allUsers]: any = await connection.query('SELECT id, username, role, created_at FROM Users ORDER BY id ASC');
    console.log('\n📋 Current Users in Database:');
    console.table(allUsers);

  } catch (error) {
    console.error('❌ Error adding users:', error);
  } finally {
    connection.release();
    process.exit(0);
  }
}

addUsers().catch(console.error);
