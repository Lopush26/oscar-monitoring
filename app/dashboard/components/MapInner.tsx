'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

export interface MapLocation {
  lat: number;
  lng: number;
  label?: string;
  trackingId?: string;
  patientId?: string;
  area?: string;
  probability?: number;
  predClass?: string;
  status?: string;
  mirna31?: number | string;
  lactate?: string | number;
  il8?: number | string;
}

interface MapInnerProps {
  locations?: MapLocation[];
  center?: [number, number];
  zoom?: number;
}

export default function MapInner({ locations = [], center = [-5.1477, 119.4327], zoom = 11 }: MapInnerProps) {
  useEffect(() => {
    // Fix Leaflet marker icons in Next.js client-side
    delete (L as any).Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc, idx) => {
        const isOscc = loc.predClass === 'OSCC';
        const trackingId = loc.trackingId || loc.label;
        const probStr = loc.probability !== undefined ? `${loc.probability.toFixed(1)}%` : 'N/A';

        return (
          <Marker key={idx} position={[loc.lat, loc.lng]}>
            <Popup className="oscar-map-popup">
              <div className="p-1 min-w-[200px] text-slate-900">
                <div className="flex items-center justify-between border-b pb-1.5 mb-2">
                  <span className="font-mono text-xs font-bold text-slate-800">
                    ID: {loc.patientId || trackingId}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isOscc ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {loc.predClass || 'Normal'}
                  </span>
                </div>

                <div className="space-y-1 text-xs mb-2">
                  <p className="flex justify-between">
                    <span className="text-slate-500">Probabilitas OSCC:</span>
                    <strong className={isOscc ? 'text-red-600' : 'text-emerald-600'}>{probStr}</strong>
                  </p>
                  {loc.area && (
                    <p className="flex justify-between">
                      <span className="text-slate-500">Lokasi Wilayah:</span>
                      <span className="font-medium text-slate-700">{loc.area}</span>
                    </p>
                  )}
                  {loc.mirna31 && (
                    <p className="flex justify-between text-[11px] text-slate-600">
                      <span>miRNA-31: {loc.mirna31} RQ</span>
                      <span>IL-8: {loc.il8} pg/mL</span>
                    </p>
                  )}
                </div>

                {trackingId && (
                  <Link
                    href={`/verify/${trackingId}`}
                    className="block text-center w-full mt-2 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold no-underline"
                  >
                    Lihat Detail Verifikasi →
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}