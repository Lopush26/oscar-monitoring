// app/admin/AdminClient.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { UserPlus, Trash2, Shield, UserCheck, Key, RefreshCw } from 'lucide-react';

interface UserItem {
  id: number;
  username: string;
  role: 'admin' | 'dokter';
  created_at: string;
}

export default function AdminClient() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for adding user
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'dokter' | 'admin'>('dokter');
  const [submitting, setSubmitting] = useState(false);

  // Form states for reset password modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [resetPassword, setResetPassword] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      if (!res.ok) {
        setError(`Gagal memuat data (HTTP ${res.status})`);
        return;
      }
      const result = await res.json();
      const list = Array.isArray(result) ? result : (result.data || []);
      setUsers(list);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Terjadi kesalahan koneksi saat memuat data pengguna.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal menambahkan user baru.');
        setSubmitting(false);
        return;
      }

      setSuccessMsg(`User "${newUsername}" berhasil ditambahkan!`);
      setNewUsername('');
      setNewPassword('');
      setNewRole('dokter');
      setShowAddModal(false);
      fetchUsers();
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user "${user.username}"?`)) return;

    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal menghapus user.');
        return;
      }

      setSuccessMsg(`User "${user.username}" berhasil dihapus.`);
      fetchUsers();
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !resetPassword) return;

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: resetPassword }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal mengedit password.');
        setSubmitting(false);
        return;
      }

      setSuccessMsg(`Password user "${selectedUser.username}" berhasil diperbarui!`);
      setSelectedUser(null);
      setResetPassword('');
      setShowResetModal(false);
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const dokterCount = users.filter((u) => u.role === 'dokter').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Manajemen akun pengguna dan peran sistem OSCAR</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm"
          >
            <UserPlus size={16} />
            Tambah User Baru
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground text-sm font-medium rounded-lg transition-colors duration-200"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-xs underline font-semibold">Tutup</button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center justify-between">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-xs underline font-semibold">Tutup</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="glass-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Total Pengguna</p>
            <p className="text-3xl font-extrabold text-foreground mt-1 tabular-nums">{users.length}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <UserCheck size={20} />
          </div>
        </Card>
        <Card className="glass-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Akun Administrator</p>
            <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 tabular-nums">{adminCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Shield size={20} />
          </div>
        </Card>
        <Card className="glass-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Akun Dokter</p>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">{dokterCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <UserCheck size={20} />
          </div>
        </Card>
      </div>

      {/* Users Table Card */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Daftar Pengguna Terdaftar</h2>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Memuat daftar pengguna...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p>Belum ada user terdaftar dalam database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-2 text-muted-foreground font-semibold">ID</th>
                  <th className="py-3 px-2 text-muted-foreground font-semibold">Username</th>
                  <th className="py-3 px-2 text-muted-foreground font-semibold">Role</th>
                  <th className="py-3 px-2 text-muted-foreground font-semibold">Tgl Dibuat</th>
                  <th className="py-3 px-2 text-right text-muted-foreground font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-2 text-foreground font-mono text-xs">{user.id}</td>
                    <td className="py-3 px-2 font-medium text-foreground">{user.username}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30'
                        }`}
                      >
                        {user.role === 'admin' && <Shield size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }) : '-'}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowResetModal(true);
                          }}
                          className="px-2.5 py-1 rounded text-xs font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors inline-flex items-center gap-1"
                          title="Reset Password"
                        >
                          <Key size={13} />
                          Pass
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="px-2.5 py-1 rounded text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors inline-flex items-center gap-1"
                          title="Hapus User"
                        >
                          <Trash2 size={13} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal: Tambah User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md glass-card p-6 bg-background">
            <h3 className="text-xl font-bold text-foreground mb-4">Tambah User Baru</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan username"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dokter">Dokter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan User'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Modal: Reset Password */}
      {showResetModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md glass-card p-6 bg-background">
            <h3 className="text-xl font-bold text-foreground mb-2">Ganti Password User</h3>
            <p className="text-sm text-muted-foreground mb-4">Mengubah password untuk akun: <span className="font-semibold text-foreground">{selectedUser.username}</span></p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Password Baru</label>
                <input
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan password baru"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Memproses...' : 'Update Password'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
