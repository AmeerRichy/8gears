'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/app/components/AdminLayout';
import { ADMIN_PAGES } from '@/lib/adminPermissions';
import { Edit3, Eye, EyeOff, Loader2, Plus, ShieldCheck, Trash2, X } from 'lucide-react';

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: 'super_admin' | 'user';
  customRoleName: string;
  allowedPages: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
};

const emptyForm = {
  _id: '', name: '', email: '', username: '', password: '',
  role: 'user' as 'super_admin' | 'user', customRoleName: '',
  allowedPages: [] as string[], isActive: true,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load users');
      setUsers(data.users || []);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadUsers(); }, [loadUsers]);

  const openEdit = (user?: AdminUser) => {
    setForm(user ? {
      _id: user._id, name: user.name, email: user.email, username: user.username,
      password: '', role: user.role, customRoleName: user.customRoleName || '',
      allowedPages: user.allowedPages || [], isActive: user.isActive,
    } : emptyForm);
    setMessage(null);
    setShowPassword(false);
    setModalOpen(true);
  };

  const saveUser = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(form._id ? `/api/admin/users/${form._id}` : '/api/admin/users', {
        method: form._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save user');
      setModalOpen(false);
      setMessage({ type: 'success', text: form._id ? 'User updated successfully.' : 'User created successfully.' });
      await loadUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save user' });
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Permanently delete ${user.name} (${user.email})?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      setMessage({ type: 'success', text: 'User deleted successfully.' });
      await loadUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to delete user' });
    }
  };

  const togglePage = (href: string) => setForm((current) => ({
    ...current,
    allowedPages: current.allowedPages.includes(href)
      ? current.allowedPages.filter((page) => page !== href)
      : [...current.allowedPages, href],
  }));

  const selectablePages = ADMIN_PAGES.filter(
    (page) => (!('superAdminOnly' in page) || !page.superAdminOnly) && page.href !== '/admin'
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">User Management</h1>
            <p className="mt-1 font-medium text-slate-500">Create panel users and control exactly which pages they can access.</p>
          </div>
          <button onClick={() => openEdit()} className="flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-4 text-sm font-black text-white hover:bg-orange-700">
            <Plus size={19} /> Create User
          </button>
        </header>

        {message && <div className={`rounded-2xl border p-4 text-sm font-bold ${message.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{message.text}</div>}

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          {loading ? <div className="flex h-48 items-center justify-center"><Loader2 className="animate-spin text-orange-600" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400"><tr><th className="px-7 py-5">User</th><th className="px-7 py-5">Role</th><th className="px-7 py-5">Access</th><th className="px-7 py-5">Status</th><th className="px-7 py-5 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => <tr key={user._id} className="hover:bg-slate-50/60">
                    <td className="px-7 py-5"><div className="font-black text-slate-900">{user.name}</div><div className="text-xs text-slate-500">{user.email} · @{user.username}</div>{user.lastLoginAt && <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">Last login {new Date(user.lastLoginAt).toLocaleString()}</div>}</td>
                    <td className="px-7 py-5"><span className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase ${user.role === 'super_admin' ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-700'}`}>{user.role === 'super_admin' ? 'Super Admin' : user.customRoleName}</span></td>
                    <td className="max-w-sm px-7 py-5"><div className="flex flex-wrap gap-1">{user.role === 'super_admin' ? <span className="text-xs font-bold text-emerald-600">All controls</span> : user.allowedPages.length ? user.allowedPages.map((page) => <span key={page} className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-600">{ADMIN_PAGES.find((item) => item.href === page)?.label || page}</span>) : <span className="text-xs text-slate-400">Dashboard only</span>}</div></td>
                    <td className="px-7 py-5"><span className={`text-xs font-black ${user.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>{user.isActive ? 'Active' : 'Disabled'}</span></td>
                    <td className="px-7 py-5 text-right"><button onClick={() => openEdit(user)} className="rounded-xl p-3 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"><Edit3 size={18} /></button><button onClick={() => deleteUser(user)} className="rounded-xl p-3 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={18} /></button></td>
                  </tr>)}
                  {!users.length && <tr><td colSpan={5} className="p-12 text-center font-bold text-slate-400">No users found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalOpen && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
        <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 p-7"><div><h2 className="text-2xl font-black text-slate-900">{form._id ? 'Edit User' : 'Create User'}</h2><p className="text-sm text-slate-500">Passwords are securely hashed and cannot be viewed later.</p></div><button onClick={() => !saving && setModalOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X /></button></div>
          <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-2">
            <Field label="Full name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-user-input" /></Field>
            <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="admin-user-input" /></Field>
            <Field label="Username"><input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="admin-user-input" /></Field>
            <Field label={form._id ? 'New password (optional)' : 'Password (minimum 8 characters)'}><div className="relative"><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="admin-user-input pr-12" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></Field>
            <Field label="Account type"><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'super_admin' | 'user', allowedPages: [] })} className="admin-user-input"><option value="user">Limited user</option><option value="super_admin">Super admin</option></select></Field>
            <Field label="Status"><select value={form.isActive ? 'active' : 'disabled'} onChange={(e) => setForm({ ...form, isActive: e.target.value === 'active' })} className="admin-user-input"><option value="active">Active</option><option value="disabled">Disabled</option></select></Field>
            {form.role === 'user' && <><div className="md:col-span-2"><Field label="Role name"><input value={form.customRoleName} onChange={(e) => setForm({ ...form, customRoleName: e.target.value })} placeholder="Example: Order Manager" className="admin-user-input" /></Field></div><div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="mb-4 flex items-center justify-between"><div><h3 className="font-black text-slate-900">Allowed Pages</h3><p className="text-xs text-slate-500">Dashboard access is included automatically.</p></div><button onClick={() => setForm({ ...form, allowedPages: selectablePages.map((page) => page.href) })} className="text-xs font-black text-orange-600">Select all</button></div><div className="grid gap-3 sm:grid-cols-2">{selectablePages.map((page) => <label key={page.href} className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.allowedPages.includes(page.href)} onChange={() => togglePage(page.href)} className="h-4 w-4 accent-orange-600" />{page.label}</label>)}</div></div></>}
            {form.role === 'super_admin' && <div className="md:col-span-2 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-800"><ShieldCheck className="shrink-0" />Super-admin users receive every current and future admin permission.</div>}
          </div>
          {message?.type === 'error' && <div className="mx-7 mb-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{message.text}</div>}
          <div className="flex justify-end gap-3 border-t border-slate-100 p-7"><button onClick={() => setModalOpen(false)} disabled={saving} className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-600">Cancel</button><button onClick={saveUser} disabled={saving} className="flex min-w-36 items-center justify-center rounded-xl bg-slate-900 px-5 py-3 font-black text-white hover:bg-orange-600 disabled:opacity-50">{saving ? <Loader2 className="animate-spin" size={18} /> : form._id ? 'Update User' : 'Create User'}</button></div>
        </div>
      </div>}
      <style jsx global>{`.admin-user-input{width:100%;border:1px solid #e2e8f0;border-radius:.75rem;padding:.8rem 1rem;outline:none;font-weight:600}.admin-user-input:focus{border-color:#f97316;box-shadow:0 0 0 3px rgba(249,115,22,.08)}`}</style>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>{children}</label>;
}
