'use client';

import { useEffect, useState } from 'react';
import { DashboardGrid } from '@/app/dashboard/components/DashboardGrid';

export default function DashboardClient() {
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

        if (!res.ok) {
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-500 dark:text-red-400 mb-2">
            {error || 'Data tidak tersedia'}
          </h2>
          <p className="text-muted-foreground text-sm">
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

  // Chart data (10 terakhir - diurutkan kronologis)
  const chartData = measurements
    .slice(0, 10)
    .reverse()
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

  // Data Biomarker & OSCC Probability terbaru
  const latest = measurements.length > 0 ? measurements[0] : null;
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
          unit: 'pg/mL',
          color: 'green' as const,
        },
      ]
    : [];

  const latestProb = latest && latest.ai_probability !== null && latest.ai_probability !== undefined
    ? parseFloat(latest.ai_probability)
    : undefined;

  const latestInfo = {
    probability: latestProb,
    predClass: latest?.ai_pred_class || undefined,
    trackingId: latest?.tracking_id || undefined,
    createdAt: latest?.created_at
      ? new Date(latest.created_at).toLocaleString('id-ID')
      : undefined,
  };

  // Lokasi Sebaran Kasus (Makassar & sekitarnya)
  const demoCoords = [
    { lat: -5.1332, lng: 119.4883, area: 'RSUP Dr. Wahidin / Tamalanrea' },
    { lat: -5.1477, lng: 119.4327, area: 'Pusat Kota Makassar' },
    { lat: -5.1764, lng: 119.4421, area: 'Panakkukang' },
    { lat: -5.0061, lng: 119.5746, area: 'Maros' },
    { lat: -5.2044, lng: 119.4542, area: 'Sungguminasa, Gowa' },
    { lat: -5.1215, lng: 119.4812, area: 'UNHAS Tamalanrea' },
  ];

  const locations = measurements.map((m: any, idx: number) => {
    const defaultCoord = demoCoords[idx % demoCoords.length];
    const lat = m.lat_obfuscated ? parseFloat(m.lat_obfuscated) : defaultCoord.lat;
    const lng = m.lng_obfuscated ? parseFloat(m.lng_obfuscated) : defaultCoord.lng;
    return {
      trackingId: m.tracking_id,
      patientId: m.patient_id || m.tracking_id,
      lat,
      lng,
      area: defaultCoord.area,
      probability: parseFloat(m.ai_probability) || 0,
      predClass: m.ai_pred_class || 'N/A',
      status: m.status,
      mirna31: m.mirna31,
      lactate: m.lactate_uM ? (m.lactate_uM / 1000).toFixed(2) : '--',
      il8: m.il8_pg_mg,
    };
  });

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

  return (
    <DashboardGrid
      statusData={{
        label: 'Sistem OSCAR',
        status: 'online' as const,
        probability: latestProb,
      }}
      biomarkerData={biomarkerData}
      latestInfo={latestInfo}
      chartData={chartData}
      historyData={historyData}
      mapLocations={locations}
      stats={{ total, osccCount }}
      pendingCases={pendingCases}
    />
  );
}
