'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapLocation {
  lat: number;
  lng: number;
  intensity?: number;
  label?: string;
}

interface MapInnerProps {
  locations?: MapLocation[];
  center?: [number, number];
  zoom?: number;
}

export default function MapInner({ locations = [], center = [-2.5489, 118.0149], zoom = 5 }: MapInnerProps) {
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
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc, idx) => (
        <Marker key={idx} position={[loc.lat, loc.lng]}>
          <Popup>
            {loc.label || `Lokasi ${idx + 1}`}
            <br />
            Intensitas: {loc.intensity !== undefined ? loc.intensity.toFixed(2) : 'N/A'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}