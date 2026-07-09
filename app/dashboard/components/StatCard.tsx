// app/dashboard/components/StatCard.tsx
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: number;
    label: string;
    up?: boolean;
  };
  subtitle?: string;
}

export function StatCard({ label, value, icon: Icon, iconColor, iconBg, trend, subtitle }: StatCardProps) {
  return (
    <Card className="glass-card card-hover p-5">
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {label}
            </p>
            <p className="stat-number text-foreground truncate">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                <span>{trend.up ? '↑' : '↓'} {trend.value}%</span>
                <span className="text-muted-foreground font-normal">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl ${iconBg}`}>
            <Icon size={22} className={iconColor} strokeWidth={1.75} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
