// app/dashboard/page.tsx
import { DashboardGrid } from '@/app/dashboard/components/DashboardGrid';

export default function DashboardPage() {
  const dummyStatus = {
    label: 'Sistem OSCAR',
    status: 'online' as const,
    probability: 87.5,
  };

  const dummyBiomarkers = [
    { title: 'miRNA-31', value: 3.45, unit: 'RQ', color: 'blue' as const },
    { title: 'Asam Laktat', value: 0.09, unit: 'mM', color: 'orange' as const },
    { title: 'IL-8', value: 36.5, unit: 'pg/mg', color: 'green' as const },
  ];

  const dummyChart = [
    { timestamp: '08:00', probability: 45 },
    { timestamp: '09:00', probability: 55 },
    { timestamp: '10:00', probability: 70 },
    { timestamp: '11:00', probability: 82 },
    { timestamp: '12:00', probability: 65 },
  ];

  const dummyHistory = [
    { id: 'OSC-001', date: '2026-07-08 10:00', aiResult: 'OSCC' as const, probability: 92.3 },
    { id: 'OSC-002', date: '2026-07-08 09:30', aiResult: 'Normal' as const, probability: 12.4 },
    { id: 'OSC-003', date: '2026-07-08 08:45', aiResult: 'Pending' as const },
  ];

  const dummyLocations = [
    { lat: -2.5489, lng: 118.0149, intensity: 0.8, label: 'Makassar' },
    { lat: -6.2088, lng: 106.8456, intensity: 0.3, label: 'Jakarta' },
    { lat: -7.7974, lng: 110.3740, intensity: 0.5, label: 'Yogyakarta' },
  ];

  return (
    <DashboardGrid
      statusData={dummyStatus}
      biomarkerData={dummyBiomarkers}
      chartData={dummyChart}
      historyData={dummyHistory}
      mapLocations={dummyLocations}
    />
  );
}