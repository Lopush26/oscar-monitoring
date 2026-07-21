// app/pengukuran/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Data Pengukuran</h1>
          <p className="text-muted-foreground">Semua data pengukuran biomarker</p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          Kembali ke Dashboard
        </Link>
      </div>

      <Card className="glass-card p-6">
        {loading ? (
          <div className="text-muted-foreground">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="text-muted-foreground">Belum ada data pengukuran.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-semibold">Tracking ID</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">miRNA-31</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Laktat (μM)</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">IL-8 (pg/mg)</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Status</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Prob.</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-mono text-xs text-foreground">{item.tracking_id}</td>
                    <td className="py-3 text-foreground">{item.mirna31 || '-'}</td>
                    <td className="py-3 text-foreground">{item.lactate_uM || '-'}</td>
                    <td className="py-3 text-foreground">{item.il8_pg_mg || '-'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : item.status === 'rejected'
                          ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      } transition-colors duration-300`}>
                        {item.status || 'raw'}
                      </span>
                    </td>
                    <td className="py-3 text-foreground">{item.ai_probability ? `${item.ai_probability}%` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}