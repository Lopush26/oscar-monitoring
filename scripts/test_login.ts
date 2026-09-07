import { getPool } from '../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function testLogin() {
  console.log('🔍 Testing login logic for admin...');
  const pool = getPool();
  try {
    const username = 'admin';
    const password = 'Infor@)24';

    const [rows] = await pool.execute(
      'SELECT id, username, password_hash, role FROM Users WHERE LOWER(username) = LOWER(?)',
      [username]
    );

    const users = rows as any[];
    console.log('Database rows found:', users.length);
    if (users.length === 0) {
      console.error('❌ User not found!');
      return;
    }

    const user = users[0];
    console.log('User found:', user.username, 'Role:', user.role);

    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid?:', isValid);

    if (!isValid) {
      console.error('❌ Invalid password!');
      return;
    }

    const secret = process.env.JWT_SECRET || 'oscar_super_secret_jwt_key_2026';
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      secret,
      { expiresIn: '24h' }
    );

    console.log('✅ Token generated successfully:', token.slice(0, 20) + '...');
    console.log('🎉 LOGIN TEST PASSED 100%!');
  } catch (error) {
    console.error('❌ LOGIN TEST ERROR:', error);
  } finally {
    process.exit(0);
  }
}

testLogin();
