import { requireAuth } from '@/lib/auth-server';
import DashboardClient from './DashboardClient';

export default function DashboardPage() {
  // 1. Authenticate server-side via cookies()
  requireAuth();

  // 2. Render client component if authenticated
  return <DashboardClient />;
}