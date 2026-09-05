import { pool } from '../lib/db';
import bcrypt from 'bcryptjs';

async function updateAdminPassword() {
  const connection = await pool.getConnection();
  const newPassword = 'Infor@)24';
  
  try {
    console.log('🔄 Updating password for user "admin"...');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    const [result]: any = await connection.query(
      'UPDATE Users SET password_hash = ? WHERE LOWER(username) = ?',
      [passwordHash, 'admin']
    );

    if (result.affectedRows > 0) {
      console.log(`✅ Admin password successfully updated to "${newPassword}"!`);
    } else {
      console.log('⚠️ User "admin" not found. Creating admin user...');
      await connection.query(
        'INSERT INTO Users (username, password_hash, role) VALUES (?, ?, ?)',
        ['admin', passwordHash, 'admin']
      );
      console.log(`✅ Admin user created with password "${newPassword}"!`);
    }

    const [rows]: any = await connection.query('SELECT id, username, role FROM Users WHERE LOWER(username) = ?', ['admin']);
    console.table(rows);
  } catch (error) {
    console.error('❌ Error updating admin password:', error);
  } finally {
    connection.release();
    process.exit(0);
  }
}

updateAdminPassword().catch(console.error);
