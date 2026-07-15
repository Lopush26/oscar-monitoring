'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validasi input
    if (!username.trim() || !password.trim()) {
      setError('Username dan password harus diisi');
      setLoading(false);
      return;
    }

    try {
      console.log('📡 Mengirim login request...');

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
        credentials: 'include',
      });

      const data = await res.json();
      console.log('📡 Response status:', res.status);
      console.log('📡 Response data:', data);

      if (res.ok) {
        console.log('✅ Login sukses, redirect ke dashboard...');
        // Redirect ke dashboard
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Login gagal. Periksa username dan password.');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Terjadi kesalahan jaringan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            OSCAR
          </h1>
          <p className="text-slate-400 text-sm mt-2">OSCC Detection System</p>
        </div>

        {/* Card Login */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Login</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Demo: admin / admin123
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          OSCAR Elite System v1.2.1 | © 2026 Inovasi Medis
        </p>
      </div>
    </div>
  );
}