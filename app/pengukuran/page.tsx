import { requireAuth } from '@/lib/auth-server';
import PengukuranClient from './PengukuranClient';

export default function PengukuranPage() {
  requireAuth();
  return <PengukuranClient />;
}