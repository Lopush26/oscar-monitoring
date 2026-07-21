// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users', { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          setUsers(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Manajemen pengguna dan sistem</p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          Kembali ke Dashboard
        </Link>
      </div>

      <Card className="glass-card p-6">
        {loading ? (
          <div className="text-muted-foreground">Memuat data...</div>
        ) : users.length === 0 ? (
          <div className="text-muted-foreground">Belum ada user terdaftar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-semibold">ID</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Username</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Role</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 text-foreground">{user.id}</td>
                    <td className="py-3 text-foreground">{user.username}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                      } transition-colors duration-300`}>
                        {user.role || 'dokter'}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}