// app/verify/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getPool } from '@/lib/db';
import { VerifyForm } from '@/components/forms/VerifyForm';

interface VerifyPageProps {
  params: {
    id: string;
  };
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { id } = await params;

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
      created_at
     FROM Measurements 
     WHERE tracking_id = ? OR id = ?`,
    [id, isNaN(Number(id)) ? null : Number(id)]
  );

  const measurements = rows as any[];
  if (measurements.length === 0) {
    notFound();
  }

  const measurement = measurements[0];

  // Format tanggal
  const createdAt = new Date(measurement.created_at).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Verifikasi Data Pasien</h1>
        <p className="text-muted-foreground">
          Tracking ID: <span className="font-mono text-sm">{measurement.tracking_id}</span>
        </p>
        <p className="text-muted-foreground text-sm">
          Dikirim: {createdAt}
        </p>
      </div>

      {/* Kirim measurement.id sebagai props measurementId */}
      <VerifyForm measurementId={measurement.id.toString()} />
    </div>
  );
}