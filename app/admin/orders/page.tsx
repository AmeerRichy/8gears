'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  Clock, 
  Package, 
  CheckCircle, 
  XCircle,
  MoreVertical,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string, message?: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, message }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(o => o._id === id ? updatedOrder : o));
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || o.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'processing': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'shipped': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Order Logistics</h1>
            <p className="text-slate-500 font-medium italic mt-1">Monitor fulfillment, tracking, and payment verification.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse ml-2"></span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest mr-2">Sync Active</span>
          </div>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatBox title="Active Orders" value={orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length} sub="Pending fulfillment" />
          <StatBox title="Total Revenue" value={`Rs. ${orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}`} sub="Verified payments" />
          <StatBox title="Processing" value={orders.filter(o => o.orderStatus === 'processing').length} sub="In packaging phase" />
          <StatBox title="Out for Delivery" value={orders.filter(o => o.orderStatus === 'shipped').length} sub="With logistics partner" />
        </div>

        {/* Filters & Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/30">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by Order ID or Customer Name..."
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none font-black text-slate-700 min-w-[200px]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="received">Received</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 bg-white">
                  <th className="px-8 py-6">Order ID & Date</th>
                  <th className="px-8 py-6">Customer</th>
                  <th className="px-8 py-6">Items</th>
                  <th className="px-8 py-6">Payment</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                   Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-8 py-6 h-20 bg-slate-50/50"></td>
                    </tr>
                  ))
                ) : filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900 tracking-tight">{order.orderId}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900">{order.customerInfo.name}</div>
                      <div className="text-xs text-slate-400 font-medium">{order.customerInfo.email}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item: any, idx: number) => (
                          <div key={idx} className="w-10 h-10 rounded-xl border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 rounded-xl border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900">Rs. {order.totalAmount}</div>
                      <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border w-fit mt-1 ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                        className="p-3 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Logistics Detail</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Order #{selectedOrder.orderId}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-white rounded-2xl text-slate-400 transition-all">
                <XCircle size={28} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Customer & Items */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                    Customer Information
                  </h3>
                  <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center gap-4 text-slate-600 font-bold">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400">
                        <Phone size={18} />
                      </div>
                      {selectedOrder.customerInfo.phone}
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 font-bold">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400">
                        <Mail size={18} />
                      </div>
                      {selectedOrder.customerInfo.email}
                    </div>
                    <div className="flex items-start gap-4 text-slate-600 font-bold">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                        <MapPin size={18} />
                      </div>
                      {selectedOrder.shippingAddress}
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                    Order Items ({selectedOrder.items.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl">
                        <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden shrink-0">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-slate-900 leading-tight">{item.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{item.color} / {item.size}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900">Rs. {item.price}</p>
                          <p className="text-xs font-bold text-orange-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Status Control & Timeline */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                    Logistics Control
                  </h3>
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-4">Set Deployment Status</p>
                    <div className="grid grid-cols-2 gap-3">
                      {['received', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          disabled={updating || selectedOrder.orderStatus === status}
                          onClick={() => updateOrderStatus(selectedOrder._id, status)}
                          className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50
                            ${selectedOrder.orderStatus === status 
                              ? 'bg-orange-600 text-white' 
                              : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="flex-1">
                   <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                    Deployment History
                  </h3>
                  <div className="bg-slate-50 rounded-3xl p-6 space-y-6 max-h-[300px] overflow-y-auto">
                    {selectedOrder.trackingTimeline.slice().reverse().map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-4 relative">
                        {idx !== selectedOrder.trackingTimeline.length - 1 && (
                          <div className="absolute left-2.5 top-8 bottom-0 w-0.5 bg-slate-200"></div>
                        )}
                        <div className={`w-5 h-5 rounded-full mt-1 shrink-0 ${idx === 0 ? 'bg-orange-600 animate-pulse' : 'bg-slate-300'}`}></div>
                        <div>
                          <p className={`font-black text-[10px] uppercase tracking-widest ${idx === 0 ? 'text-slate-900' : 'text-slate-400'}`}>{step.status}</p>
                          <p className="text-sm font-bold text-slate-600 leading-tight mt-1">{step.message}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{new Date(step.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function StatBox({ title, value, sub }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-xl transition-all">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <div className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{value}</div>
      <p className="text-xs font-bold text-slate-400 italic">{sub}</p>
    </div>
  );
}
