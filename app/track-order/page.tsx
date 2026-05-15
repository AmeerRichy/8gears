'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track/${orderId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Order not found');
      }

      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <Clock className="text-blue-500" />;
      case 'processing': return <Package className="text-purple-500" />;
      case 'shipped': return <Truck className="text-orange-500" />;
      case 'delivered': return <CheckCircle className="text-emerald-500" />;
      case 'cancelled': return <AlertCircle className="text-rose-500" />;
      default: return <Clock />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Track Your Gear</h1>
          <p className="text-slate-500 font-medium italic">Enter your Order ID (e.g. 8G-ABCDE-1234) to see real-time updates.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleTrack} className="mb-12">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="8G-XXXXX-XXXX"
              className="block w-full pl-16 pr-32 py-6 bg-white border-none rounded-3xl shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-orange-500/10 text-xl font-black tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-medium transition-all"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 px-8 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track Now'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl text-center">
            <AlertCircle className="mx-auto text-rose-500 mb-2" size={32} />
            <p className="text-rose-600 font-bold">{error}</p>
          </div>
        )}

        {order && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Order Brief */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    {getStatusIcon(order.orderStatus)}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{order.orderStatus}</h2>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Amount</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">Rs. {order.totalAmount}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-3">
                <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
                Tracking Timeline
              </h3>

              <div className="space-y-12 relative">
                <div className="absolute left-6 top-2 bottom-2 w-1 bg-slate-100"></div>
                {order.trackingTimeline.slice().reverse().map((step: any, idx: number) => (
                  <div key={idx} className="relative pl-16">
                    <div className={`absolute left-0 w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center z-10 border-4 border-white ${idx === 0 ? 'bg-orange-600 scale-110' : 'bg-slate-200'}`}>
                      {getStatusIcon(step.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className={`font-black uppercase tracking-tight ${idx === 0 ? 'text-slate-900 text-lg' : 'text-slate-500'}`}>
                          {step.status}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                          {new Date(step.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className={`font-medium ${idx === 0 ? 'text-slate-600' : 'text-slate-400 text-sm'}`}>
                        {step.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items Summary */}
            <div className="mt-8 bg-slate-900 rounded-[2.5rem] p-8 text-white">
              <h3 className="text-lg font-black mb-6">Package Contents</h3>
              <div className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight">{item.title}</p>
                        <p className="text-[10px] font-black text-white/50 uppercase">{item.color} / {item.size}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-orange-400">×{item.quantity}</p>
                      <p className="text-sm font-bold">Rs. {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
