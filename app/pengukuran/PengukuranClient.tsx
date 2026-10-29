// app/pengukuran/PengukuranClient.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function PengukuranClient() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');

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

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
       if (d && d.role) setRole(d.role);
    }).catch(() => {});
    fetchData();
  }, []);

  const handleDelete = async (trackingId: string) => {
    if (!confirm("Are you sure you want to delete this data?")) return;
    try {
      const res = await fetch(`/api/measurements/${trackingId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Only admins can perform this action or delete failed.");
      }
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="badge badge-success">Terverifikasi</span>;
      case 'rejected':
        return <span className="badge badge-danger">Ditolak</span>;
      default:
        return <span className="badge badge-warning">Perlu Verifikasi</span>;
    }
  };

  return (
    <div className="section">
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Pengukuran</h1>
          <p className="page-subtitle">Semua data pengukuran biomarker</p>
        </div>
        <Link href="/dashboard">
          <Button variant="secondary" icon={<ArrowLeft size={16} />} iconPosition="left" size="sm">
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>

      <Card className="card-hover" variant="hover" accent="blue">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Daftar Pengukuran</CardTitle>
            <span className="badge badge-muted">{data.length} total</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">
              <div className="spinner mx-auto mb-3" />
              <p className="text-sm">Memuat data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>Belum ada data pengukuran.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="table">
                <thead>
                  <tr>
                    <th className="pl-6 pr-4">Tracking ID</th>
                    <th className="px-4">miRNA-31</th>
                    <th className="px-4">Laktat (μM)</th>
                    <th className="px-4">IL-8 (pg/mL)</th>
                    <th className="px-4">Status</th>
                    <th className="px-4">Prob.</th>
                    <th className="pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any) => (
                    <tr key={item.id}>
                      <td className="pl-6 pr-4">
                        <span className="font-mono text-xs text-foreground">{item.tracking_id}</span>
                      </td>
                      <td className="px-4 text-foreground">{item.mirna31 || '-'}</td>
                      <td className="px-4 text-foreground">{item.lactate_uM || '-'}</td>
                      <td className="px-4 text-foreground">{item.il8_pg_mg || '-'}</td>
                      <td className="px-4">{getStatusBadge(item.status || 'raw')}</td>
                      <td className="px-4 text-foreground">
                        {item.ai_probability ? `${Number(item.ai_probability).toFixed(1)}%` : '-'}
                      </td>
                      <td className="pr-6 text-right">
                        {role === 'admin' ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            icon={<Trash2 size={13} />}
                            iconPosition="left"
                            onClick={() => handleDelete(item.tracking_id)}
                          >
                            Hapus
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}