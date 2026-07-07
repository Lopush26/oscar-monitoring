// app/dashboard/components/HistoryTable.tsx
interface HistoryItem {
  id: string;
  date: string;
  aiResult: 'OSCC' | 'Normal' | 'Pending';
  probability?: number;
}

interface HistoryTableProps {
  /** Array riwayat pemeriksaan */
  data?: HistoryItem[];
}

export function HistoryTable({ data = [] }: HistoryTableProps) {
  const isEmpty = data.length === 0;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <h3 className="text-sm font-semibold">📋 Riwayat Diagnosis</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="pb-2 text-left font-medium text-muted-foreground">ID</th>
              <th className="pb-2 text-left font-medium text-muted-foreground">Tanggal</th>
              <th className="pb-2 text-left font-medium text-muted-foreground">Hasil AI</th>
              <th className="pb-2 text-left font-medium text-muted-foreground">Prob</th>
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-muted-foreground">
                  Belum ada data
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 font-mono text-xs">{item.id}</td>
                  <td className="py-2">{item.date}</td>
                  <td className="py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.aiResult === 'OSCC'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : item.aiResult === 'Normal'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}
                    >
                      {item.aiResult}
                    </span>
                  </td>
                  <td className="py-2">
                    {item.probability !== undefined ? `${item.probability.toFixed(1)}%` : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}