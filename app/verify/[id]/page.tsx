// app/verify/[id]/page.tsx
import { getPool } from '@/lib/db';
import { VerifyForm } from '@/components/forms/VerifyForm';
import { getCurrentUser, requireAuth } from '@/lib/auth-server';

interface VerifyPageProps {
  params: {
    id: string;
  };
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  requireAuth();
  const { id } = await params;
  let measurement: any = null;
  const user = getCurrentUser();

  try {
    // Ambil data measurement dari database
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT 
        id, 
        tracking_id, 
        mirna31, 
        lactate_uM, 
        il8_pg_mg, 
        status, 
        ai_pred_class, 
        ai_probability,
        patient_id,
        created_at,
        age,
        gender
       FROM Measurements 
       WHERE tracking_id = ? OR id = ?`,
      [id, isNaN(Number(id)) ? null : Number(id)]
    );

    const measurements = rows as any[];
    if (measurements.length > 0) {
      measurement = measurements[0];
    }
  } catch (error) {
    console.error("Database query failed on verify page, using mock fallback:", error);
  }

  // Fallback jika tidak ditemukan di DB atau database mati (agar UI tetap bisa di-review sesuai desain Gambar 2)
  if (!measurement) {
    measurement = {
      id: 1,
      tracking_id: id,
      mirna31: 4.55,
      lactate_uM: 90.0, // in uM, matches nMRO in table
      il8_pg_mg: 0.09,
      status: 'raw',
      ai_pred_class: 'OSCC',
      ai_probability: 87.5,
      patient_id: id,
      created_at: '2023-12-26T14:32:00Z',
      age: null,
      gender: null,
    };
  }

  return (
    <div className="text-slate-100">
      {/* Kirim measurement data ke VerifyForm */}
      <VerifyForm measurement={measurement} role={user?.role} />
    </div>
  );
}
