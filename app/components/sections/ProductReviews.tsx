"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Star, MessageSquare, CheckCircle2, User, MapPin, Send, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  _id: string;
  userName: string;
  userLocation?: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    userName: "",
    userLocation: "",
    rating: 5,
    title: "",
    comment: ""
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, productId })
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ userName: "", userLocation: "", rating: 5, title: "", comment: "" });
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0, distribution: [0,0,0,0,0] };
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    const dist = [0,0,0,0,0];
    reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++;
    });
    return {
      avg: (total / reviews.length).toFixed(1),
      count: reviews.length,
      distribution: [...dist].reverse() // 5 to 1
    };
  }, [reviews]);

  if (loading) return <div className="py-20 text-center text-slate-400 font-black animate-pulse uppercase tracking-widest">Scanning Review Data...</div>;

  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between border-b border-slate-100 pb-10">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
          Trust <span className="text-slate-300">& Reviews</span>
        </h2>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-2xl shadow-slate-200 active:scale-95"
        >
          {showForm ? "Close Form" : "Write a Review"}
          {showForm ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <div className="bg-white border-2 border-slate-900 rounded-[3rem] p-8 md:p-16 animate-in zoom-in-95 duration-500 shadow-3xl">
           <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                 <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Submit Your Gear Report</h3>
                 <p className="text-slate-500 font-medium">Share your experience with the community.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-4">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Alex Johnson"
                      className="w-full px-8 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-slate-900"
                      value={formData.userName}
                      onChange={e => setFormData({...formData, userName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-4">Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. London, UK"
                      className="w-full px-8 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-slate-900"
                      value={formData.userLocation}
                      onChange={e => setFormData({...formData, userLocation: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-4">Combat Rating</label>
                  <div className="flex justify-center gap-4">
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                          formData.rating >= star ? "bg-orange-500 text-white shadow-xl shadow-orange-200 scale-110" : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                        )}
                      >
                        <Star size={24} fill={formData.rating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-4">Review Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Summarize your experience..."
                      className="w-full px-8 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-slate-900"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-4">Your Feedback</label>
                    <textarea 
                      required
                      rows={6}
                      placeholder="What makes this gear special?"
                      className="w-full px-8 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-slate-900 resize-none"
                      value={formData.comment}
                      onChange={e => setFormData({...formData, comment: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-6 bg-slate-900 text-white rounded-full font-black uppercase tracking-[0.3em] text-sm hover:bg-orange-600 transition-all shadow-3xl disabled:opacity-50"
                >
                  {submitting ? "Transmitting Report..." : "Submit Review"}
                </button>
              </form>
           </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center p-10 bg-slate-50 rounded-[3rem]">
              <div className="text-6xl font-black text-slate-900 italic tracking-tighter mb-4">{stats.avg}</div>
              <div className="flex items-center gap-1 text-orange-500 mb-4 scale-125">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16} fill={i <= Math.round(Number(stats.avg)) ? "currentColor" : "none"} strokeWidth={2.5} />
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{stats.count} Total Reviews</span>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {stats.distribution.map((count, i) => {
              const rating = 5 - i;
              const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-6 group">
                  <div className="flex items-center gap-2 min-w-[50px]">
                    <span className="text-sm font-black text-slate-900">{rating}</span>
                    <Star size={12} className="text-orange-500" fill="currentColor" />
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-900 group-hover:bg-orange-500 transition-all duration-1000 ease-out rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-black text-slate-400 min-w-[30px] text-right">{count}</span>
                </div>
              );
            })}
          </div>
      </div>

      {/* Individual Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white border-2 border-slate-50 p-10 rounded-[3rem] hover:border-slate-900 hover:shadow-3xl transition-all duration-500 flex flex-col h-full group">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-1">
                 {[1,2,3,4,5].map(i => (
                   <Star key={i} size={14} className={i <= review.rating ? "text-orange-500" : "text-slate-100"} fill={i <= review.rating ? "currentColor" : "none"} strokeWidth={2.5} />
                 ))}
               </div>
               <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 mb-6 leading-tight uppercase italic tracking-tighter">"{review.title}"</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-10 flex-1">
              {review.comment}
            </p>

            <div className="pt-8 border-t border-slate-50 mt-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-lg italic">
                    {review.userName.charAt(0)}
                 </div>
                 <div>
                    <div className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                       {review.userName}
                       {review.isVerified && <CheckCircle2 size={14} className="text-emerald-500" />}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                       <MapPin size={10} className="text-orange-500" />
                       {review.userLocation || "Verified Operative"}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && !showForm && (
        <div className="py-32 text-center bg-slate-50 rounded-[4rem]">
          <MessageSquare size={64} strokeWidth={1} className="mx-auto text-slate-300 mb-8" />
          <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">No Operative Reports Found</h3>
          <p className="text-slate-500 font-medium mt-3 max-w-sm mx-auto">Be the first to provide feedback on this high-performance gear.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-full font-black uppercase tracking-[0.3em] text-xs hover:bg-orange-600 transition-all shadow-xl"
          >
            Submit First Report
          </button>
        </div>
      )}
    </div>
  );
}
