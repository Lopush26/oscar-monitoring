// app/dashboard/components/DashboardGrid.tsx
import { StatusCard } from './StatusCard';
import { BiomarkerCards } from './BiomarkerCards';
import { TrendChart } from './TrendChart';
import { HistoryTable } from './HistoryTable';
import { MapView } from './MapView';

interface DashboardGridProps {
  /** Data untuk StatusCard */
  statusData?: { label: string; status: 'online' | 'offline'; probability?: number };
  /** Data untuk BiomarkerCards */
  biomarkerData?: any[];
  /** Data untuk TrendChart */
  chartData?: any[];
  /** Data untuk HistoryTable */
  historyData?: any[];
  /** Data untuk MapView */
  mapLocations?: Array<{ lat: number; lng: number; intensity?: number }>;
}

export function DashboardGrid({
  statusData,
  biomarkerData,
  chartData,
  historyData,
  mapLocations,
}: DashboardGridProps) {
  return (
    <div className="space-y-6">
      {/* Baris 1: Status + Biomarker dalam grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatusCard
          label={statusData?.label || 'Sistem'}
          status={statusData?.status || 'offline'}
          probability={statusData?.probability}
        />
        <div className="lg:col-span-1">
          <BiomarkerCards data={biomarkerData} />
        </div>
      </div>

      {/* Baris 2: Grafik (lebar penuh) */}
      <TrendChart data={chartData} />

      {/* Baris 3: History + Map (2 kolom) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HistoryTable data={historyData} />
        <MapView locations={mapLocations} />
      </div>
    </div>
  );
}