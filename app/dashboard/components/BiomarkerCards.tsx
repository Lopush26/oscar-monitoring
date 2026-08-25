// app/dashboard/components/BiomarkerCards.tsx
'use client';

import { Dna, Droplets, Zap, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { BIOMARKER_LIMITS } from '@/lib/constants';

export interface BiomarkerItem {
  title: string;
  value: number | string;
  unit: string;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  onEdit?: () => void;
}

interface BiomarkerCardsProps {
  data?: BiomarkerItem[];
  onEdit?: (index: number) => void;
  latestInfo?: {
    probability?: number;
    predClass?: string;
    trackingId?: string;
    createdAt?: string;
  };
}

const BIOMARKER_CONFIG: Record<string, {
  icon: typeof Dna;
  min: number;
  max: number;
  normalRange: string;
  description: string;
}> = {
  'miRNA-31': {
    icon: Dna,
    min: BIOMARKER_LIMITS.MIRNA_MIN,
    max: BIOMARKER_LIMITS.MIRNA_MAX,
    normalRange: '< 2.0 RQ',
    description: 'Ekspresi gen micro RNA-31',
  },
  'Asam Laktat': {
    icon: Droplets,
    min: BIOMARKER_LIMITS.LACTATE_MIN,
    max: BIOMARKER_LIMITS.LACTATE_MAX,
    normalRange: '< 200 mM',
    description: 'Kadar laktat dalam saliva',
  },
  'IL-8': {
    icon: Zap,
    min: BIOMARKER_LIMITS.IL8_MIN,
    max: BIOMARKER_LIMITS.IL8_MAX,
    normalRange: '< 50 pg/mg',
    description: 'Interleukin-8 (biomarker inflamasi)',
  },
};

const COLOR_MAP = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',   icon: 'text-blue-600 dark:text-blue-400',   iconBg: 'bg-blue-100 dark:bg-blue-900/40',   bar: 'bg-blue-500',   border: 'border-blue-200 dark:border-blue-800/50' },
  green:  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40', bar: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-800/50' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', icon: 'text-orange-600 dark:text-orange-400', iconBg: 'bg-orange-100 dark:bg-orange-900/40', bar: 'bg-orange-500', border: 'border-orange-200 dark:border-orange-800/50' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-100 dark:bg-purple-900/40', bar: 'bg-purple-500', border: 'border-purple-200 dark:border-purple-800/50' },
};

function BiomarkerCard({ title, value, unit, color = 'blue', onEdit }: BiomarkerItem) {
  const colors = COLOR_MAP[color];
  const config = BIOMARKER_CONFIG[title];
  const Icon = config?.icon ?? Dna;

  const numVal = typeof value === 'number' ? value : parseFloat(String(value));
  const maxVal = config?.max ?? 100;
  const barPercent = isNaN(numVal) ? 0 : Math.min((numVal / maxVal) * 100, 100);

  const isHigh = !isNaN(numVal) && config && numVal > (config.max * 0.5);
  const TrendIcon = isNaN(numVal) ? Minus : isHigh ? TrendingUp : TrendingDown;
  const trendColor = isHigh
    ? 'text-red-500 dark:text-red-400'
    : 'text-emerald-500 dark:text-emerald-400';

  return (
    <div className={`relative rounded-xl border p-4 card-hover transition-all ${colors.bg} ${colors.border} h-full`}>
      <div className="flex items-start justify-between mb-2">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${colors.iconBg}`}>
          <Icon size={16} className={colors.icon} strokeWidth={1.75} />
        </div>
        <div className="flex items-center gap-1">
          <TrendIcon size={13} className={trendColor} />
          {onEdit && (
            <button onClick={onEdit} className="ml-1 p-0.5 rounded-md text-muted-foreground hover:bg-white/60 dark:hover:bg-slate-700/40 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-xl font-bold tabular-nums text-foreground">
            {typeof value === 'number' ? value.toFixed(value < 10 ? 2 : 1) : value}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">{unit}</span>
        </div>
        {config && <p className="text-[10px] text-muted-foreground mt-0.5">{config.description}</p>}
      </div>

      {!isNaN(numVal) && (
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] text-muted-foreground">
            <span>Normal: {config?.normalRange ?? '—'}</span>
            <span>{barPercent.toFixed(0)}% dari maks</span>
          </div>
          <div className="h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${colors.bar}`} style={{ width: `${barPercent}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_DATA: BiomarkerItem[] = [
  { title: 'miRNA-31',    value: '--', unit: 'RQ',    color: 'blue' },
  { title: 'Asam Laktat', value: '--', unit: 'mM',    color: 'orange' },
  { title: 'IL-8',        value: '--', unit: 'pg/mg', color: 'green' },
];

export function BiomarkerCards({ data, onEdit, latestInfo }: BiomarkerCardsProps) {
  const items = data ?? DEFAULT_DATA;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Dna size={16} className="text-purple-600 dark:text-purple-400" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">Data Biomarker</CardTitle>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                  Data Terakhir Masuk
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {latestInfo?.trackingId ? `ID: ${latestInfo.trackingId} • ${latestInfo.createdAt || ''}` : 'Hasil sensor multi-omics data terbaru'}
              </p>
            </div>
          </div>

          {latestInfo?.probability !== undefined && (
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shrink-0">
              <Activity size={15} className="text-blue-500 animate-pulse" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                  Probabilitas OSCC (Data Terakhir)
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-lg font-extrabold tabular-nums ${
                    latestInfo.probability >= 70
                      ? 'text-red-600 dark:text-red-400'
                      : latestInfo.probability >= 40
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {latestInfo.probability.toFixed(1)}%
                  </span>
                  {latestInfo.predClass && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      latestInfo.predClass === 'OSCC'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                    }`}>
                      {latestInfo.predClass}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {items.map((item, idx) => (
            <BiomarkerCard
              key={item.title}
              {...item}
              onEdit={onEdit ? () => onEdit(idx) : undefined}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}