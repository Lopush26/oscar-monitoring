// lib/utils.ts
import { v4 as uuidv4 } from 'uuid';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function generateTrackingId(): string {
  return `OSC-${uuidv4()}`;
}

export function obfuscateCoordinates(lat: number, lng: number): { lat: number; lng: number } {
  const offset = (Math.random() - 0.5) * 0.01;
  return {
    lat: parseFloat((lat + offset).toFixed(6)),
    lng: parseFloat((lng + offset).toFixed(6)),
  };
}

export function formatDate(date: Date): string {
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function isOSCC(probability: number): boolean {
  return probability > 0.5;
}

export function getStatusBadge(status: string): { label: string; color: string } {
  switch (status) {
    case 'raw':
      return { label: '⏳ Menunggu', color: 'bg-yellow-100 text-yellow-800' };
    case 'verified':
      return { label: '✅ Diverifikasi', color: 'bg-green-100 text-green-800' };
    case 'rejected':
      return { label: '❌ Ditolak', color: 'bg-red-100 text-red-800' };
    default:
      return { label: '❓ Unknown', color: 'bg-gray-100 text-gray-800' };
  }
}

// Helper untuk menggabungkan class Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}