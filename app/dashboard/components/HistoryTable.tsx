'use client';

import { ClipboardList, ExternalLink, Clock, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export interface HistoryItem {
  id: string;
  date: string;
  aiResult: 'OSCC' | 'Normal' | 'Pending';
  probability?: number;
}

interface HistoryTableProps {
  data?: HistoryItem[];
}

const RESULT_CONFIG = {
  OSCC: {
    badge: 'badge-danger',
    icon: XCircle,
    label: 'OSCC',
  },
  Normal: {
    badge: 'badge-success',
    icon: CheckCircle2,
    label: 'Normal',
  },
  Pending: {
    badge: 'badge-warning',
    icon: HelpCircle,
    label: 'Pending',
  },
};

export function HistoryTable({ data = [] }: HistoryTableProps) {
  const isEmpty = data.length === 0;

  return (
    <Card className="card-hover" variant="hover" accent="violet">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-muted border border-border">
              <ClipboardList size={16} className="text-muted-foreground" strokeWidth={1.75} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Riwayat Diagnosis</CardTitle>
              <p className="text-xs text-muted-foreground">{data.length} data terbaru</p>
            </div>
          </div>
          {data.length > 0 && (
            <button className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
              Lihat semua
              <ExternalLink size={11} />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-xl bg-muted/50 border border-dashed border-border">
            <ClipboardList size={28} className="text-muted-foreground/40" strokeWidth={1.25} />
            <p className="text-sm text-muted-foreground">Belum ada riwayat diagnosis</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="table">
              <thead>
                <tr>
                  <th className="pl-6 pr-4">Tracking ID</th>
                  <th className="px-4"><span className="flex items-center gap-1"><Clock size={11} /> Waktu</span></th>
                  <th className="px-4">Hasil AI</th>
                  <th className="pr-6 text-right">Prob.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.map((item) => {
                  const cfg = RESULT_CONFIG[item.aiResult];
                  const Icon = cfg.icon;
                  return (
                    <tr key={item.id}>
                      <td className="pl-6 pr-4">
                        <span className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-150">
                          {item.id}
                        </span>
                      </td>
                      <td className="px-4">
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </td>
                      <td className="px-4">
                        <span className={cfg.badge}>
                          <Icon size={10} strokeWidth={2.5} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="pr-6 text-right">
                        {item.probability !== undefined ? (
                          <span className={`text-xs font-semibold tabular-nums ${item.probability >= 70 ? 'text-red-600 dark:text-red-400' : item.probability >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {item.probability.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}