'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, User, AlertCircle } from 'lucide-react';

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

      window.location.href = '/dashboard';
    } catch (err) {
      setError('Terjadi kesalahan jaringan');
      setLoading(false);
    }
  };

  return (
    <div className="login-container relative">
      {/* Ambient light ornament - subtle glow behind card */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl opacity-50" />
      </div>

      <Card className="login-card animate-slide-up" variant="hover" accent="blue">
        <CardHeader className="space-y-2 flex flex-col items-center pb-4">
          <div className="relative mb-4 flex items-center justify-center">
            <Image
              src="/oscar-logo.png"
              alt="Logo OSCAR"
              width={96}
              height={96}
              priority
              className="rounded-xl object-contain drop-shadow-[0_4px_12px_rgba(15,23,42,0.08)]"
            />
          </div>
          <CardTitle className="text-2xl text-center font-bold text-foreground">Login OSCAR</CardTitle>
          <p className="text-sm text-muted-foreground text-center font-medium">Sistem Deteksi Dini OSCC</p>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={handleLogin} className="space-y-5 mt-6">
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3 animate-fade-in">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                leftIcon={<User size={20} className="text-muted-foreground" />}
                label="Username"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                leftIcon={<Lock size={20} className="text-muted-foreground" />}
                label="Password"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground font-medium">
              OSCAR Elite System v1.1.1
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-1.5">
              © 2026 PKM KC UNHAS
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}