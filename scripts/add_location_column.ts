import { getPool } from '../lib/db';

async function addLocationColumn() {
  const pool = getPool();
  try {
    const [cols]: any = await pool.query('SHOW COLUMNS FROM Measurements LIKE "location_name"');
    if (cols.length === 0) {
      await pool.query('ALTER TABLE Measurements ADD COLUMN location_name VARCHAR(255) DEFAULT NULL');
      console.log('✅ Added location_name column to Measurements table!');
    } else {
      console.log('ℹ️ location_name column already exists.');
    }
  } catch (error) {
    console.error('Error adding location_name column:', error);
  } finally {
    process.exit(0);
  }
}

addLocationColumn();
