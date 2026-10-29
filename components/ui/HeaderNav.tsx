'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pengukuran', href: '/pengukuran' },
  { label: 'Verifikasi', href: '/verifikasi' },
  { label: 'Admin', href: '/admin' },
];

interface CurrentUser {
  userId?: number;
  username?: string;
  role?: string;
}

export default function HeaderNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (pathname === '/login') {
      setUser(null);
      return;
    }

    let isMounted = true;
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && (data.username || data.userId)) {
          setUser(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching user info:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

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

  const getInitials = (username?: string) => {
    if (!username) return 'DA';
    const clean = username.trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return 'Dokter';
    return role.toLowerCase() === 'admin' ? 'Admin' : 'Dokter';
  };

  return (
    <header className="header">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          {pathname === '/login' ? (
            <div className="flex items-center gap-3 text-xl font-bold select-none cursor-default">
              <Image
                src="/oscar-logo.png"
                alt="OSCAR Logo"
                width={36}
                height={36}
                className="rounded-xl object-contain"
              />
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  OSCAR
                </span>
                <span className="hidden text-xs font-medium text-slate-400 sm:inline-block">
                  Elite System
                </span>
              </div>
            </div>
          ) : (
            <Link href="/dashboard" className="flex items-center gap-3 text-xl font-bold group">
              <Image
                src="/oscar-logo.png"
                alt="OSCAR Logo"
                width={36}
                height={36}
                className="rounded-xl object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-300 transition-colors duration-300">
                  OSCAR
                </span>
                <span className="hidden text-xs font-medium text-slate-400 sm:inline-block">
                  Elite System
                </span>
              </div>
            </Link>
          )}

          {/* Desktop Nav - Only show if not on /login */}
          {pathname !== '/login' && (
            <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive(item.href) ? 'nav-link-active' : 'nav-link-inactive'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Profile & Actions */}
          <div className="flex items-center gap-3">
            {pathname !== '/login' ? (
              <>
                <div className="hidden sm:flex flex-col items-end text-right leading-tight">
                  <span className="text-sm font-semibold text-white">
                    {user?.username || 'Dokter / Admin'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {user?.role ? getRoleLabel(user.role) : 'Pengguna'}
                  </span>
                </div>
                
                <div
                  className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white font-semibold text-xs tracking-wider shadow-elegant-sm select-none"
                  title={user?.username ? `${user.username} (${getRoleLabel(user.role)})` : 'Profil Pengguna'}
                >
                  {getInitials(user?.username)}
                </div>

                <ThemeToggle />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut size={17} />
                  <span className="hidden sm:inline">Logout</span>
                </button>

                <button
                  className="md:hidden text-slate-300 hover:text-white transition-colors duration-200"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle navigation menu"
                >
                  <Menu size={25} />
                </button>
              </>
            ) : (
              <ThemeToggle />
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && pathname !== '/login' && (
          <nav className="md:hidden py-4 border-t border-slate-800/50 flex flex-col gap-3 animate-slide-up">
            {user && (
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800/50">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-semibold text-xs tracking-wider">
                  {getInitials(user.username)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    {user.username}
                  </span>
                  <span className="text-xs text-slate-400">
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </div>
            )}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.href) ? 'bg-primary text-white font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
              <ThemeToggle />
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}