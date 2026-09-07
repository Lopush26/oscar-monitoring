// app/verifikasi/VerifikasiClient.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Check, ShieldAlert, Clock, Trash2, Eye } from 'lucide-react';

export default function VerifikasiClient() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [filter, setFilter] = useState<'all' | 'raw' | 'verified' | 'rejected'>('all');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/measurements?status=all', { credentials: 'include' });
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

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.role) setRole(d.role);
      })
      .catch(() => {});
    fetchData();
  }, []);

  const handleDelete = async (trackingId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    try {
      const res = await fetch(`/api/measurements/${trackingId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Hanya admin yang dapat menghapus data ini.');
      }
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredData = data.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const rawCount = data.filter((item) => item.status === 'raw').length;
  const verifiedCount = data.filter((item) => item.status === 'verified').length;
  const rejectedCount = data.filter((item) => item.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Verifikasi Dokter</h1>
          <p className="text-muted-foreground text-sm">Riwayat lengkap data pengukuran biomarker dan status verifikasi klinis</p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground text-sm font-medium rounded-lg transition-colors duration-200"
        >
          Kembali ke Dashboard
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:text-foreground'
          }`}
        >
          Semua Data ({data.length})
        </button>
        <button
          onClick={() => setFilter('raw')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            filter === 'raw'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 hover:text-foreground'
          }`}
        >
          <Clock size={14} />
          Membutuhkan Verifikasi ({rawCount})
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            filter === 'verified'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:text-foreground'
          }`}
        >
          <Check size={14} />
          Terverifikasi ({verifiedCount})
        </button>
        {rejectedCount > 0 && (
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'rejected'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400 hover:text-foreground'
            }`}
          >
            <ShieldAlert size={14} />
            Ditolak ({rejectedCount})
          </button>
        )}
      </div>

      {/* Content List */}
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Memuat data verifikasi...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-foreground font-semibold">Tidak ada data dalam kategori ini</p>
          <p className="text-sm text-muted-foreground mt-1">Coba ganti tab filter di atas untuk melihat data lainnya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredData.map((item: any) => {
            const isVerified = item.status === 'verified';
            const isRejected = item.status === 'rejected';
            const isRaw = item.status === 'raw';

            return (
              <Card
                key={item.id}
                className={`glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${
                  isVerified
                    ? 'border-emerald-200 dark:border-emerald-500/20'
                    : isRejected
                    ? 'border-red-200 dark:border-red-500/20'
                    : 'border-amber-200 dark:border-amber-500/20'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm font-bold text-foreground">
                      ID: {item.patient_id || item.tracking_id}
                    </span>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
                        <Check size={12} /> Terverifikasi
                      </span>
                    ) : isRejected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-500/30 text-xs font-semibold uppercase tracking-wider">
                        <ShieldAlert size={12} /> Ditolak
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
                        <Clock size={12} /> Require Verification
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground font-mono">
                      {item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-'}
                    </span>
                  </div>

                  {/* Biomarkers */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                    <span>miRNA-31: <strong className="text-foreground">{item.mirna31 || '-'} RQ</strong></span>
                    <span>Laktat: <strong className="text-foreground">{item.lactate_uM ? (item.lactate_uM / 1000).toFixed(2) : '-'} mM</strong></span>
                    <span>IL-8: <strong className="text-foreground">{item.il8_pg_mg || '-'} pg/mL</strong></span>
                  </div>

                  {/* AI Prediction */}
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span>AI Prediksi: <span className={item.ai_pred_class === 'OSCC' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}>{item.ai_pred_class || 'N/A'}</span></span>
                    <span>Probabilitas OSCC: <span className="text-foreground">{item.ai_probability ? Number(item.ai_probability).toFixed(1) + '%' : 'N/A'}</span></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Link
                    href={`/verify/${item.tracking_id}`}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold text-center text-white transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      isRaw
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isRaw ? (
                      <>
                        <Clock size={14} />
                        Verifikasi Case
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        Lihat Detail
                      </>
                    )}
                  </Link>

                  {role === 'admin' && (
                    <button
                      onClick={() => handleDelete(item.tracking_id)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 size={13} />
                      Hapus
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
