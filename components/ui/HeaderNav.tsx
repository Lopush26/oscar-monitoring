'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogOut } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pengukuran', href: '/pengukuran' },
  { label: 'Verifikasi', href: '/verifikasi' },
  { label: 'Admin', href: '/admin' },
];

export default function HeaderNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0a0f1d]/90 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent text-2xl font-extrabold">
              OSCAR
            </span>
            <span className="hidden text-xs font-normal text-slate-400 sm:inline-block">
              Elite System
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-white ${
                  isActive(item.href) ? 'text-blue-400' : 'text-slate-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Profile & Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-400 sm:block">Dokter / Admin</span>
            
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              DA
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              className="md:hidden text-slate-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-slate-800/60 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-white ${
                  isActive(item.href) ? 'text-blue-400' : 'text-slate-400'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}