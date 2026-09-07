import { getPool } from '../lib/db';

async function checkSchema() {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('DESCRIBE Measurements');
    console.table(rows.map((r: any) => ({ Field: r.Field, Type: r.Type })));
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

checkSchema();
