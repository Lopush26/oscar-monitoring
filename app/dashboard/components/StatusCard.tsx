// app/dashboard/components/StatusCard.tsx
'use client';

import { Activity, Wifi, WifiOff, Cpu } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface StatusCardProps {
  label: string;
  status: 'online' | 'offline';
  probability?: number;
  uptime?: string;
}

export function StatusCard({ label, status, probability, uptime }: StatusCardProps) {
  const isOnline = status === 'online';
  const probPercent = probability ?? 0;

  const gaugeColor =
    probPercent >= 70 ? 'text-red-600 dark:text-red-400'
    : probPercent >= 40 ? 'text-amber-600 dark:text-amber-400'
    : 'text-emerald-600 dark:text-emerald-400';

  const barColor =
    probPercent >= 70 ? 'bg-red-600'
    : probPercent >= 40 ? 'bg-amber-600'
    : 'bg-emerald-600';

  const statusBadge = isOnline ? (
    <span className="badge badge-success">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>
      Online
    </span>
  ) : (
    <span className="badge badge-danger">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Offline
    </span>
  );

  return (
    <Card className="card-hover" variant="hover" accent="emerald">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800/30">
              <Cpu size={18} className="text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">{label}</CardTitle>
              <p className="text-xs text-muted-foreground">Sistem AI OSCAR</p>
            </div>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-muted/50 border border-border/50 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isOnline ? <Wifi size={13} className="text-emerald-500" /> : <WifiOff size={13} className="text-red-500" />}
            <span>{isOnline ? 'Terhubung ke database' : 'Koneksi terputus'}</span>
          </div>
          {uptime && <span className="text-xs text-muted-foreground">Up {uptime}</span>}
        </div>

        {probability !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Activity size={12} className="text-blue-600 dark:text-blue-400" />
                <span>Probabilitas OSCC</span>
              </div>
              <span className={`text-sm font-bold tabular-nums ${gaugeColor}`}>
                {probPercent.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(probPercent, 100)}%`, backgroundColor: barColor }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {probPercent >= 70
                ? 'Risiko tinggi — perlu verifikasi dokter'
                : probPercent >= 40
                ? 'Risiko sedang — pantau lebih lanjut'
                : 'Risiko rendah — dalam batas normal'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}