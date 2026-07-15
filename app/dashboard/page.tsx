// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardGrid } from '@/app/dashboard/components/DashboardGrid';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('📡 Fetching dashboard data...');
        const res = await fetch('/api/measurements', {
          credentials: 'include', // Kirim cookie
        });

        console.log('📡 Response status:', res.status);

        if (!res.ok) {
          if (res.status === 401) {
            console.warn('🔒 Unauthorized, redirecting to login...');
            router.push('/login');
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }

        const result = await res.json();
        console.log('✅ Data received:', result);
        setData(result);
      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err);
        setError('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Memuat dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400">{error || 'Data tidak tersedia'}</div>
      </div>
    );
  }

  // Map data dari API ke format DashboardGrid
  const measurements = data.data || [];

  // Hitung statistik
  const total = measurements.length;
  const osccCount = measurements.filter((m: any) => m.ai_pred_class === 'OSCC').length;
  const pendingCount = measurements.filter((m: any) => m.status === 'raw').length;

  // Data untuk grafik (10 terakhir)
  const chartData = measurements
    .slice(-10)
    .map((m: any) => ({
      timestamp: new Date(m.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      probability: m.ai_probability || 0,
    }));

  // Data untuk tabel riwayat
  const historyData = measurements.slice(0, 10).map((m: any) => ({
    id: m.tracking_id,
    date: new Date(m.created_at).toLocaleString('id-ID'),
    aiResult: m.status === 'raw' ? 'Pending' : (m.ai_pred_class || 'Normal') as 'OSCC' | 'Normal' | 'Pending',
    probability: m.ai_probability,
  }));

  // Data biomarker terbaru
  const latest = measurements.length > 0 ? measurements[measurements.length - 1] : null;
  const biomarkerData = latest ? [
    { title: 'miRNA-31', value: latest.mirna31 || '--', unit: 'RQ', color: 'blue' as const },
    { title: 'Asam Laktat', value: latest.lactate_uM ? (latest.lactate_uM / 1000).toFixed(2) : '--', unit: 'mM', color: 'orange' as const },
    { title: 'IL-8', value: latest.il8_pg_mg || '--', unit: 'pg/mg', color: 'green' as const },
  ] : [];

  // Data lokasi (jika ada)
  const locations = measurements
    .filter((m: any) => m.lat_obfuscated && m.lng_obfuscated)
    .map((m: any) => ({
      lat: m.lat_obfuscated,
      lng: m.lng_obfuscated,
      intensity: m.ai_probability ? m.ai_probability / 100 : 0.5,
      label: m.tracking_id,
    }));

  // Data pending cases
  const pendingCases = measurements
    .filter((m: any) => m.status === 'raw')
    .slice(0, 5)
    .map((m: any) => ({
      id: m.id,
      tracking_id: m.tracking_id,
      patient_id: m.patient_id,
      created_at: m.created_at,
    }));

  return (
    <DashboardGrid
      statusData={{
        label: 'Sistem OSCAR',
        status: 'online' as const,
        probability: latest?.ai_probability || 0,
      }}
      biomarkerData={biomarkerData}
      chartData={chartData}
      historyData={historyData}
      mapLocations={locations.length > 0 ? locations : undefined}
      stats={{ total, osccCount }}
      pendingCases={pendingCases}
    />
  );
}