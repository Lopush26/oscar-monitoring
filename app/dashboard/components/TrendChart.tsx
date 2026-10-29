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
import { useTheme } from 'next-themes';
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
    <div className="card rounded-xl px-3 py-2 text-xs shadow-elegant border border-border/60 bg-card">
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const hasData = data.length > 0;
  const latest = hasData ? data[data.length - 1].probability : null;
  const prev = hasData && data.length > 1 ? data[data.length - 2].probability : null;
  const delta = latest !== null && prev !== null ? (latest - prev).toFixed(1) : null;

  const gridColor = isDark ? '#334155' : '#E2E8F0';
  const tickColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <Card className="card-hover" variant="hover" accent="blue">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800/30">
              <BarChart3 size={14} className="text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">Tren Probabilitas OSCC</CardTitle>
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
              <span className={`flex items-center gap-1 text-xs font-medium ${Number(delta) >= 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
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
          <div className="flex flex-col items-center justify-center h-48 gap-3 rounded-xl bg-muted/50 border border-dashed border-border">
            <BarChart3 size={28} className="text-muted-foreground/40" strokeWidth={1.25} />
            <p className="text-sm text-muted-foreground">Belum ada data pengukuran</p>
          </div>
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.35} />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 10, fill: tickColor }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: tickColor }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="4 2" strokeWidth={1.5}
                  label={{ value: 'Risiko Tinggi', position: 'right', fontSize: 9, fill: '#EF4444' }} />
                <ReferenceLine y={40} stroke="#F59E0B" strokeDasharray="4 2" strokeWidth={1.5}
                  label={{ value: 'Risiko Sedang', position: 'right', fontSize: 9, fill: '#F59E0B' }} />
                <Line
                  type="monotone"
                  dataKey="probability"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#2563EB', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#2563EB', strokeWidth: 2, stroke: isDark ? '#0A192F' : '#FFFFFF' }}
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