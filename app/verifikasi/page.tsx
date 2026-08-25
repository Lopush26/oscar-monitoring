import { requireAuth } from '@/lib/auth-server';
import VerifikasiClient from './VerifikasiClient';

export default function VerifikasiPage() {
  requireAuth();
  return <VerifikasiClient />;
}