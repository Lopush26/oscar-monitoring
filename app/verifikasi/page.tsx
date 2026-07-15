// app/verifikasi/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function VerifikasiPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/measurements?status=raw', { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          setData(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching verification data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Verifikasi Dokter</h1>
          <p className="text-muted-foreground">Data yang menunggu verifikasi dokter</p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Kembali ke Dashboard
        </Link>
      </div>

      {loading ? (
        <div className="text-white">Memuat data...</div>
      ) : data.length === 0 ? (
        <div className="text-slate-400 text-center py-12">
          <p className="text-lg">✅ Tidak ada data yang perlu diverifikasi</p>
          <p className="text-sm mt-2">Semua data sudah diverifikasi atau belum ada data masuk.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data.map((item: any) => (
            <div key={item.id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-sm text-slate-300">{item.tracking_id}</p>
                <p className="text-xs text-slate-400">
                  {item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-'}
                </p>
                <div className="flex gap-4 mt-2 text-sm text-slate-400">
                  <span>miRNA-31: {item.mirna31 || '-'}</span>
                  <span>Laktat: {item.lactate_uM || '-'}</span>
                  <span>IL-8: {item.il8_pg_mg || '-'}</span>
                </div>
              </div>
              <Link
                href={`/verify/${item.tracking_id}`}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition"
              >
                Verifikasi
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}