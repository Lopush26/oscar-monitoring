// app/dashboard/components/TrendChart.tsx
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface ChartDataPoint {
  timestamp: string;
  probability: number;
  status?: number;
}

interface TrendChartProps {
  data?: ChartDataPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-xs shadow-xl border border-border/50">
      <p className="font-semibold text-foreground mb-1">⏱ {label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {Number(p.value).toFixed(1)}%
        </p>
      ))}
    </div>
  );
}

export function TrendChart({ data = [] }: TrendChartProps) {
  const hasData = data.length > 0;
  const latest = hasData ? data[data.length - 1].probability : null;
  const prev = hasData && data.length > 1 ? data[data.length - 2].probability : null;
  const delta = latest !== null && prev !== null ? (latest - prev).toFixed(1) : null;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <BarChart3 size={14} className="text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Tren Probabilitas OSCC</CardTitle>
              <p className="text-[10px] text-muted-foreground">Riwayat pengukuran real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {latest !== null && (
              <span className={`badge ${latest >= 70 ? 'badge-danger' : latest >= 40 ? 'badge-warning' : 'badge-success'}`}>
                {latest.toFixed(1)}%
              </span>
            )}
            {delta !== null && (
              <span className={`flex items-center gap-0.5 text-xs font-medium ${Number(delta) >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                <TrendingUp size={12} className={Number(delta) < 0 ? 'rotate-180' : ''} />
                {delta}
              </span>
            )}
            <span className="badge badge-muted">{data.length} data</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/30 border border-dashed border-border">
            <BarChart3 size={28} className="text-muted-foreground/40" strokeWidth={1.25} />
            <p className="text-sm text-muted-foreground">Belum ada data pengukuran</p>
          </div>
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1.5}
                  label={{ value: 'Risiko Tinggi', position: 'right', fontSize: 9, fill: '#ef4444' }} />
                <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="4 2" strokeWidth={1.5}
                  label={{ value: 'Risiko Sedang', position: 'right', fontSize: 9, fill: '#f59e0b' }} />
                <Line
                  type="monotone"
                  dataKey="probability"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#3b82f6', strokeWidth: 0 }}
                  activeDot={{ r: 4.5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  name="Probabilitas (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}