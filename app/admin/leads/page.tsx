'use client';

import AdminLayout from '@/app/components/AdminLayout';
import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedLead, setSelectedLead] = useState<any>(null);

  useEffect(() => {
    fetchLeads();
  }, [search, status]);

  const fetchLeads = async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (status) query.set('status', status);
    
    const res = await fetch(`/api/admin/leads?${query.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setLeads(data);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'started': return <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Started</span>;
      case 'payment_started': return <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">Payment Started</span>;
      case 'paid': return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Paid</span>;
      case 'abandoned': return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">Abandoned</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Checkout Leads</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by ID, name, email..."
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-orange-500/10 outline-none transition-all w-full md:w-80"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="started">Started</option>
              <option value="payment_started">Payment Started</option>
              <option value="paid">Paid</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="px-8 py-5">Lead ID / Date</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Items</th>
                <th className="px-8 py-5">Total</th>
                <th className="px-8 py-5">Method</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900 text-sm tracking-tight">{lead.leadId}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1">{new Date(lead.createdAt).toLocaleString()}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900 text-sm">{lead.customerInfo.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1">{lead.customerInfo.email}</div>
                    <div className="text-[10px] font-bold text-slate-400">{lead.customerInfo.phone}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-600">{lead.items.length} units</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-slate-900">{lead.currency} {lead.totalAmount.toFixed(2)}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lead.selectedPaymentMethod}</div>
                  </td>
                  <td className="px-8 py-6">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setSelectedLead(lead)}
                      className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-slate-400 font-bold italic">No checkout leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Lead Details</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedLead.leadId}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <AlertCircle size={24} className="text-slate-400 rotate-45" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer Profile</h4>
                    <div className="bg-slate-50 rounded-3xl p-6 space-y-3">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-bold text-slate-400">Name</span>
                        <span className="text-sm font-black text-slate-900">{selectedLead.customerInfo.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-bold text-slate-400">Email</span>
                        <span className="text-sm font-black text-slate-900">{selectedLead.customerInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-400">Phone</span>
                        <span className="text-sm font-black text-slate-900">{selectedLead.customerInfo.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Shipping Address</h4>
                    <div className="bg-slate-50 rounded-3xl p-6 text-sm font-bold text-slate-900 space-y-1">
                      <p>{selectedLead.shippingAddress.address}</p>
                      {selectedLead.shippingAddress.apartment && <p>{selectedLead.shippingAddress.apartment}</p>}
                      <p>{selectedLead.shippingAddress.city}, {selectedLead.shippingAddress.state} {selectedLead.shippingAddress.zip}</p>
                      <p>{selectedLead.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cart Snapshot</h4>
                  <div className="space-y-3">
                    {selectedLead.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-black text-slate-900">{item.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{item.color} / {item.size}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900">x{item.quantity}</p>
                          <p className="text-xs font-bold text-orange-600">{selectedLead.currency} {item.unitPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</p>
                      <p className="text-3xl font-black text-slate-900">{selectedLead.currency} {selectedLead.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {selectedLead.linkedOrderId && (
                  <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Converted Order</p>
                      <p className="text-lg font-black text-emerald-900">{selectedLead.linkedOrderId}</p>
                    </div>
                    <CheckCircle className="text-emerald-500" size={32} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
