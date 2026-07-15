// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Panel</h1>
          <p className="text-muted-foreground">Manajemen pengguna dan sistem</p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Kembali ke Dashboard
        </Link>
      </div>

      {loading ? (
        <div className="text-white">Memuat data...</div>
      ) : users.length === 0 ? (
        <div className="text-slate-400">Belum ada user terdaftar.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 text-slate-400">ID</th>
                <th className="text-left py-2 text-slate-400">Username</th>
                <th className="text-left py-2 text-slate-400">Role</th>
                <th className="text-left py-2 text-slate-400">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="border-b border-slate-800/50">
                  <td className="py-2 text-slate-300">{user.id}</td>
                  <td className="py-2 text-slate-300">{user.username}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role || 'dokter'}
                    </span>
                  </td>
                  <td className="py-2 text-slate-400 text-xs">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}