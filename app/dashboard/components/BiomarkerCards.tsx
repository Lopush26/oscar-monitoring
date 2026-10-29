// app/dashboard/components/BiomarkerCards.tsx
'use client';

import { Dna, Droplets, Zap, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { BIOMARKER_LIMITS } from '@/lib/constants';

export interface BiomarkerItem {
  title: string;
  value: number | string;
  unit: string;
  color?: 'blue' | 'emerald' | 'amber' | 'violet';
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
  accentColor: 'blue' | 'emerald' | 'amber' | 'violet';
}> = {
  'miRNA-31': {
    icon: Dna,
    min: BIOMARKER_LIMITS.MIRNA_MIN,
    max: BIOMARKER_LIMITS.MIRNA_MAX,
    normalRange: '< 2.0 RQ',
    description: 'Ekspresi gen micro RNA-31',
    accentColor: 'blue',
  },
  'Asam Laktat': {
    icon: Droplets,
    min: BIOMARKER_LIMITS.LACTATE_MIN,
    max: BIOMARKER_LIMITS.LACTATE_MAX,
    normalRange: '< 200 mM',
    description: 'Kadar laktat dalam saliva',
    accentColor: 'amber',
  },
  'IL-8': {
    icon: Zap,
    min: BIOMARKER_LIMITS.IL8_MIN,
    max: BIOMARKER_LIMITS.IL8_MAX,
    normalRange: '< 50 pg/mL',
    description: 'Interleukin-8 (biomarker inflamasi)',
    accentColor: 'emerald',
  },
};

const COLOR_MAP = {
  blue: {
    cardBg:  'bg-gradient-to-br from-blue-50/90 via-white to-blue-50/40 dark:from-blue-950/40 dark:via-card dark:to-blue-950/20',
    border:  'border-blue-300 dark:border-blue-800/60 shadow-sm',
    topBar:  'bg-gradient-to-r from-blue-600 to-indigo-600',
    iconBg:  'bg-blue-600 text-white shadow-sm',
    icon:    'text-white',
    bar:     'bg-blue-600',
    label:   'text-blue-700 dark:text-blue-300',
    valueText: 'text-blue-950 dark:text-blue-50',
  },
  emerald: {
    cardBg:  'bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 dark:from-emerald-950/40 dark:via-card dark:to-emerald-950/20',
    border:  'border-emerald-300 dark:border-emerald-800/60 shadow-sm',
    topBar:  'bg-gradient-to-r from-emerald-600 to-teal-600',
    iconBg:  'bg-emerald-600 text-white shadow-sm',
    icon:    'text-white',
    bar:     'bg-emerald-600',
    label:   'text-emerald-700 dark:text-emerald-300',
    valueText: 'text-emerald-950 dark:text-emerald-50',
  },
  amber: {
    cardBg:  'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 dark:from-amber-950/40 dark:via-card dark:to-amber-950/20',
    border:  'border-amber-300 dark:border-amber-800/60 shadow-sm',
    topBar:  'bg-gradient-to-r from-amber-600 to-orange-600',
    iconBg:  'bg-amber-600 text-white shadow-sm',
    icon:    'text-white',
    bar:     'bg-amber-600',
    label:   'text-amber-700 dark:text-amber-300',
    valueText: 'text-amber-950 dark:text-amber-50',
  },
  violet: {
    cardBg:  'bg-gradient-to-br from-violet-50/90 via-white to-violet-50/40 dark:from-violet-950/40 dark:via-card dark:to-violet-950/20',
    border:  'border-violet-300 dark:border-violet-800/60 shadow-sm',
    topBar:  'bg-gradient-to-r from-violet-600 to-purple-600',
    iconBg:  'bg-violet-600 text-white shadow-sm',
    icon:    'text-white',
    bar:     'bg-violet-600',
    label:   'text-violet-700 dark:text-violet-300',
    valueText: 'text-violet-950 dark:text-violet-50',
  },
};

function BiomarkerCard({ title, value, unit, color = 'blue', onEdit }: BiomarkerItem) {
  const c = COLOR_MAP[color];
  const config = BIOMARKER_CONFIG[title];
  const Icon = config?.icon ?? Dna;

  const numVal = typeof value === 'number' ? value : parseFloat(String(value));
  const maxVal = config?.max ?? 100;
  const barPercent = isNaN(numVal) ? 0 : Math.min((numVal / maxVal) * 100, 100);

  const isHigh = !isNaN(numVal) && config && numVal > (config.max * 0.5);
  const TrendIcon = isNaN(numVal) ? Minus : isHigh ? TrendingUp : TrendingDown;
  const trendColor = isHigh ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400';

  // Determine accent color for left border
  const accentColor = config?.accentColor ?? color;

  return (
    <div className={`rounded-2xl border overflow-hidden card-hover h-full flex flex-col ${c.cardBg} ${c.border}`} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.9)' }}>
      {/* Top accent strip */}
      <div className={`h-1.5 w-full ${c.topBar} shrink-0`} />

      <div className="flex flex-col flex-1 p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${c.iconBg}`}>
            <Icon size={19} className={c.icon} strokeWidth={2} />
          </div>
          <div className="flex items-center gap-1">
            <TrendIcon size={14} className={trendColor} />
            {onEdit && (
              <button
                onClick={onEdit}
                className="ml-1 p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Label */}
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${c.label}`}>{title}</p>

        {/* Value */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`text-2xl font-extrabold tabular-nums tracking-tight ${c.valueText}`}>
            {typeof value === 'number' ? value.toFixed(value < 10 ? 2 : 1) : value}
          </span>
          <span className="text-xs text-muted-foreground font-semibold">{unit}</span>
        </div>

        {config && (
          <p className="text-xs text-muted-foreground leading-snug mb-4">{config.description}</p>
        )}

        {/* Progress bar */}
        <div className="mt-auto space-y-2">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span className="font-medium">Ref: {config?.normalRange ?? '—'}</span>
            {!isNaN(numVal) && <span className="font-bold">{barPercent.toFixed(0)}%</span>}
          </div>
          <div className="h-1.5 rounded-full bg-slate-200/80 dark:bg-slate-700/60 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${c.bar}`}
              style={{ width: isNaN(numVal) ? '0%' : `${barPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_DATA: BiomarkerItem[] = [
  { title: 'miRNA-31',    value: '--', unit: 'RQ',    color: 'blue' },
  { title: 'Asam Laktat', value: '--', unit: 'mM',    color: 'amber' },
  { title: 'IL-8',        value: '--', unit: 'pg/mL', color: 'emerald' },
];

export function BiomarkerCards({ data, onEdit, latestInfo }: BiomarkerCardsProps) {
  const items = data ?? DEFAULT_DATA;

  return (
    <Card className="card-hover" variant="hover" accent="blue">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800/30">
              <Dna size={18} className="text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">Data Biomarker</CardTitle>
                <span className="badge badge-info">
                  Data Terakhir
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {latestInfo?.trackingId
                  ? `ID: ${latestInfo.trackingId} • ${latestInfo.createdAt || ''}`
                  : 'Hasil sensor multi-omics terbaru'}
              </p>
            </div>
          </div>

          {/* OSCC probability badge */}
          {latestInfo?.probability !== undefined && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-50/90 to-indigo-50/70 dark:from-blue-950/50 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-800/50 shadow-sm shrink-0">
              <Activity size={18} className="text-blue-600 dark:text-blue-400 animate-pulse" />
              <div>
                <p className="text-[10px] text-blue-800 dark:text-blue-300 uppercase font-bold tracking-wider leading-none mb-1">
                  Probabilitas OSCC
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-extrabold tabular-nums tracking-tight ${latestInfo.probability >= 70 ? 'text-red-600 dark:text-red-400' : latestInfo.probability >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {latestInfo.probability.toFixed(1)}%
                  </span>
                  {latestInfo.predClass && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wide border shadow-2xs ${latestInfo.predClass === 'OSCC' ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800' : 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'}`}>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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