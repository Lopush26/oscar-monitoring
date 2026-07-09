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
    badge: 'badge badge-danger',
    icon: XCircle,
    label: 'OSCC',
  },
  Normal: {
    badge: 'badge badge-success',
    icon: CheckCircle2,
    label: 'Normal',
  },
  Pending: {
    badge: 'badge badge-warning',
    icon: HelpCircle,
    label: 'Pending',
  },
};

export function HistoryTable({ data = [] }: HistoryTableProps) {
  const isEmpty = data.length === 0;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800">
              <ClipboardList size={16} className="text-slate-600 dark:text-slate-400" strokeWidth={1.75} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Riwayat Diagnosis</CardTitle>
              <p className="text-xs text-muted-foreground">{data.length} data terbaru</p>
            </div>
          </div>
          {data.length > 0 && (
            <button className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Lihat semua
              <ExternalLink size={11} />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-44 gap-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/30 border border-dashed border-border">
            <ClipboardList size={28} className="text-muted-foreground/40" strokeWidth={1.25} />
            <p className="text-sm text-muted-foreground">Belum ada riwayat diagnosis</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="pb-2.5 pt-0 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-1">
                    Tracking ID
                  </th>
                  <th className="pb-2.5 pt-0 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={11} /> Waktu</span>
                  </th>
                  <th className="pb-2.5 pt-0 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Hasil AI
                  </th>
                  <th className="pb-2.5 pt-0 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground pr-1">
                    Prob.
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {data.map((item) => {
                  const cfg = RESULT_CONFIG[item.aiResult];
                  const Icon = cfg.icon;
                  return (
                    <tr
                      key={item.id}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 pl-1">
                        <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                          {item.id}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </td>
                      <td className="py-2.5">
                        <span className={cfg.badge}>
                          <Icon size={10} strokeWidth={2.5} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-2.5 text-right pr-1">
                        {item.probability !== undefined ? (
                          <span className={`text-xs font-semibold tabular-nums ${
                            item.probability >= 70
                              ? 'text-red-600 dark:text-red-400'
                              : item.probability >= 40
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
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