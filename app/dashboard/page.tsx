// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { DashboardGrid } from '@/app/dashboard/components/DashboardGrid';

export default function DashboardPage() {
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
          // ❌ TIDAK REDIRECT KE LOGIN!
          console.error('❌ API error:', res.status);
          setError(`Gagal memuat data (HTTP ${res.status})`);
          setLoading(false);
          return;
        }

        const result = await res.json();
        console.log('✅ Data received:', result);
        setData(result);
      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err);
        setError('Terjadi kesalahan jaringan. Periksa koneksi internet Anda.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0f1d]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0f1d] px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">
            {error || 'Data tidak tersedia'}
          </h2>
          <p className="text-slate-400 text-sm">
            Coba refresh halaman atau periksa koneksi internet.
          </p>
        </div>
      </div>
    );
  }

  // ── Parse data dari API ──
  const measurements = Array.isArray(data.data) ? data.data : [];
  const total = measurements.length;
  const osccCount = measurements.filter((m: any) => m.ai_pred_class === 'OSCC').length;

  // Chart data (10 terakhir)
  const chartData = measurements
    .slice(-10)
    .map((m: any) => ({
      timestamp: m.created_at
        ? new Date(m.created_at).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '--:--',
      probability: parseFloat(m.ai_probability) || 0,
    }))
    .filter((item: any) => !isNaN(item.probability));

  // History data
  const historyData = measurements.slice(0, 10).map((m: any) => {
    let aiResult: 'OSCC' | 'Normal' | 'Pending' = 'Pending';
    if (m.status === 'verified') {
      aiResult = m.ai_pred_class === 'OSCC' ? 'OSCC' : 'Normal';
    } else if (m.status === 'raw') {
      aiResult = 'Pending';
    }
    const prob = parseFloat(m.ai_probability);
    return {
      id: m.tracking_id || 'N/A',
      date: m.created_at
        ? new Date(m.created_at).toLocaleString('id-ID')
        : '-',
      aiResult,
      probability: !isNaN(prob) ? prob : undefined,
    };
  });

  // Biomarker terbaru
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

  // Lokasi (jika ada)
  const locations = measurements
    .filter((m: any) => m.lat_obfuscated && m.lng_obfuscated)
    .map((m: any) => ({
      lat: parseFloat(m.lat_obfuscated),
      lng: parseFloat(m.lng_obfuscated),
      intensity: parseFloat(m.ai_probability) / 100 || 0.5,
      label: m.tracking_id || 'Lokasi',
    }));

  // Pending cases
  const pendingCases = measurements
    .filter((m: any) => m.status === 'raw')
    .slice(0, 5)
    .map((m: any) => ({
      id: m.id,
      tracking_id: m.tracking_id,
      patient_id: m.patient_id,
      created_at: m.created_at,
    }));

  // Probability terbaru
  const latestProb = latest ? parseFloat(latest.ai_probability) || 0 : 0;

  // ── Render DashboardGrid ──
  return (
    <DashboardGrid
      statusData={{
        label: 'Sistem OSCAR',
        status: 'online' as const,
        probability: latestProb,
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