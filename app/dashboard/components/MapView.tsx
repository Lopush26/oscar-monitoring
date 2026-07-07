// app/dashboard/components/MapView.tsx
'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// ============================================================
// INTERFACES
// ============================================================
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

// ============================================================
// DYNAMIC IMPORT (SSR = FALSE)
// ============================================================
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
) as any;

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
) as any;

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
) as any;

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
) as any;

// ============================================================
// KOMPONEN UTAMA
// ============================================================
export function MapView({ locations = [], center = [-2.5489, 118.0149], zoom = 5 }: MapViewProps) {
  // Fix Leaflet icon di client side
  useEffect(() => {
    const loadLeaflet = async () => {
      const L = await import('leaflet');
      // Hapus icon default bawaan Leaflet
      delete (L as any).Icon.Default.prototype._getIconUrl;
      (L as any).Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    };
    loadLeaflet();
  }, []);

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <h3 className="text-sm font-semibold mb-2">🗺️ Sebaran Kasus</h3>
      <div className="h-64 w-full rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.length > 0 ? (
            locations.map((loc, idx) => (
              <Marker key={idx} position={[loc.lat, loc.lng]}>
                <Popup>
                  {loc.label || `Lokasi ${idx + 1}`}
                  <br />
                  Intensitas: {loc.intensity !== undefined ? loc.intensity.toFixed(2) : 'N/A'}
                </Popup>
              </Marker>
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Belum ada lokasi yang tersedia
            </div>
          )}
        </MapContainer>
      </div>
    </div>
  );
}