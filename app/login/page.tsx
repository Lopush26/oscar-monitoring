// app/login/page.tsx
import { redirect } from 'next/navigation';

export default function LoginPage() {
  // Langsung redirect ke dashboard tanpa login
  redirect('/dashboard');
}