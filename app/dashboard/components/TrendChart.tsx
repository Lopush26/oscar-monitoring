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
} from 'recharts';

interface ChartDataPoint {
  timestamp: string;
  probability: number;
  status?: number;
}

interface TrendChartProps {
  data?: ChartDataPoint[];
}

export function TrendChart({ data = [] }: TrendChartProps) {
  const hasData = data.length > 0;

  if (!hasData) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">📈 Tren Probabilitas OSCC</h3>
          <span className="text-xs text-muted-foreground">Belum ada data</span>
        </div>
        <div className="mt-4 h-64 w-full rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-sm text-muted-foreground">
          Belum ada data untuk grafik
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">📈 Tren Probabilitas OSCC</h3>
        <span className="text-xs text-muted-foreground">
          {data.length} data terakhir
        </span>
      </div>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            {/* FIX: use any for formatter and labelFormatter */}
            <Tooltip
              formatter={(value: any) => `${Number(value).toFixed(1)}%`}
              labelFormatter={(label: any) => `Waktu: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="probability"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Probabilitas (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}