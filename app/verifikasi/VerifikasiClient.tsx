// app/verifikasi/VerifikasiClient.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, ShieldAlert, Clock, Trash2, Eye, ArrowLeft } from 'lucide-react';

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

  const filterTabs = [
    { key: 'all' as const, label: `Semua (${data.length})`, icon: null },
    { key: 'raw' as const, label: `Perlu Verifikasi (${rawCount})`, icon: Clock },
    { key: 'verified' as const, label: `Terverifikasi (${verifiedCount})`, icon: Check },
    { key: 'rejected' as const, label: `Ditolak (${rejectedCount})`, icon: ShieldAlert, condition: rejectedCount > 0 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="badge badge-success"><Check size={12} className="mr-1" />Terverifikasi</span>;
      case 'rejected':
        return <span className="badge badge-danger"><ShieldAlert size={12} className="mr-1" />Ditolak</span>;
      default:
        return <span className="badge badge-warning"><Clock size={12} className="mr-1" />Perlu Verifikasi</span>;
    }
  };

  const getStatusAccent = (status: string) => {
    switch (status) {
      case 'verified':
        return 'emerald';
      case 'rejected':
        return 'red';
      default:
        return 'amber';
    }
  };

  return (
    <div className="section">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Verifikasi Dokter</h1>
          <p className="page-subtitle">Riwayat lengkap data pengukuran biomarker dan status verifikasi klinis</p>
        </div>
        <Link href="/dashboard">
          <Button variant="secondary" icon={<ArrowLeft size={16} />} iconPosition="left" size="sm">
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2.5 border-b border-border/80 pb-3 overflow-x-auto">
        {filterTabs.map((tab) => {
          if (tab.condition === false) return null;
          const isActive = filter === tab.key;
          const Icon = tab.icon;
          
          // Distinct colors matching image 4
          const getTabColorClass = () => {
            if (!isActive) {
              if (tab.key === 'raw') return 'bg-amber-100/70 text-amber-800 hover:bg-amber-100 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50';
              if (tab.key === 'verified') return 'bg-emerald-100/70 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50';
              if (tab.key === 'rejected') return 'bg-red-100/70 text-red-800 hover:bg-red-100 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/50';
              return 'bg-white/80 hover:bg-white text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
            }
            if (tab.key === 'raw') return 'bg-amber-500 text-white shadow-md border border-amber-600';
            if (tab.key === 'verified') return 'bg-emerald-600 text-white shadow-md border border-emerald-700';
            if (tab.key === 'rejected') return 'bg-red-600 text-white shadow-md border border-red-700';
            return 'bg-blue-600 text-white shadow-md border border-blue-700';
          };

          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ease-out whitespace-nowrap flex items-center gap-1.5 shadow-xs ${getTabColorClass()}`}
            >
              {Icon && <Icon size={14} strokeWidth={2.5} />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content List */}
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          <div className="spinner mx-auto mb-3" />
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
            const accentColor = getStatusAccent(item.status);

            return (
              <Card key={item.id} className="card-hover" variant="hover" accent={accentColor as any}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-sm font-bold text-foreground">
                          ID: {item.patient_id || item.tracking_id}
                        </span>
                        {getStatusBadge(item.status)}
                        <span className="text-xs text-muted-foreground font-mono">
                          {item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-'}
                        </span>
                      </div>

                      {/* Biomarkers */}
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
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
                        className={`inline-flex items-center justify-center font-bold px-4 py-2 rounded-xl text-xs transition-all duration-200 shadow-sm w-full sm:w-auto ${
                          item.status === 'raw'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25'
                        }`}
                      >
                        {item.status === 'raw' ? (
                          <>
                            <Clock size={14} className="mr-1.5" />
                            Verifikasi Case
                          </>
                        ) : (
                          <>
                            <Eye size={14} className="mr-1.5" />
                            Lihat Detail
                          </>
                        )}
                      </Link>

                      {role === 'admin' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          icon={<Trash2 size={13} />}
                          iconPosition="left"
                          onClick={() => handleDelete(item.tracking_id)}
                          className="w-full sm:w-auto"
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}