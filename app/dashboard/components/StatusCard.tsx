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
    probPercent >= 70
      ? 'text-red-500 dark:text-red-400'
      : probPercent >= 40
      ? 'text-amber-500 dark:text-amber-400'
      : 'text-emerald-500 dark:text-emerald-400';

  const barColor =
    probPercent >= 70
      ? 'bg-red-500'
      : probPercent >= 40
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  return (
    <Card className="glass-card card-hover">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Cpu size={16} className="text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">{label}</CardTitle>
              <p className="text-xs text-muted-foreground">Sistem AI OSCAR</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isOnline
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {isOnline ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Online
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Offline
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-sm">
            {isOnline
              ? <Wifi size={14} className="text-emerald-500" />
              : <WifiOff size={14} className="text-red-500" />
            }
            <span className="text-muted-foreground text-xs">
              {isOnline ? 'Terhubung ke database' : 'Koneksi terputus'}
            </span>
          </div>
          {uptime && <span className="text-xs text-muted-foreground">Up {uptime}</span>}
        </div>

        {probability !== undefined && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Activity size={13} />
                <span>Probabilitas OSCC</span>
              </div>
              <span className={`text-sm font-bold tabular-nums ${gaugeColor}`}>
                {probPercent.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                style={{ width: `${Math.min(probPercent, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {probPercent >= 70 ? '⚠️ Risiko tinggi – perlu verifikasi dokter' :
               probPercent >= 40 ? '⚡ Risiko sedang – pantau lebih lanjut' :
               '✅ Risiko rendah – dalam batas normal'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}