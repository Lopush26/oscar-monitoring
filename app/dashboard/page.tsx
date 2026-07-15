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
          credentials: 'include',
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
        <div className="text-white text-lg">Memuat dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400 text-lg">{error || 'Data tidak tersedia'}</div>
      </div>
    );
  }

  // --- AMAN: parse data dari API ---
  const measurements = Array.isArray(data.data) ? data.data : [];

  // Hitung statistik
  const total = measurements.length;
  const osccCount = measurements.filter(
    (m: any) => m.ai_pred_class === 'OSCC'
  ).length;

  // Data untuk grafik (10 terakhir) - probability diparse ke number
  const chartData = measurements
    .slice(-10)
    .map((m: any) => ({
      timestamp: m.created_at
        ? new Date(m.created_at).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '--:--',
      probability: typeof m.ai_probability === 'string'
        ? parseFloat(m.ai_probability)
        : typeof m.ai_probability === 'number'
        ? m.ai_probability
        : 0,
    }))
    .filter((item: any) => !isNaN(item.probability)); // buang yang NaN

  // Data untuk tabel riwayat
  const historyData = measurements.slice(0, 10).map((m: any) => {
    let aiResult: 'OSCC' | 'Normal' | 'Pending' = 'Pending';
    if (m.status === 'verified') {
      aiResult = m.ai_pred_class === 'OSCC' ? 'OSCC' : 'Normal';
    } else if (m.status === 'raw') {
      aiResult = 'Pending';
    }
    const prob = typeof m.ai_probability === 'string'
      ? parseFloat(m.ai_probability)
      : typeof m.ai_probability === 'number'
      ? m.ai_probability
      : undefined;
    return {
      id: m.tracking_id || 'N/A',
      date: m.created_at
        ? new Date(m.created_at).toLocaleString('id-ID')
        : '-',
      aiResult,
      probability: prob && !isNaN(prob) ? prob : undefined,
    };
  });

  // Data biomarker terbaru
  const latest = measurements.length > 0 ? measurements[measurements.length - 1] : null;
  const biomarkerData = latest
    ? [
        {
          title: 'miRNA-31',
          value: latest.mirna31 ?? '--',
          unit: 'RQ',
          color: 'blue' as const,
        },
        {
          title: 'Asam Laktat',
          value: latest.lactate_uM
            ? (latest.lactate_uM / 1000).toFixed(2)
            : '--',
          unit: 'mM',
          color: 'orange' as const,
        },
        {
          title: 'IL-8',
          value: latest.il8_pg_mg ?? '--',
          unit: 'pg/mg',
          color: 'green' as const,
        },
      ]
    : [];

  // Data lokasi (jika ada)
  const locations = measurements
    .filter((m: any) => m.lat_obfuscated && m.lng_obfuscated)
    .map((m: any) => ({
      lat: parseFloat(m.lat_obfuscated),
      lng: parseFloat(m.lng_obfuscated),
      intensity: m.ai_probability
        ? (typeof m.ai_probability === 'string'
            ? parseFloat(m.ai_probability)
            : m.ai_probability) / 100
        : 0.5,
      label: m.tracking_id || 'Lokasi',
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

  // Status card
  const latestProb =
    latest && latest.ai_probability
      ? typeof latest.ai_probability === 'string'
        ? parseFloat(latest.ai_probability)
        : latest.ai_probability
      : 0;

  return (
    <DashboardGrid
      statusData={{
        label: 'Sistem OSCAR',
        status: 'online' as const,
        probability: latestProb && !isNaN(latestProb) ? latestProb : 0,
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