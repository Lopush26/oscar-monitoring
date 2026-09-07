// app/dashboard/components/MapView.tsx
'use client';

import dynamic from 'next/dynamic';
import { MapPin, Maximize2, X, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useState, useEffect } from 'react';
import type { MapLocation } from './MapInner';

interface MapViewProps {
  locations?: MapLocation[];
  center?: [number, number];
  zoom?: number;
}

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full gap-2 bg-slate-50/80 dark:bg-slate-800/30 rounded-lg">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      <p className="text-xs text-muted-foreground">Memuat peta sebaran...</p>
    </div>
  ),
});

export function MapView({ locations = [], center = [-5.1477, 119.4327], zoom = 11 }: MapViewProps) {
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.message && (e.message.includes('leaflet') || e.message.includes('map'))) {
        setHasError(true);
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const osccCount = locations.filter((l) => l.predClass === 'OSCC').length;
  const normalCount = locations.filter((l) => l.predClass !== 'OSCC').length;

  return (
    <>
      {/* Dashboard mini-card */}
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
                  {locations.length > 0 ? `${locations.length} titik lokasi terdaftar` : 'Belum ada data lokasi'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-medium transition-colors cursor-pointer"
              title="Perluas Tampilan Peta"
            >
              <Maximize2 size={12} />
              <span className="hidden sm:inline">Perluas</span>
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div
            onClick={() => setIsModalOpen(true)}
            className="h-48 w-full rounded-lg overflow-hidden border border-border/40 cursor-pointer relative group"
          >
            {hasError ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 bg-slate-50/80 dark:bg-slate-800/30">
                <MapPin size={24} className="text-muted-foreground/40" strokeWidth={1.25} />
                <p className="text-xs text-muted-foreground">Gagal memuat peta</p>
              </div>
            ) : locations.length > 0 ? (
              <>
                <MapInner locations={locations} center={center} zoom={zoom} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none rounded-lg" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[400] bg-black/60 text-white px-3 py-1 rounded-full text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Klik untuk Memperbesar
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 bg-slate-50/80 dark:bg-slate-800/30">
                <MapPin size={24} className="text-muted-foreground/40" strokeWidth={1.25} />
                <p className="text-xs text-muted-foreground">Belum ada lokasi tersedia</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Full-page map modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-background">
          {/* Slim top bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <MapPin size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground leading-none">Peta Sebaran Kasus OSCC</h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">Makassar & Sekitarnya</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 text-xs font-semibold border border-red-200 dark:border-red-500/30">
                🔴 OSCC: {osccCount}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-500/30">
                🟢 Normal: {normalCount}
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="ml-2 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground flex items-center justify-center transition-colors"
                title="Tutup peta"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Map takes all remaining space */}
          <div className="flex-1 relative w-full">
            <MapInner locations={locations} center={center} zoom={12} />
          </div>

          {/* Minimal bottom hint bar */}
          <div className="px-4 py-2 border-t border-border bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Activity size={12} className="text-blue-500 shrink-0" />
              <span>Klik pin pada peta untuk melihat detail pasien</span>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-foreground text-xs font-medium rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}