// app/admin/AdminClient.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
    <div className="section">
      {/* Header Bar */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">Manajemen akun pengguna dan peran sistem OSCAR</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowAddModal(true)} icon={<UserPlus size={16} />} iconPosition="left" size="sm">
            Tambah User Baru
          </Button>
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-xs underline font-semibold text-destructive hover:text-destructive/80">Tutup</button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-center justify-between">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-xs underline font-semibold">Tutup</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="card-hover" variant="hover" accent="blue">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="stat-label">Total Pengguna</p>
              <p className="stat-value">{users.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <UserCheck size={22} />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover" variant="hover" accent="violet">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="stat-label">Akun Administrator</p>
              <p className="stat-value text-purple-600 dark:text-purple-400">{adminCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Shield size={22} />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover" variant="hover" accent="emerald">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="stat-label">Akun Dokter</p>
              <p className="stat-value text-emerald-600 dark:text-emerald-400">{dokterCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <UserCheck size={22} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table Card */}
      <Card className="card-hover" variant="hover" accent="blue">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Daftar Pengguna Terdaftar</CardTitle>
            <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} iconPosition="right" onClick={fetchUsers} disabled={loading}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">
              <div className="spinner mx-auto mb-3" />
              <p className="text-sm">Memuat daftar pengguna...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>Belum ada user terdaftar dalam database.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="table">
                <thead>
                  <tr>
                    <th className="pl-6 pr-4">ID</th>
                    <th className="px-4">Username</th>
                    <th className="px-4">Role</th>
                    <th className="px-4">Tgl Dibuat</th>
                    <th className="pr-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="pl-6 pr-4 text-foreground font-mono text-xs">{user.id}</td>
                      <td className="px-4 font-medium text-foreground">{user.username}</td>
                      <td className="px-4">
                        <span className={`badge ${user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/30' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/30'}`}>
                          {user.role === 'admin' && <Shield size={12} className="mr-1" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 text-muted-foreground text-xs">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }) : '-'}
                      </td>
                      <td className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Key size={13} />}
                            iconPosition="left"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowResetModal(true);
                            }}
                            className="text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300"
                          >
                            Password
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            icon={<Trash2 size={13} />}
                            iconPosition="left"
                            onClick={() => handleDeleteUser(user)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal: Tambah User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md card-hover animate-scale-in" variant="hover" accent="blue">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Tambah User Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <Input
                    label="Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Masukkan username"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    label="Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="input"
                  >
                    <option value="dokter">Dokter</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)} size="sm">
                    Batal
                  </Button>
                  <Button type="submit" disabled={submitting} size="sm">
                    {submitting ? 'Menyimpan...' : 'Simpan User'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal: Reset Password */}
      {showResetModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md card-hover animate-scale-in" variant="hover" accent="amber">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Ganti Password User</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Mengubah password untuk akun: <span className="font-semibold text-foreground">{selectedUser.username}</span></p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    label="Password Baru"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="Masukkan password baru"
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="ghost" type="button" onClick={() => { setShowResetModal(false); setSelectedUser(null); }} size="sm">
                    Batal
                  </Button>
                  <Button variant="destructive" type="submit" disabled={submitting} size="sm">
                    {submitting ? 'Memproses...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}