'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, Truck, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyOrder();
    } else {
      router.push('/');
    }
  }, [sessionId]);

  const verifyOrder = async () => {
    try {
      const res = await fetch('/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
        // Clear cart after successful order
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="w-16 h-16 text-orange-600 animate-spin" />
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Securing Your Order...</h2>
        <p className="text-slate-500 font-medium">Verifying payment with Stripe and synchronizing inventory.</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Something went wrong.</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">We couldn't verify your payment. If you've been charged, please contact our support with your payment ID.</p>
        <Link href="/" className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black transition-all hover:bg-orange-600 active:scale-95">
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-10 inline-flex items-center justify-center w-24 h-24 bg-emerald-100 rounded-[2.5rem] text-emerald-600 shadow-xl shadow-emerald-900/10 animate-bounce">
          <CheckCircle size={48} />
        </div>
        
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-2">Order Confirmed!</h1>
        <p className="text-xl text-slate-500 font-medium italic mb-10">Your gear is being prepped for deployment.</p>

        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full -mr-16 -mt-16"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-10 border-b border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Order ID</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{order.orderId}</h2>
            </div>
            <Link 
              href={`/track-order?id=${order.orderId}`}
              className="group flex items-center gap-3 px-6 py-4 bg-orange-50 text-orange-600 rounded-2xl font-black text-sm hover:bg-orange-600 hover:text-white transition-all active:scale-95"
            >
              Track Live Progress
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                Delivery Address
              </h3>
              <p className="text-slate-900 font-bold leading-relaxed">{order.shippingAddress}</p>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                Deployment ETA
              </h3>
              <p className="text-slate-900 font-bold">2 - 4 Business Days</p>
              <p className="text-xs text-slate-400 font-medium mt-1 italic">Standard Logistics Track</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/" className="text-slate-400 font-bold hover:text-slate-900 transition-colors">
            Continue Shopping
          </Link>
          <div className="w-2 h-2 bg-slate-200 rounded-full hidden sm:block"></div>
          <p className="text-slate-500 font-medium">Need help? <span className="text-orange-600 font-black cursor-pointer">Contact Support</span></p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
