// app/dashboard/components/BiomarkerCards.tsx
interface BiomarkerCardProps {
  /** Judul biomarker */
  title: string;
  /** Nilai saat ini */
  value: number | string;
  /** Satuan (misal: pg/mL, mM) */
  unit: string;
  /** Warna aksen (opsional) */
  color?: 'blue' | 'green' | 'orange' | 'purple';
  /** Callback saat tombol edit diklik */
  onEdit?: () => void;
}

function BiomarkerCard({ title, value, unit, color = 'blue', onEdit }: BiomarkerCardProps) {
  const colorClasses = {
    blue: 'border-blue-500/30 bg-blue-50 dark:bg-blue-950/20',
    green: 'border-green-500/30 bg-green-50 dark:bg-green-950/20',
    orange: 'border-orange-500/30 bg-orange-50 dark:bg-orange-950/20',
    purple: 'border-purple-500/30 bg-purple-50 dark:bg-purple-950/20',
  };

  return (
    <div
      className={`relative rounded-xl border p-4 shadow-sm transition hover:shadow-md ${colorClasses[color]} dark:border-slate-700`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{unit}</p>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="rounded-md p-1 text-muted-foreground hover:bg-white/50 hover:text-foreground"
            aria-label="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

interface BiomarkerCardsProps {
  /** Array data biomarker */
  data?: BiomarkerCardProps[];
  /** Callback saat tombol edit diklik (diteruskan ke masing-masing card) */
  onEdit?: (index: number) => void;
}

export function BiomarkerCards({ data, onEdit }: BiomarkerCardsProps) {
  const defaultData: BiomarkerCardProps[] = [
    { title: 'miRNA-31', value: '--', unit: 'RQ', color: 'blue' },
    { title: 'Asam Laktat', value: '--', unit: 'mM', color: 'orange' },
    { title: 'IL-8', value: '--', unit: 'pg/mg', color: 'green' },
  ];

  const items = data || defaultData;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <BiomarkerCard
          key={item.title}
          {...item}
          onEdit={onEdit ? () => onEdit(index) : undefined}
        />
      ))}
    </div>
  );
}