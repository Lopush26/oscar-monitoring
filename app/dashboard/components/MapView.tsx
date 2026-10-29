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
    <div className="flex flex-col items-center justify-center h-full gap-2 bg-muted/50 rounded-xl border border-dashed border-border">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
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
      <Card className="card-hover" variant="hover" accent="teal">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/50 border border-teal-200 dark:border-teal-800/30">
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
              className="btn-secondary btn-sm"
            >
              <Maximize2 size={12} className="mr-1" />
              <span className="hidden sm:inline">Perluas</span>
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div
            onClick={() => setIsModalOpen(true)}
            className="h-48 w-full rounded-xl overflow-hidden border border-border/60 cursor-pointer relative group map-container"
          >
            {hasError ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 bg-muted/50">
                <MapPin size={24} className="text-muted-foreground/40" strokeWidth={1.25} />
                <p className="text-xs text-muted-foreground">Gagal memuat peta</p>
              </div>
            ) : locations.length > 0 ? (
              <>
                <MapInner locations={locations} center={center} zoom={zoom} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none rounded-xl" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[400] bg-black/70 text-white px-3 py-1 rounded-full text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Klik untuk Memperbesar
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 bg-muted/50">
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
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/95 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/50 border border-teal-200 dark:border-teal-800/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <MapPin size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground leading-none">Peta Sebaran Kasus OSCC</h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">Makassar & Sekitarnya</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="badge badge-danger">🔴 OSCC: {osccCount}</span>
              <span className="badge badge-success">🟢 Normal: {normalCount}</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="ml-2 w-8 h-8 rounded-xl bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center transition-colors border border-border"
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
          <div className="px-4 py-2 border-t border-border bg-card/95 backdrop-blur-sm flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Activity size={12} className="text-primary shrink-0" />
              <span>Klik pin pada peta untuk melihat detail pasien</span>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary btn-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}