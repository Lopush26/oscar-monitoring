// app/dashboard/components/StatusCard.tsx
interface StatusCardProps {
  /** Label status (misal: "Sistem", "Sensor", "Koneksi") */
  label: string;
  /** Status: 'online' atau 'offline' */
  status: 'online' | 'offline';
  /** Nilai probabilitas (opsional) */
  probability?: number;
}

export function StatusCard({ label, status, probability }: StatusCardProps) {
  const isOnline = status === 'online';

  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm font-semibold capitalize">
              {status}
            </span>
          </div>
          {probability !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              Probabilitas: {probability.toFixed(1)}%
            </p>
          )}
        </div>
        <div className="text-3xl">{isOnline ? '🟢' : '🔴'}</div>
      </div>
    </div>
  );
}