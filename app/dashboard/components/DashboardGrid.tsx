// app/dashboard/components/DashboardGrid.tsx
'use client';

import { Activity, BarChart2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TrendChart } from './TrendChart';
import { MapView } from './MapView';
import { BiomarkerCards, type BiomarkerItem } from './BiomarkerCards';
import { HistoryTable, type HistoryItem } from './HistoryTable';
import { StatusCard } from './StatusCard';

export interface PendingCaseItem {
  id: string;
  tracking_id: string;
  patient_id: string | null;
  created_at: string;
}

interface DashboardGridProps {
  statusData?: {
    label: string;
    status: 'online' | 'offline';
    probability?: number;
    uptime?: string;
  };
  biomarkerData?: BiomarkerItem[];
  latestInfo?: {
    probability?: number;
    predClass?: string;
    trackingId?: string;
    createdAt?: string;
  };
  chartData?: Array<{ timestamp: string; probability: number; status?: number }>;
  historyData?: HistoryItem[];
  mapLocations?: Array<{ lat: number; lng: number; intensity?: number; label?: string }>;
  pendingCases?: PendingCaseItem[];
  stats?: {
    total: number;
    osccCount: number;
  };
}

export function DashboardGrid({
  statusData,
  biomarkerData,
  latestInfo,
  chartData,
  historyData = [],
  mapLocations = [],
  pendingCases = [],
  stats,
}: DashboardGridProps) {
  const totalCount = stats?.total ?? 5;
  const osccCount = stats?.osccCount ?? 2;

  const listPending = pendingCases.length > 0 ? pendingCases : [
    { id: '1', tracking_id: '95972630F474', patient_id: '95972630F474', created_at: '2023-12-26T14:32:00Z' },
    { id: '2', tracking_id: '959726368476', patient_id: '959726368476', created_at: '2023-12-21T09:15:00Z' },
  ];

  return (
    <div className="section">
      {/* 1. Biomarker */}
      <BiomarkerCards data={biomarkerData} latestInfo={latestInfo} />

      {/* 2. Status Card */}
      {statusData && <StatusCard {...statusData} />}

      {/* 3. Summary stat cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Live monitor card */}
        <Card className="card-hover p-5 flex flex-col justify-between h-36" variant="hover" accent="emerald">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/30">
              <Activity size={18} className="text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
            </div>
            <span className="badge badge-success">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Online
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-snug">Deteksi dini OSCC real-time</p>
            <p className="text-xs text-muted-foreground mt-1">Update tiap 15 detik</p>
          </div>
        </Card>

        {/* Total pengukuran */}
        <Card className="card-hover p-5 flex flex-col justify-between h-36" variant="hover" accent="blue">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800/30">
              <BarChart2 size={18} className="text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
            </div>
          </div>
          <div>
            <p className="stat-label">Total Pengukuran</p>
            <p className="stat-value">{totalCount}</p>
          </div>
        </Card>

        {/* OSCC terdeteksi */}
        <Card className="card-hover p-5 flex flex-col justify-between h-36" variant="hover" accent="red">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-800/30">
              <AlertCircle size={18} className="text-red-500 dark:text-red-400" strokeWidth={1.75} />
            </div>
          </div>
          <div>
            <p className="stat-label">Terdeteksi OSCC</p>
            <p className="stat-value text-red-600 dark:text-red-400">{osccCount}</p>
          </div>
        </Card>
      </div>

      {/* 4. Perlu verifikasi */}
      <Card className="card-hover" variant="hover" accent="amber">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Perlu Verifikasi Dokter</CardTitle>
            <span className="badge badge-warning">
              {listPending.length} kasus
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border/50">
            {listPending.map((item) => {
              const date = new Date(item.created_at);
              const dateString = isNaN(date.getTime())
                ? item.created_at
                : date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
              return (
                <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-10">
                    <span className="text-xs text-muted-foreground font-mono">{dateString}</span>
                    <span className="text-sm text-foreground font-medium">
                      Patient ID: {item.patient_id || item.tracking_id}
                    </span>
                  </div>
                  <Link
                    href={`/verify/${item.tracking_id}`}
                    className="btn-primary btn-sm"
                  >
                    Review
                  </Link>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 5. Trend Chart & Map */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TrendChart data={chartData} />
        </div>
        <div className="lg:col-span-4">
          <MapView locations={mapLocations} />
        </div>
      </div>

      {/* 6. History */}
      <HistoryTable data={historyData} />

      {/* Footer */}
      <div className="text-center text-[10px] text-muted-foreground pt-4 pb-2 border-t border-border">
        OSCAR System v1.1.1 | © 2026 PKM KC UNHAS
      </div>
    </div>
  );
}