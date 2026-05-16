'use client';

import AdminLayout from '@/app/components/AdminLayout';
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
  Calendar,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Box,
  UserCheck
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [search, paymentStatus, orderStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (paymentStatus) query.set('paymentStatus', paymentStatus);
    if (orderStatus) query.set('orderStatus', orderStatus);
    
    try {
      const res = await fetch(`/api/admin/orders?${query.toString()}`);
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
        body: JSON.stringify({ orderStatus: status, timelineMessage: message }),
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

  const updateFulfillment = async (id: string, data: any) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(o => o._id === id ? updatedOrder : o));
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      alert('Failed to update fulfillment');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'order_received': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'payment_confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'processing': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'packed': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'shipped': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'out_for_delivery': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'refunded': return 'bg-slate-50 text-slate-600 border-slate-100';
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
          <StatBox title="Active Orders" value={orders.filter(o => !['delivered', 'cancelled', 'refunded'].includes(o.orderStatus)).length} sub="Pending fulfillment" />
          <StatBox title="Verified Revenue" value={`${orders.filter(o => o.payment.paymentStatus === 'paid').reduce((acc, o) => acc + o.amounts.totalAmount, 0).toFixed(2)} USD`} sub="Completed payments" />
          <StatBox title="Processing" value={orders.filter(o => o.orderStatus === 'processing').length} sub="In packaging phase" />
          <StatBox title="Global Orders" value={orders.length} sub="Total lifetime orders" />
        </div>

        {/* Filters & Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/30">
            <div className="relative flex-[2]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by Order ID, Name, Email, Phone..."
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="flex-1 px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none font-black text-slate-700"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option value="">Order Status</option>
              <option value="order_received">Received</option>
              <option value="payment_confirmed">Paid</option>
              <option value="processing">Processing</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="flex-1 px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none font-black text-slate-700"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="">Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 bg-white">
                  <th className="px-8 py-6">Order ID & Tracking ID</th>
                  <th className="px-8 py-6">Customer</th>
                  <th className="px-8 py-6">Items</th>
                  <th className="px-8 py-6">Amount</th>
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
                ) : orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900 tracking-tight">{order.orderId}</div>
                      <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-0.5">
                        {order.trackingId}
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
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
                      <div className="font-black text-slate-900">{order.amounts.currency} {order.amounts.totalAmount.toFixed(2)}</div>
                      <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border w-fit mt-1 ${order.payment.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {order.payment.paymentStatus}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.replace(/_/g, ' ')}
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
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Deployment Detail</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Order #{selectedOrder.orderId}</h2>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tracking ID:</span>
                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{selectedOrder.trackingId}</span>
                </div>
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
                    Customer Profile
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
                      <div className="text-xs">
                        <p>{selectedOrder.shippingAddress.address}</p>
                        {selectedOrder.shippingAddress.apartment && <p>{selectedOrder.shippingAddress.apartment}</p>}
                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                    Payload Contents ({selectedOrder.items.length})
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
                          <p className="text-sm font-black text-slate-900">{selectedOrder.amounts.currency} {item.unitPrice.toFixed(2)}</p>
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
                    Deployment Control
                  </h3>
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-4">Master Status Override</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'order_received', 
                        'payment_confirmed', 
                        'processing', 
                        'packed', 
                        'shipped', 
                        'out_for_delivery', 
                        'delivered', 
                        'cancelled'
                      ].map((status) => (
                        <button
                          key={status}
                          disabled={updating || selectedOrder.orderStatus === status}
                          onClick={() => updateOrderStatus(selectedOrder._id, status)}
                          className={`py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50
                            ${selectedOrder.orderStatus === status 
                              ? 'bg-orange-600 text-white' 
                              : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                        >
                          {status.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 space-y-4">
                       <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Courier Manifest</p>
                       <div className="space-y-2">
                          <input 
                            type="text" 
                            placeholder="Courier Name (e.g. FedEx)"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-orange-500"
                            defaultValue={selectedOrder.shipping?.courierName}
                            onBlur={(e) => updateFulfillment(selectedOrder._id, { 'shipping.courierName': e.target.value })}
                          />
                          <input 
                            type="text" 
                            placeholder="Tracking Number"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-orange-500"
                            defaultValue={selectedOrder.shipping?.trackingNumber}
                            onBlur={(e) => updateFulfillment(selectedOrder._id, { 'shipping.trackingNumber': e.target.value })}
                          />
                       </div>
                    </div>
                  </div>
                </section>

                <section className="flex-1">
                   <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                    Logistics History
                  </h3>
                  <div className="bg-slate-50 rounded-3xl p-6 space-y-6 max-h-[300px] overflow-y-auto">
                    {selectedOrder.trackingTimeline.slice().reverse().map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-4 relative">
                        {idx !== selectedOrder.trackingTimeline.length - 1 && (
                          <div className="absolute left-2.5 top-8 bottom-0 w-0.5 bg-slate-200"></div>
                        )}
                        <div className={`w-5 h-5 rounded-full mt-1 shrink-0 ${idx === 0 ? 'bg-orange-600 animate-pulse' : 'bg-slate-300'}`}></div>
                        <div>
                          <p className={`font-black text-[10px] uppercase tracking-widest ${idx === 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.status.replace(/_/g, ' ')}
                          </p>
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

