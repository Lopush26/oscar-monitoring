import { requireAdmin } from '@/lib/auth-server';
import AdminClient from './AdminClient';

export default function AdminPage() {
  requireAdmin();
  return <AdminClient />;
}