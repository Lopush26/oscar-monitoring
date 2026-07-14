import { pool } from '../lib/db';

async function migrate() {
  const connection = await pool.getConnection();
  console.log('🔍 Running migrations...');

  const queries = [
    `CREATE TABLE IF NOT EXISTS Users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin', 'dokter') DEFAULT 'dokter',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS Measurements (
      id INT PRIMARY KEY AUTO_INCREMENT,
      tracking_id VARCHAR(100) UNIQUE NOT NULL,
      mirna31 DECIMAL(10,4),
      lactate_uM DECIMAL(10,2),
      il8_pg_mg DECIMAL(10,2),
      patient_id VARCHAR(50) NULL,
      status ENUM('raw', 'verified', 'rejected') DEFAULT 'raw',
      ai_pred_class VARCHAR(20),
      ai_probability DECIMAL(5,2),
      lat_obfuscated DECIMAL(10,8) NULL,
      lng_obfuscated DECIMAL(10,8) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      verified_at TIMESTAMP NULL,
      verified_by INT NULL,
      notes TEXT NULL,
      FOREIGN KEY (verified_by) REFERENCES Users(id)
    )`,

    `CREATE TABLE IF NOT EXISTS Audit_Logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      measurement_id INT,
      user_id INT,
      action VARCHAR(50),
      previous_value JSON,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (measurement_id) REFERENCES Measurements(id),
      FOREIGN KEY (user_id) REFERENCES Users(id)
    )`,

    // Perbaikan: tanpa IF NOT EXISTS
    `CREATE INDEX idx_status ON Measurements(status)`,
    `CREATE INDEX idx_tracking ON Measurements(tracking_id)`,
    `CREATE INDEX idx_created ON Measurements(created_at DESC)`,
  ];

  for (const query of queries) {
    try {
      await connection.query(query);
      console.log(`✅ ${query.substring(0, 60)}...`);
    } catch (error: any) {
      // Jika error karena index sudah ada, abaikan
      if (error.message && error.message.includes('Duplicate key name')) {
        console.log(`⚠️ Index sudah ada: ${query.substring(0, 50)}...`);
      } else {
        console.error(`❌ Error: ${error}`);
      }
    }
  }

  connection.release();
  console.log('✅ Migration completed!');
}

migrate().catch(console.error);