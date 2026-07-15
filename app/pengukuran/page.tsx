// app/pengukuran/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PengukuranPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/measurements', { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          setData(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching measurements:', error);
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
          <h1 className="text-3xl font-bold tracking-tight text-white">Data Pengukuran</h1>
          <p className="text-muted-foreground">Semua data pengukuran biomarker</p>
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
        <div className="text-slate-400">Belum ada data pengukuran.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 text-slate-400">Tracking ID</th>
                <th className="text-left py-2 text-slate-400">miRNA-31</th>
                <th className="text-left py-2 text-slate-400">Laktat (μM)</th>
                <th className="text-left py-2 text-slate-400">IL-8 (pg/mg)</th>
                <th className="text-left py-2 text-slate-400">Status</th>
                <th className="text-left py-2 text-slate-400">Prob.</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any) => (
                <tr key={item.id} className="border-b border-slate-800/50">
                  <td className="py-2 font-mono text-xs text-slate-300">{item.tracking_id}</td>
                  <td className="py-2 text-slate-300">{item.mirna31 || '-'}</td>
                  <td className="py-2 text-slate-300">{item.lactate_uM || '-'}</td>
                  <td className="py-2 text-slate-300">{item.il8_pg_mg || '-'}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {item.status || 'raw'}
                    </span>
                  </td>
                  <td className="py-2 text-slate-300">{item.ai_probability ? `${item.ai_probability}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}