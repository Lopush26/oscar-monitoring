// app/dashboard/components/MapView.tsx
'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useState, useEffect } from 'react';

interface MapLocation {
  lat: number;
  lng: number;
  intensity?: number;
  label?: string;
}

interface MapViewProps {
  locations?: MapLocation[];
  center?: [number, number];
  zoom?: number;
}

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full gap-2 bg-slate-50/80 dark:bg-slate-800/30 rounded-lg">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      <p className="text-[10px] text-muted-foreground">Memuat peta...</p>
    </div>
  ),
});

export function MapView({ locations = [], center = [-2.5489, 118.0149], zoom = 5 }: MapViewProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.message && (e.message.includes('leaflet') || e.message.includes('map'))) {
        setHasError(true);
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/30">
              <MapPin size={14} className="text-teal-600 dark:text-teal-400" strokeWidth={1.75} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Sebaran Kasus</CardTitle>
              <p className="text-[10px] text-muted-foreground">
                {locations.length > 0 ? `${locations.length} lokasi terdaftar` : 'Belum ada data lokasi'}
              </p>
            </div>
          </div>
          {locations.length > 0 && (
            <span className="badge badge-info">{locations.length} titik</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 w-full rounded-lg overflow-hidden border border-border/40">
          {hasError ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 bg-slate-50/80 dark:bg-slate-800/30">
              <MapPin size={24} className="text-muted-foreground/40" strokeWidth={1.25} />
              <p className="text-xs text-muted-foreground">Gagal memuat peta</p>
            </div>
          ) : locations.length > 0 ? (
            <MapInner locations={locations} center={center} zoom={zoom} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 bg-slate-50/80 dark:bg-slate-800/30">
              <MapPin size={24} className="text-muted-foreground/40" strokeWidth={1.25} />
              <p className="text-xs text-muted-foreground">Belum ada lokasi tersedia</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}