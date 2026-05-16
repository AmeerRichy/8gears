'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import {
  Check,
  CreditCard,
  HelpCircle,
  Loader2,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';

type Step = 'personal' | 'payment' | 'confirm';

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function CheckoutForm() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();

  const paypalRef = useRef<HTMLDivElement | null>(null);

  const [step, setStep] = useState<Step>('personal');
  const [loading, setLoading] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalRendered, setPaypalRendered] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successData, setSuccessData] = useState({ orderId: '', trackingId: '' });
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Stripe' | 'PayPal' | 'Test'>('Stripe');
  const [leadId, setLeadId] = useState<string | null>(null);

  const saveLead = async (statusOverride?: string) => {
    try {
      const res = await fetch('/api/checkout/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            address: form.address,
            apartment: form.apartment,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
          selectedPaymentMethod: statusOverride ? paymentMethod : 'unknown',
          subscribe: form.subscribe,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setLeadId(data.leadId);
      }
    } catch (err) {
      console.error('Lead saving failed:', err);
    }
  };

  const handleSubscriber = async () => {
    if (!form.subscribe) return;
    try {
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          source: 'checkout',
        }),
      });
    } catch (err) {
      console.error('Subscriber saving failed:', err);
    }
  };

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    apartment: '',
    country: 'United States',
    city: '',
    state: '',
    zip: '',
    phone: '',
    subscribe: false,
  });

  const shipping = 10;

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const firstItem = cart[0];

  const orderNumber = useMemo(() => {
    return `#8G-${Math.floor(10000 + Math.random() * 90000)}`;
  }, []);

  useEffect(() => {
    if (paymentMethod !== 'PayPal') return;
    if (paypalLoaded) return;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (!clientId) {
      setError('PayPal client ID is missing.');
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-paypal-sdk="true"]'
    );

    if (existingScript) {
      setPaypalLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.dataset.paypalSdk = 'true';

    script.onload = () => {
      setPaypalLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load PayPal. Please try again.');
    };

    document.body.appendChild(script);
  }, [paymentMethod, paypalLoaded]);

  useEffect(() => {
    if (step !== 'confirm') return;
    if (paymentMethod !== 'PayPal') return;
    if (!paypalLoaded) return;
    if (!window.paypal) return;
    if (!paypalRef.current) return;

    paypalRef.current.innerHTML = '';
    setPaypalRendered(true);

    window.paypal
      .Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'pill',
          label: 'paypal',
          height: 48,
        },

        createOrder: async () => {
          setError('');

          const res = await fetch('/api/payment/paypal/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cart.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
              })),
              customer: {
                name: form.name,
                email: form.email,
                phone: form.phone,
              },
              shippingAddress: {
                address: form.address,
                apartment: form.apartment,
                city: form.city,
                state: form.state,
                zip: form.zip,
                country: form.country,
              },
              leadId,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.id) {
            throw new Error(data.error || 'Failed to create PayPal order.');
          }

          return data.id;
        },

        onApprove: async (data: any) => {
          setLoading(true);
          setError('');

          try {
            const res = await fetch('/api/payment/paypal/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderID: data.orderID,
              }),
            });

            const result = await res.json();

            if (!res.ok) {
              throw new Error(result.error || 'PayPal payment failed.');
            }

            clearCart?.();
            setSuccessData({ orderId: result.orderId, trackingId: result.trackingId });
            setSuccessOpen(true);
          } catch (err: any) {
            setError(err.message || 'PayPal payment failed.');
          } finally {
            setLoading(false);
          }
        },

        onError: () => {
          setError('PayPal payment failed. Please try again.');
        },
      })
      .render(paypalRef.current);
  }, [
    step,
    paymentMethod,
    paypalLoaded,
    cart,
    form.name,
    form.email,
    form.phone,
    form.address,
    form.apartment,
    form.city,
    form.state,
    form.zip,
    form.country,
    clearCart,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePersonal = () => {
    if (!form.name.trim()) return 'Please enter your full name.';
    if (!form.email.trim()) return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return 'Please enter a valid email address.';
    }
    if (!form.address.trim()) return 'Please enter your address.';
    if (!form.city.trim()) return 'Please enter your city.';
    if (!form.state.trim()) return 'Please enter your state.';
    if (!form.zip.trim()) return 'Please enter your ZIP code.';
    if (!form.phone.trim()) return 'Please enter your phone number.';
    return null;
  };

  const goToPayment = () => {
    const err = validatePersonal();

    if (err) {
      setError(err);
      return;
    }

    setError('');
    setStep('payment');
    saveLead();
    handleSubscriber();
  };

  const goToConfirm = () => {
    setError('');
    setPaypalRendered(false);
    setStep('confirm');
    saveLead('payment_started');
  };


  const handleStripeCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payment/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            address: form.address,
            apartment: form.apartment,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
          leadId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to start Stripe checkout.');
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  const handleTestPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payment/test-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            address: form.address,
            apartment: form.apartment,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
          leadId,
          subscribe: form.subscribe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process test payment.');
      }

      clearCart?.();
      setSuccessData({ orderId: data.orderId, trackingId: data.trackingId });
      setSuccessOpen(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };


  if (cart.length === 0 && !successOpen) {
    return (
      <main className="min-h-screen bg-white">
        <CheckoutHeader />

        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-black">
            Your cart is empty
          </h2>

          <button
            onClick={() => router.push('/')}
            className="rounded-full bg-black px-10 py-4 text-sm font-bold uppercase tracking-wide text-white"
          >
            Back to Shop
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-sans text-black">
      <CheckoutHeader />

      <section className="grid min-h-[calc(100vh-92px)] grid-cols-1 lg:grid-cols-2">
        <div className="flex justify-center bg-white px-5 py-10 lg:justify-end lg:px-20 lg:py-16">
          <div className="w-full max-w-[560px]">
            <BackButton step={step} setStep={setStep} />

            <CheckoutSteps step={step} />

            {step === 'personal' && (
              <div className="mt-10">
                <h2 className="mb-5 text-[19px] font-medium tracking-tight">
                  Delivery
                </h2>

                <div className="space-y-4">
                  <CheckoutInput
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name*"
                  />

                  <CheckoutInput
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email*"
                  />

                  <CheckoutInput
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company (optional)"
                  />

                  <div className="relative">
                    <CheckoutInput
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Address*"
                      className="pr-12"
                    />

                    <Search
                      size={17}
                      strokeWidth={1.7}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-black/45"
                    />
                  </div>

                  <CheckoutInput
                    name="apartment"
                    value={form.apartment}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc. (optional)"
                  />

                  <div className="relative">
                    <label className="pointer-events-none absolute left-5 top-[8px] text-[12px] text-black/50">
                      Country/Region*
                    </label>

                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="h-[58px] w-full rounded-[5px] border border-black/55 bg-white px-5 pb-2 pt-5 text-[14px] font-semibold text-black outline-none transition focus:border-black"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Pakistan</option>
                      <option>United Arab Emirates</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <CheckoutInput
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City*"
                    />

                    <CheckoutInput
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State*"
                    />

                    <CheckoutInput
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      placeholder="ZIP Code*"
                    />
                  </div>

                  <div className="relative">
                    <CheckoutInput
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone*"
                      className="pr-12"
                    />

                    <HelpCircle
                      size={17}
                      strokeWidth={1.5}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-black/45"
                    />
                  </div>
                </div>

                <label className="mt-4 flex cursor-pointer items-center gap-3 text-[15px] text-black">
                  <input
                    type="checkbox"
                    name="subscribe"
                    checked={form.subscribe}
                    onChange={handleChange}
                    className="h-[18px] w-[18px] rounded border border-black/40 accent-black"
                  />
                  Subscribe for news and offers
                </label>

                {error && <ErrorMessage message={error} />}

                <button
                  onClick={goToPayment}
                  className="mt-5 h-[58px] w-full rounded-full bg-black text-[14px] font-bold tracking-wide text-white transition hover:bg-black/85"
                >
                  Proceed to Payment
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="mt-10">
                <h2 className="text-[22px] font-semibold tracking-tight">
                  Payment
                </h2>

                <p className="mt-1 text-[13px] tracking-wide text-black/45">
                  All transactions are secure and encrypted.
                </p>

                <div className="mt-6 overflow-hidden rounded-[4px] border border-black/55">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Stripe')}
                    className="flex w-full items-center justify-between border-b border-black/20 bg-white px-4 py-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-[3px] flex h-[12px] w-[12px] items-center justify-center rounded-full border border-black">
                        {paymentMethod === 'Stripe' && (
                          <span className="h-[7px] w-[7px] rounded-full bg-black" />
                        )}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-semibold">
                            Credit/Debit Card
                          </span>

                          <span className="rounded-sm bg-[#f4f4f4] px-2 py-[3px] text-[9px] font-semibold text-black/65">
                            Powered by Stripe
                          </span>
                        </div>

                        <p className="mt-2 max-w-[360px] text-[12px] leading-[1.45] text-black/50">
                          You will be redirected to Stripe&apos;s secure checkout
                          page to complete your payment.
                        </p>
                      </div>
                    </div>

                    <div className="hidden items-center gap-1 sm:flex">
                      <span className="rounded-sm bg-white px-1 text-[9px] font-bold text-[#1634a3] shadow-sm">
                        VISA
                      </span>
                      <span className="h-[13px] w-[22px] rounded-sm bg-[#ff5f00]" />
                      <span className="rounded-sm bg-[#2374bd] px-1 text-[8px] font-bold text-white">
                        AMEX
                      </span>
                      <span className="text-[10px] font-semibold text-black/60">
                        +2
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PayPal')}
                    className="flex w-full items-center justify-between bg-[#fafafa] px-4 py-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-[3px] flex h-[12px] w-[12px] items-center justify-center rounded-full border border-black/30">
                        {paymentMethod === 'PayPal' && (
                          <span className="h-[7px] w-[7px] rounded-full bg-black" />
                        )}
                      </span>

                      <div>
                        <span className="text-[14px] font-semibold">Paypal</span>

                        <p className="mt-2 max-w-[360px] text-[12px] leading-[1.45] text-black/50">
                          Pay with your PayPal account using PayPal&apos;s secure
                          checkout popup.
                        </p>
                      </div>
                    </div>

                    <span className="text-[13px] font-bold italic text-[#003087]">
                      Pay<span className="text-[#009cde]">Pal</span>
                    </span>
                  </button>

                  {process.env.NEXT_PUBLIC_ENABLE_TEST_PAYMENT === 'true' && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Test')}
                      className="flex w-full items-center justify-between border-t border-black/20 bg-[#fffbeb] px-4 py-4 text-left"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-[3px] flex h-[12px] w-[12px] items-center justify-center rounded-full border border-black/30">
                          {paymentMethod === 'Test' && (
                            <span className="h-[7px] w-[7px] rounded-full bg-black" />
                          )}
                        </span>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold text-amber-900">
                              Test Payment / Manual Confirm
                            </span>
                            <span className="rounded-sm bg-amber-200 px-2 py-[3px] text-[9px] font-black text-amber-900 uppercase">
                              Development Only
                            </span>
                          </div>

                          <p className="mt-2 max-w-[360px] text-[12px] leading-[1.45] text-amber-800/70">
                            Use this to simulate a successful purchase without
                            live credentials. Stock will be reduced.
                          </p>
                        </div>
                      </div>

                      <HelpCircle size={18} className="text-amber-600" />
                    </button>
                  )}
                </div>

                <p className="mt-4 text-[12px] font-medium italic text-black/45">
                  &quot;Prices are charged in USD. Your bank or payment provider
                  may apply currency conversion fees.&quot;
                </p>

                {error && <ErrorMessage message={error} />}

                <button
                  onClick={goToConfirm}
                  className="mt-6 h-[58px] w-full rounded-full bg-black text-[14px] font-bold tracking-wide text-white transition hover:bg-black/85"
                >
                  Review Order
                </button>
              </div>
            )}

            {step === 'confirm' && (
              <div className="mt-10">
                <div className="rounded-[4px] border border-black/55 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[14px] text-black/65">
                        Personal Information
                      </h3>

                      <div className="mt-3 space-y-1 text-[14px] font-semibold leading-[1.45] text-black">
                        <p>{form.name}</p>
                        <p>{form.email}</p>
                        <p>
                          {form.address}
                          {form.apartment ? `, ${form.apartment}` : ''}
                        </p>
                        <p>{form.country}</p>
                        <p>
                          {form.city}
                          {form.state ? `, ${form.state}` : ''} {form.zip}
                        </p>
                        <p>{form.phone}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep('personal')}
                      className="text-[12px] font-bold underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="mt-5 border-t border-black/10 pt-5">
                    <h3 className="text-[14px] text-black/65">
                      Payment Method
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-[14px] font-semibold">
                      <CreditCard size={17} />
                      {paymentMethod === 'Stripe' ? (
                        <span>Credit/Debit Card via Stripe</span>
                      ) : paymentMethod === 'PayPal' ? (
                        <span>PayPal</span>
                      ) : (
                        <span className="text-amber-600 font-bold">Test Payment / Manual Confirm</span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-[13px] leading-[1.55] tracking-wide text-black">
                  By placing your order, you agree to 8GEAR&apos;s{' '}
                  <a className="font-semibold underline" href="#">
                    privacy notice
                  </a>{' '}
                  and{' '}
                  <a className="font-semibold underline" href="#">
                    Terms of use
                  </a>
                  .
                </p>

                {error && <ErrorMessage message={error} />}

                {paymentMethod === 'Stripe' ? (
                  <button
                    onClick={handleStripeCheckout}
                    disabled={loading}
                    className="mt-5 flex h-[58px] w-full items-center justify-center rounded-full bg-black text-[14px] font-bold tracking-wide text-white transition hover:bg-black/85 disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      'Continue to Stripe'
                    )}
                  </button>
                ) : paymentMethod === 'PayPal' ? (
                  <div className="mt-5">
                    {!paypalLoaded && (
                      <div className="flex h-[58px] w-full items-center justify-center rounded-full bg-black text-white">
                        <Loader2 size={20} className="animate-spin" />
                      </div>
                    )}

                    <div ref={paypalRef} />

                    {paypalLoaded && !paypalRendered && (
                      <p className="mt-3 text-center text-[12px] font-medium text-black/45">
                        Loading PayPal button...
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleTestPayment}
                    disabled={loading}
                    className="mt-5 flex h-[58px] w-full items-center justify-center rounded-full bg-amber-600 text-[14px] font-bold tracking-wide text-white transition hover:bg-amber-700 disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      'Confirm Test Payment'
                    )}
                  </button>
                )}

              </div>
            )}

            <PolicyLinks />
          </div>
        </div>

        <OrderSummary
          firstItem={firstItem}
          itemCount={itemCount}
          total={total}
          shipping={shipping}
        />
      </section>

      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-5 backdrop-blur-[1px]">
          <div className="w-full max-w-[520px] rounded-[16px] bg-white px-8 py-12 text-center shadow-2xl">
            <div className="mx-auto flex h-[86px] w-[86px] items-center justify-center rounded-full border-[6px] border-black">
              <Check size={48} strokeWidth={3.2} />
            </div>

            <h2 className="mt-8 text-[30px] font-bold tracking-tight">
              Order Confirmed
            </h2>

            <p className="mx-auto mt-3 max-w-[330px] text-[14px] leading-[1.35] tracking-[0.06em] text-black/80">
              Thank you for your purchase. Your order{' '}
              <span className="font-bold">{successData.orderId}</span> has been
              placed and is being processed.
            </p>

            <div className="mt-5 rounded-lg bg-gray-50 p-4 text-left">
              <p className="text-[12px] font-semibold text-black/45 uppercase">Tracking ID</p>
              <p className="text-[16px] font-bold text-black">{successData.trackingId}</p>
            </div>

            <button
              onClick={() => router.push('/track-order')}
              className="mt-9 h-[54px] w-full rounded-full bg-black text-[12px] font-bold uppercase tracking-wide text-white"
            >
              Track Order
            </button>

            <button
              onClick={() => router.push('/')}
              className="mt-4 h-[54px] w-full rounded-full border border-black bg-white text-[12px] font-bold uppercase tracking-wide text-black"
            >
              Back to Shop
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function CheckoutHeader() {
  return (
    <header className="flex h-[92px] items-center justify-center border-b border-black/[0.03] bg-white">
      <button
        type="button"
        className="text-[30px] font-black leading-none tracking-[-0.08em] text-black"
      >
        8<span className="ml-1 text-[25px] tracking-[-0.08em]">GEAR</span>
        <span className="mx-auto mt-[2px] block h-[2px] w-[44px] bg-black" />
        <span className="mx-auto mt-[3px] block h-[2px] w-[32px] bg-black" />
      </button>
    </header>
  );
}

function BackButton({
  step,
  setStep,
}: {
  step: Step;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (step === 'personal') window.history.back();
        if (step === 'payment') setStep('personal');
        if (step === 'confirm') setStep('payment');
      }}
      className="mb-8 flex items-center gap-3 text-[12px] font-bold underline underline-offset-2"
    >
      <span className="text-[18px] leading-none">‹</span>
      {step === 'personal' ? 'Back to Cart' : 'Back to Personal Information'}
    </button>
  );
}

function CheckoutSteps({ step }: { step: Step }) {
  const steps = [
    {
      key: 'personal',
      label: 'Personal Information',
      icon: User,
    },
    {
      key: 'payment',
      label: 'Payment Method',
      icon: CreditCard,
    },
    {
      key: 'confirm',
      label: 'Confirm',
      icon: ShieldCheck,
    },
  ] as const;

  const activeIndex = steps.findIndex((item) => item.key === step);

  return (
    <div className="relative mb-8">
      <div className="absolute left-[31px] right-[31px] top-[23px] h-[3px] bg-black/[0.06]">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{
            width: activeIndex === 0 ? '0%' : activeIndex === 1 ? '50%' : '100%',
          }}
        />
      </div>

      <div className="relative grid grid-cols-3">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const completed = index < activeIndex || step === 'confirm';
          const active = index === activeIndex;

          return (
            <div key={item.key} className="flex flex-col items-center text-center">
              <div
                className={[
                  'flex h-[46px] w-[46px] items-center justify-center rounded-full border transition-all duration-300',
                  completed || active
                    ? 'border-black bg-black text-white'
                    : 'border-black/10 bg-white text-black/45',
                ].join(' ')}
              >
                {completed ? <Check size={18} /> : <Icon size={18} strokeWidth={1.6} />}
              </div>

              <span className="mt-3 max-w-[92px] text-[12px] font-medium leading-[1.15] text-black">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CheckoutInput({
  name,
  value,
  onChange,
  placeholder,
  className = '',
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={[
        'h-[49px] w-full rounded-[5px] border border-black/55 bg-white px-5 text-[13px] font-medium text-black outline-none transition placeholder:text-black/45 focus:border-black',
        className,
      ].join(' ')}
    />
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
      {message}
    </div>
  );
}

function PolicyLinks() {
  return (
    <div className="mt-9 flex flex-wrap items-center justify-between gap-4 text-[12px] font-semibold">
      <a href="#" className="underline underline-offset-2">
        Refund policy
      </a>
      <a href="#" className="underline underline-offset-2">
        Privacy policy
      </a>
      <a href="#" className="underline underline-offset-2">
        Terms of service
      </a>
      <a href="#" className="underline underline-offset-2">
        Cancellations
      </a>
    </div>
  );
}

function OrderSummary({
  firstItem,
  itemCount,
  total,
  shipping,
}: {
  firstItem: any;
  itemCount: number;
  total: number;
  shipping: number;
}) {
  return (
    <aside className="bg-[#f6f6f6] px-5 py-10 lg:px-20 lg:py-16">
      <div className="mx-auto w-full max-w-[560px] lg:mx-0">
        {firstItem && (
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="relative h-[92px] w-[92px] shrink-0 overflow-visible rounded-[18px]">
                <img
                  src={firstItem.image}
                  alt={firstItem.title}
                  className="h-full w-full rounded-[18px] border border-black/10 object-cover shadow-md"
                />

                <span className="absolute -right-3 -top-3 flex h-[34px] min-w-[34px] items-center justify-center rounded-[9px] bg-black px-2 text-[18px] font-bold text-white">
                  {itemCount}
                </span>
              </div>

              <div className="pt-4">
                <h3 className="text-[18px] font-bold uppercase tracking-[0.08em]">
                  {firstItem.title}
                </h3>

                <p className="mt-4 text-[15px] font-medium text-black/45">
                  {firstItem.size || firstItem.color || 'XL'}
                </p>
              </div>
            </div>

            <div className="pt-5 text-right text-[22px] font-bold">
              ${Number(firstItem.price || 0).toFixed(2)}
            </div>
          </div>
        )}

        <div className="mt-12 space-y-5">
          <div className="flex items-center justify-between text-[15px]">
            <span>
              Subtotal · <span className="font-semibold">{itemCount} items</span>
            </span>

            <span className="text-[18px] font-medium">
              ${Number(total).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[15px]">
            <span>Shipping</span>

            <a href="#" className="font-medium underline underline-offset-2">
              Enter Shipping Address
            </a>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[18px] font-bold">Total</span>

            <span className="text-[18px] font-bold">
              ${Number(total + shipping).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}