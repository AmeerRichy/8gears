'use client';

import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Loader2, 
  Lock,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

export default function CheckoutForm() {
  const router = useRouter();
  const { cart, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Stripe' | 'PayPal'>('Stripe');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.phone || !form.address) return 'Please fill all details.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email address.';
    return null;
  };

  const handlePlaceOrder = async () => {
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (paymentMethod === 'Stripe') {
        const res = await fetch('/api/payment/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart,
            customer: {
              name: form.name,
              email: form.email,
              phone: form.phone
            },
            shippingAddress: form.address
          }),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error(data.error || 'Failed to initiate Stripe');
        }
      } else {
        // PayPal logic would go here, for now we redirect to a custom paypal handler or show buttons
        // In a real app, you'd show the PayPalButtons component here
        alert('PayPal integration is ready but requires client-side SDK configuration. Using Stripe for now.');
        setPaymentMethod('Stripe');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Your cart is empty</h2>
        <button onClick={() => router.push('/')} className="text-orange-600 font-bold hover:underline">Return to Store</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto px-4 py-16">
      {/* Left Column: Form */}
      <div className="lg:col-span-7 space-y-10">
        <section>
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <Truck size={24} />
             </div>
             <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Delivery Details</h2>
                <p className="text-slate-500 font-medium italic text-sm">Where should we deploy your gear?</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none font-bold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                name="email" value={form.email} onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none font-bold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <input 
                name="phone" value={form.phone} onChange={handleChange}
                placeholder="03XXXXXXXXX"
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none font-bold transition-all"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shipping Address</label>
              <textarea 
                name="address" value={form.address} onChange={handleChange}
                placeholder="Street address, City, Province"
                rows={3}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none font-bold transition-all resize-none"
              />
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <CreditCard size={24} />
             </div>
             <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Payment Method</h2>
                <p className="text-slate-500 font-medium italic text-sm">Secure transactions verified by global leaders.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => setPaymentMethod('Stripe')}
              className={`p-6 rounded-3xl border-2 flex flex-col items-start gap-4 transition-all ${paymentMethod === 'Stripe' ? 'border-orange-600 bg-orange-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            >
              <div className="flex justify-between w-full items-center">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                 {paymentMethod === 'Stripe' && <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white"><ShieldCheck size={14} /></div>}
              </div>
              <p className="text-xs font-bold text-slate-500 text-left">Pay securely using your Credit or Debit card via Stripe.</p>
            </button>

            <button 
              onClick={() => setPaymentMethod('PayPal')}
              className={`p-6 rounded-3xl border-2 flex flex-col items-start gap-4 transition-all ${paymentMethod === 'PayPal' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            >
              <div className="flex justify-between w-full items-center">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                 {paymentMethod === 'PayPal' && <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white"><ShieldCheck size={14} /></div>}
              </div>
              <p className="text-xs font-bold text-slate-500 text-left">The safer, easier way to pay online using PayPal.</p>
            </button>
          </div>
        </section>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-center gap-4 text-rose-600">
             <AlertCircle size={24} />
             <p className="font-bold">{error}</p>
          </div>
        )}
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-[3rem] p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-10">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-8 flex items-center gap-3">
             Order Summary
             <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">{cart.length} Items</span>
          </h3>

          <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                   <h4 className="font-black text-slate-900 leading-tight">{item.title}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{item.color} / {item.size}</p>
                   <div className="flex justify-between items-center mt-2">
                      <p className="text-sm font-bold text-slate-500">Qty: {item.quantity}</p>
                      <p className="font-black text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-8 mb-8">
            <div className="flex justify-between items-center">
               <span className="text-slate-500 font-medium">Subtotal</span>
               <span className="text-slate-900 font-bold">Rs. {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-slate-500 font-medium">Shipping</span>
               <span className="text-emerald-600 font-black uppercase text-xs">Calculated at Payment</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
               <span className="text-xl font-black text-slate-900">Total</span>
               <span className="text-3xl font-black text-orange-600 tracking-tighter">Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-orange-600 transition-all shadow-2xl shadow-slate-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Lock size={20} />}
            {loading ? 'Processing...' : 'Secure Checkout'}
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
             <ShieldCheck size={14} />
             Encrypted & SSL Secured
          </div>
        </div>
      </div>
    </div>
  );
}
