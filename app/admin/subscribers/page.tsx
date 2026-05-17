'use client';

import AdminLayout from '@/app/components/AdminLayout';
import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, Trash2, Download, ToggleLeft, ToggleRight, Send, LayoutTemplate, X, Image as ImageIcon, Tag, MousePointerClick, Eye } from 'lucide-react';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyTarget, setNotifyTarget] = useState<'single' | 'all'>('single');
  const [selectedEmail, setSelectedEmail] = useState('');
  
  // Campaign Builder State
  const [products, setProducts] = useState<any[]>([]);
  const [templateType, setTemplateType] = useState('custom'); // custom, product_launch, discount
  const [subject, setSubject] = useState('Important Update from 8 GEARS');
  const [message, setMessage] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [buttonText, setButtonText] = useState('Visit Store');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchSubscribers();
    fetchProducts();
  }, [search, filter]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to fetch products for campaign builder", e);
    }
  };

  useEffect(() => {
    if (templateType === 'product_launch') {
      setSubject('🚀 New Product Drop from 8 GEARS');
      setMessage("We just dropped something incredible. Be the first to check out our latest arrival.\n\nCrafted with premium materials and engineered for performance.");
      setButtonText('Explore New Arrival');
    } else if (templateType === 'discount') {
      setSubject('🔥 Special Discount Just For You');
      setMessage("As a thank you for being a loyal subscriber, we're giving you an exclusive discount on your next purchase.\n\nUse the code below at checkout to claim your offer.");
      setButtonText('Claim Offer Now');
    } else {
      setSubject('Important Update from 8 GEARS');
      setMessage('');
      setButtonText('Visit Store');
      setSelectedProductId('');
      setDiscountCode('');
    }
  }, [templateType]);

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

  const openNotifyModal = (target: 'single' | 'all', email: string = '') => {
    setNotifyTarget(target);
    setSelectedEmail(email);
    setTemplateType('custom');
    setNotifyModalOpen(true);
  };

  const closeNotifyModal = () => {
    setNotifyModalOpen(false);
    setSelectedEmail('');
  };

  const sendNotification = async () => {
    if (!message.trim()) return alert("Please enter a message.");
    setIsSending(true);
    
    // Find selected product to pass details
    const selectedProduct = products.find(p => p._id === selectedProductId);
    const productPayload = selectedProduct ? {
      title: selectedProduct.title,
      image: selectedProduct.variants[0]?.images[0],
      url: `${window.location.origin}/product/${selectedProduct.slug}`
    } : null;

    try {
      const res = await fetch('/api/admin/subscribers/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedEmail,
          templateType,
          subject,
          message,
          product: productPayload,
          discountCode,
          buttonText,
          sendToAll: notifyTarget === 'all'
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert(`Notification sent successfully to ${notifyTarget === 'all' ? data.count + ' subscribers' : 'subscriber'}!`);
        closeNotifyModal();
      } else {
        alert("Failed to send: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      alert("Error sending notification.");
    }
    setIsSending(false);
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
              onClick={() => openNotifyModal('all')}
              className="px-6 py-3 bg-orange-500 text-white border border-transparent rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-orange-600 transition-all active:scale-95"
            >
              <Send size={18} />
              Notify All
            </button>
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
                        onClick={() => openNotifyModal('single', s.email)}
                        className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="Notify User"
                      >
                        <Send size={18} />
                      </button>
                      <button 
                        onClick={() => deleteSubscriber(s.email)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete User"
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

        {/* Campaign Builder Modal */}
        {notifyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-white rounded-[2rem] w-full max-w-6xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh]">
              
              {/* Left Column: Settings */}
              <div className="w-full md:w-1/2 p-8 border-r border-slate-100 flex flex-col h-full overflow-y-auto bg-slate-50/50 relative">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <LayoutTemplate className="text-orange-500" />
                      Campaign Builder
                    </h2>
                    <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
                      {notifyTarget === 'all' ? 'Broadcasting to All Subscribers' : `Direct Message to ${selectedEmail}`}
                    </p>
                  </div>
                  <button onClick={closeNotifyModal} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200 transition-all md:hidden">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6 flex-1">
                  {/* Template Selection */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Select Template</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'custom', label: 'Custom', icon: Mail },
                        { id: 'product_launch', label: 'Product Drop', icon: ImageIcon },
                        { id: 'discount', label: 'Discount', icon: Tag },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTemplateType(t.id)}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${templateType === t.id ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'}`}
                        >
                          <t.icon size={24} />
                          <span className="text-xs font-bold">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject Line</label>
                    <input 
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
                      placeholder="Enter subject line..."
                    />
                  </div>

                  {/* Product Selection (Conditional) */}
                  {(templateType === 'product_launch' || templateType === 'discount') && (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Attach Product</label>
                      <select 
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
                      >
                        <option value="">-- Select a Product --</option>
                        {products.map(p => (
                          <option key={p._id} value={p._id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Discount Code (Conditional) */}
                  {templateType === 'discount' && (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Discount Code</label>
                      <input 
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-orange-600 outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm uppercase tracking-widest"
                        placeholder="e.g. SUMMER20"
                      />
                    </div>
                  )}

                  {/* Main Message */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Body Content</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your amazing email here..."
                      rows={6}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20 resize-none shadow-sm"
                    ></textarea>
                  </div>

                  {/* CTA Button */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Button Text</label>
                    <div className="relative">
                      <MousePointerClick className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text"
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Preview */}
              <div className="w-full md:w-1/2 bg-slate-200 p-8 flex flex-col h-full relative">
                <button onClick={closeNotifyModal} className="absolute top-8 right-8 p-2 bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200 transition-all hidden md:block z-10">
                  <X size={20} />
                </button>
                
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Eye size={14} /> Live Email Preview
                </h3>
                
                <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-y-auto w-full max-w-[400px] mx-auto border border-slate-100 flex flex-col relative">
                  {/* Email Header */}
                  <div className="bg-slate-900 p-6 text-center shrink-0">
                    <h1 className="text-white text-xl font-black tracking-[0.2em] m-0 uppercase">8 GEARS</h1>
                  </div>
                  
                  {/* Email Body */}
                  <div className="p-6 text-slate-700 flex-1">
                    {templateType !== 'custom' && selectedProductId && (
                      <div className="text-center mb-6">
                        {products.find(p => p._id === selectedProductId)?.variants[0]?.images[0] ? (
                          <img src={products.find(p => p._id === selectedProductId)?.variants[0].images[0]} alt="Product" className="w-full h-auto rounded-xl shadow-md" />
                        ) : (
                          <div className="w-full h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                            <ImageIcon size={48} />
                          </div>
                        )}
                        <h2 className="text-xl font-black text-slate-900 mt-4 uppercase tracking-tight">
                          {products.find(p => p._id === selectedProductId)?.title || 'Product Name'}
                        </h2>
                      </div>
                    )}
                    
                    <div className="text-sm leading-relaxed whitespace-pre-wrap mb-6 text-slate-600">
                      {message || <span className="text-slate-300 italic">Your message will appear here...</span>}
                    </div>

                    {templateType === 'discount' && discountCode && (
                      <div className="bg-orange-50 border-2 border-dashed border-orange-300 rounded-xl p-4 text-center mb-6">
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Use Code at Checkout</p>
                        <p className="font-mono text-2xl font-black text-orange-600 tracking-widest">{discountCode}</p>
                      </div>
                    )}

                    {buttonText && (
                      <div className="text-center mt-6">
                        <div className="inline-block bg-orange-500 text-white font-black uppercase tracking-wider py-3 px-6 rounded-lg text-sm shadow-md">
                          {buttonText}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Email Footer */}
                  <div className="bg-slate-50 p-6 text-center border-t border-slate-100 shrink-0">
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      You are receiving this email because you subscribed to updates from 8 GEARS.<br/>
                      If you wish to unsubscribe, please contact our support team.
                    </p>
                  </div>
                </div>

                {/* Actions at the bottom of preview column */}
                <div className="mt-8 shrink-0 flex gap-4 w-full max-w-[400px] mx-auto">
                  <button 
                    onClick={closeNotifyModal}
                    className="flex-1 py-4 px-4 rounded-xl border-2 border-slate-300 bg-white text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all"
                    disabled={isSending}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={sendNotification}
                    className="flex-1 py-4 px-4 rounded-xl bg-orange-500 text-white font-black uppercase tracking-widest text-sm hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={isSending}
                  >
                    {isSending ? 'Sending...' : <><Send size={18} /> Send</>}
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
