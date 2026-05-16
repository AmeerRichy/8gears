'use client';

import AdminLayout from '@/app/components/AdminLayout';
import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, Trash2, Download, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSubscribers();
  }, [search, filter]);

  const fetchSubscribers = async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (filter !== 'all') query.set('subscribed', filter === 'subscribed' ? 'true' : 'false');
    
    const res = await fetch(`/api/admin/subscribers?${query.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setSubscribers(data);
    }
    setLoading(false);
  };

  const toggleSubscription = async (email: string, currentStatus: boolean) => {
    const res = await fetch('/api/admin/subscribers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subscribed: !currentStatus }),
    });
    if (res.ok) {
      fetchSubscribers();
    }
  };

  const deleteSubscriber = async (email: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    
    const res = await fetch(`/api/admin/subscribers?email=${email}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchSubscribers();
    }
  };

  const exportCSV = () => {
    const headers = ['Email', 'Name', 'Phone', 'Source', 'Status', 'Joined At'];
    const rows = subscribers.map(s => [
      s.email,
      s.name || '',
      s.phone || '',
      s.source,
      s.subscribed ? 'Subscribed' : 'Unsubscribed',
      new Date(s.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "subscribers_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Subscribers</h1>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Global Marketing Cluster</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportCSV}
              className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search subscribers..."
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-orange-500/10 outline-none transition-all w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex bg-white p-1 border border-slate-200 rounded-2xl">
              {['all', 'subscribed', 'unsubscribed'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === opt ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="px-8 py-5">Subscriber Profile</th>
                <th className="px-8 py-5">Source</th>
                <th className="px-8 py-5">Preferences</th>
                <th className="px-8 py-5">Joined At</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscribers.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${s.subscribed ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                        {s.name?.charAt(0) || s.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm tracking-tight">{s.name || 'Anonymous'}</div>
                        <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <Mail size={10} />
                          {s.email}
                        </div>
                        {s.phone && (
                          <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Phone size={10} />
                            {s.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.source}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1">
                      {s.preferences.blogUpdates && <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">Blog</span>}
                      {s.preferences.productUpdates && <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">Products</span>}
                      {s.preferences.offers && <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">Offers</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <Calendar size={12} />
                      {new Date(s.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toggleSubscription(s.email, s.subscribed)}
                        className={`p-2 rounded-lg transition-all ${s.subscribed ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-50'}`}
                        title={s.subscribed ? "Unsubscribe" : "Subscribe"}
                      >
                        {s.subscribed ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                      <button 
                        onClick={() => deleteSubscriber(s.email)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic">No subscribers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
