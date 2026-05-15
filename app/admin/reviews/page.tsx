'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Star, Trash2, Edit, CheckCircle2, XCircle, Search, Filter, MessageSquare, MapPin, Plus, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
  _id: string;
  productId: {
    title: string;
    _id: string;
  };
  userName: string;
  userLocation?: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: string;
}

export default function AdminReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New review form state
  const [formData, setFormData] = useState({
    productId: '',
    userName: '',
    userLocation: '',
    rating: 5,
    title: '',
    comment: '',
    status: 'approved'
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchReviews();
      fetchProducts();
    }
  }, [status]);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews?admin=true');
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ productId: '', userName: '', userLocation: '', rating: 5, title: '', comment: '', status: 'approved' });
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to create review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchReviews();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) fetchReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.productId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || r.status === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (status === 'loading' || loading) return (
    <div className="min-h-screen flex items-center justify-center">
       <Loader2 className="animate-spin text-orange-600" size={40} />
    </div>
  );
  if (!session) return null;

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-1 bg-orange-600 rounded-full"></span>
              <span className="text-orange-600 font-black uppercase tracking-widest text-[10px]">Feedback Management</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Combat Reports</h1>
            <p className="text-slate-500 font-medium italic text-sm">Moderate and manage gear field reports from operatives.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            {showForm ? "Cancel Entry" : "Manual Review Entry"}
            <Plus size={16} className={cn("transition-transform", showForm && "rotate-45")} />
          </button>
        </div>

        {/* Create Review Form Modal/Drawer */}
        {showForm && (
          <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-8 md:p-12 animate-in slide-in-from-top-4 duration-500 shadow-inner">
             <form onSubmit={handleCreateReview} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Target Product</label>
                      <select 
                        required
                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-orange-600 transition-all font-bold text-slate-900"
                        value={formData.productId}
                        onChange={e => setFormData({...formData, productId: e.target.value})}
                      >
                         <option value="">Select Gear...</option>
                         {products.map(p => (
                            <option key={p._id} value={p._id}>{p.title}</option>
                         ))}
                      </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Operative Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. John Doe"
                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-orange-600 transition-all font-bold text-slate-900"
                        value={formData.userName}
                        onChange={e => setFormData({...formData, userName: e.target.value})}
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Base Location</label>
                      <input 
                        type="text" 
                        placeholder="e.g. London, UK"
                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-orange-600 transition-all font-bold text-slate-900"
                        value={formData.userLocation}
                        onChange={e => setFormData({...formData, userLocation: e.target.value})}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Report Title</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Exceptional Gear"
                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-orange-600 transition-all font-bold text-slate-900"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Combat Rating</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(star => (
                           <button
                             key={star}
                             type="button"
                             onClick={() => setFormData({...formData, rating: star})}
                             className={cn(
                               "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                               formData.rating >= star ? "bg-orange-600 text-white" : "bg-white border border-slate-200 text-slate-300 hover:border-orange-600"
                             )}
                           >
                              <Star size={20} fill={formData.rating >= star ? "currentColor" : "none"} />
                           </button>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Combat Analysis (Comment)</label>
                   <textarea 
                     required
                     rows={4}
                     placeholder="Detailed feedback..."
                     className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-orange-600 transition-all font-bold text-slate-900 resize-none"
                     value={formData.comment}
                     onChange={e => setFormData({...formData, comment: e.target.value})}
                   />
                </div>

                <div className="flex justify-end gap-4">
                   <button 
                     type="button" 
                     onClick={() => setShowForm(false)}
                     className="px-8 py-4 bg-white text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-xl hover:text-slate-900 transition-all"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     disabled={submitting}
                     className="px-8 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-900 transition-all shadow-xl shadow-orange-900/20 disabled:opacity-50"
                   >
                     {submitting ? "Transmitting..." : "Finalize Report Entry"}
                   </button>
                </div>
             </form>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 p-8 bg-white border border-slate-200 rounded-[2.5rem]">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search reports by operative, gear, or intelligence..."
              className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-orange-600 transition-all font-bold text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl">
            <Filter size={18} className="text-slate-400" />
            <select 
              className="bg-transparent outline-none font-black text-slate-900 pr-4 uppercase text-xs tracking-widest"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Hidden</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredReviews.map((review) => (
            <div key={review._id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 group">
              <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
                {/* Product Info */}
                <div className="lg:w-1/4 space-y-3">
                   <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Target Gear</div>
                   <div className="font-black text-slate-900 leading-tight line-clamp-2 uppercase italic text-lg tracking-tighter">{review.productId?.title || 'Unknown Product'}</div>
                   <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14} className={i <= review.rating ? "text-orange-600" : "text-slate-100"} fill={i <= review.rating ? "currentColor" : "none"} strokeWidth={2.5} />
                      ))}
                   </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="font-black text-slate-900 italic uppercase text-lg tracking-tight">"{review.title}"</h3>
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                      review.status === 'approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      review.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" : 
                      "bg-slate-50 text-slate-600 border-slate-100"
                    )}>
                      {review.status}
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-2xl">{review.comment}</p>
                  <div className="flex items-center gap-8 pt-2">
                    <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                       <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                          <MessageSquare size={14} className="text-orange-600" />
                       </div>
                       {review.userName}
                    </div>
                    {review.userLocation && (
                      <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <MapPin size={14} className="text-orange-600" />
                        {review.userLocation}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-4 lg:items-end lg:min-w-[150px]">
                   <div className="flex gap-2">
                      {review.status !== 'approved' && (
                        <button 
                          onClick={() => updateStatus(review._id, 'approved')}
                          className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          title="Approve Report"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                      )}
                      {review.status !== 'hidden' && (
                        <button 
                          onClick={() => updateStatus(review._id, 'hidden')}
                          className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          title="Decommission Report"
                        >
                          <XCircle size={20} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteReview(review._id)}
                        className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        title="Erase Data"
                      >
                        <Trash2 size={20} />
                      </button>
                   </div>
                   <div className="text-[10px] font-bold text-slate-300 uppercase italic">Log ID: {review._id.slice(-6)} • {new Date(review.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="py-32 text-center bg-white rounded-[4rem] border border-slate-100">
            <MessageSquare size={64} strokeWidth={1} className="mx-auto text-slate-300 mb-8" />
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">No Reports Intercepted</h3>
            <p className="text-slate-500 font-medium mt-3">Adjust your tracking parameters to find specific data.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
