'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login gagal');
        setLoading(false);
        return;
      }

      // Success, redirect
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Terjadi kesalahan jaringan');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] p-4">
      <Card className="w-full max-w-md glass border-slate-800 p-6">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <CardTitle className="text-2xl text-center text-white font-bold">Login OSCAR</CardTitle>
          <p className="text-slate-400 text-sm text-center">
            Masukkan kredensial untuk mengakses dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            {error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 transition-colors"
                placeholder="Masukkan username"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 transition-colors"
                placeholder="Masukkan password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}