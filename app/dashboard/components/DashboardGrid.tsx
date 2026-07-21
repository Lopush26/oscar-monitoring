// app/dashboard/components/DashboardGrid.tsx
'use client';

import { Activity } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
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
  chartData,
  historyData = [],
  mapLocations = [],
  pendingCases = [],
  stats,
}: DashboardGridProps) {
  // Fallback
  const totalCount = stats?.total ?? 5;
  const osccCount = stats?.osccCount ?? 2;

  const listPending = pendingCases.length > 0 ? pendingCases : [
    { id: '1', tracking_id: '95972630F474', patient_id: '95972630F474', created_at: '2023-12-26T14:32:00Z' },
    { id: '2', tracking_id: '959726368476', patient_id: '959726368476', created_at: '2023-12-21T09:15:00Z' },
  ];

  return (
    <div className="space-y-6">
      {/* Status Card */}
      {statusData && <StatusCard {...statusData} />}

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Live */}
        <Card className="glass-card border-cyan-300/40 dark:border-cyan-500/30 p-6 flex flex-col justify-between h-44">
          <div>
            <h3 className="text-md font-semibold text-foreground leading-snug">
              Pantau deteksi dini OSCC secara real-time
            </h3>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-xs font-semibold transition-colors">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                Online
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Activity size={12} className="text-emerald-500 animate-pulse" />
              <span>Live — update tiap 15 detik</span>
            </div>
            <svg className="w-24 h-8 text-emerald-500 dark:text-emerald-400" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M0,15 L15,15 L20,15 L25,5 L30,25 L35,10 L38,20 L42,15 L50,15 L55,10 L60,20 L65,0 L70,30 L75,15 L80,15 L100,15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Card>

        {/* Card 2: Total Pengukuran */}
        <Card className="glass-card p-6 flex flex-col justify-between h-44 relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Pengukuran</h3>
          </div>
          <div className="z-10 flex items-baseline justify-center mb-2">
            <span className="text-6xl font-extrabold tracking-tight text-foreground tabular-nums">{totalCount}</span>
          </div>
          <svg className="absolute bottom-0 right-0 left-0 h-16 w-full text-blue-500/10 dark:text-blue-500/5 pointer-events-none" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path d="M0,30 Q15,5 40,25 T80,15 T100,5 L100,30 Z" fill="currentColor" />
            <path d="M0,30 Q15,5 40,25 T80,15 T100,5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </Card>

        {/* Card 3: OSCC */}
        <Card className="glass-card p-6 flex items-center justify-between h-44">
          <div className="flex flex-col justify-between h-full">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Semua sesi rekaman</h3>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground font-medium">Terdeteksi OSCC</span>
              <p className="text-4xl font-extrabold text-red-600 dark:text-red-500 mt-1 tabular-nums">{osccCount}</p>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-20 w-32 pb-1 shrink-0">
            {[40, 60, 50, 75, 55, 80, 95, 85].map((h, i) => {
              const colors = h >= 90 ? 'bg-red-500' : h >= 70 ? 'bg-amber-500' : 'bg-emerald-500';
              return (
                <div key={i} className={`w-2.5 rounded-t-sm ${colors} opacity-80 hover:opacity-100 transition-opacity`} style={{ height: `${h}%` }} />
              );
            })}
          </div>
        </Card>
      </div>

      {/* Perlu verifikasi */}
      <Card className="glass-card border-amber-300/40 dark:border-amber-500/30 p-6">
        <h3 className="text-md font-semibold text-foreground mb-4">Perlu verifikasi dokter</h3>
        <div className="divide-y divide-border">
          {listPending.map((item) => {
            const date = new Date(item.created_at);
            const dateString = isNaN(date.getTime()) ? item.created_at : date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
            return (
              <div key={item.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-12">
                  <span className="text-sm text-muted-foreground font-mono w-24">{dateString}</span>
                  <span className="text-sm text-foreground font-medium">Patient ID: {item.patient_id || item.tracking_id}</span>
                </div>
                <Link
                  href={`/verify/${item.tracking_id}`}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm border-0"
                >
                  Review Case
                </Link>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Trend Chart */}
      <TrendChart data={chartData} />

      {/* Biomarker + Map */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <BiomarkerCards data={biomarkerData} />
        </div>
        <div className="lg:col-span-4">
          <MapView locations={mapLocations} />
        </div>
      </div>

      {/* History Table */}
      <HistoryTable data={historyData} />

      {/* Footer */}
      <div className="text-center text-[10px] text-muted-foreground pt-6 pb-4">
        OSCAR System v1.1.1 | © 2026 PKM KC UNHAS
      </div>
    </div>
  );
}