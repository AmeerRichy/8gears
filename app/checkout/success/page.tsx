'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CheckCircle,
  ArrowRight,
  Loader2,
  XCircle,
  Clock3,
  PackageCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type OrderData = {
  orderId: string;
  trackingId: string;
  paymentStatus: string;
};

function SuccessBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[320px] -translate-y-1/2 overflow-hidden"
      aria-hidden="true"
    >
      <img
        src="/assets/images/track-order-bg-lines.png"
        alt=""
        className="absolute left-1/2 top-1/2 h-auto w-[980px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-100 sm:w-[1400px] lg:w-full"
      />
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  const verifyOrder = useCallback(async () => {
    try {
      const res = await fetch('/api/payment/stripe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrder(data);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    verifyOrder();
  }, [sessionId, router, verifyOrder]);

  if (loading) {
    return (
      <main
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 pb-12 pt-[122px] sm:px-6 sm:pb-16 sm:pt-[136px] lg:pt-[148px]"
        style={{ fontFamily: 'var(--font-sf-pro)' }}
      >
        <SuccessBackground />

        <motion.section
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-[650px] rounded-[40px] border border-white/60 bg-[#F0EFEF]/30 px-5 pb-8 pt-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.055)] backdrop-blur-[22px] sm:px-8 sm:pb-10 sm:pt-10"
        >
          <div className="mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-full bg-white/70 shadow-[0_14px_42px_rgba(0,0,0,0.055)]">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
          </div>

          <h1 className="mt-7 text-[33px] font-bold leading-[1.05] tracking-[0.01em] text-black sm:text-[41px]">
            Securing Your Order
          </h1>

          <p className="mx-auto mt-4 max-w-[520px] text-[14px] font-normal leading-6 tracking-[0.025em] text-[#111111] sm:text-[17px]">
            Verifying your payment and preparing your order details.
          </p>
        </motion.section>
      </main>
    );
  }

  if (!order) {
    return (
      <main
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 pb-12 pt-[122px] sm:px-6 sm:pb-16 sm:pt-[136px] lg:pt-[148px]"
        style={{ fontFamily: 'var(--font-sf-pro)' }}
      >
        <SuccessBackground />

        <motion.section
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-[650px] rounded-[40px] border border-white/60 bg-[#F0EFEF]/30 px-5 pb-8 pt-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.055)] backdrop-blur-[22px] sm:px-8 sm:pb-10 sm:pt-10"
        >
          <div className="mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#fff0f0]">
            <XCircle size={34} strokeWidth={1.8} className="text-[#d65353]" />
          </div>

          <h1 className="mt-7 text-[33px] font-bold leading-[1.05] tracking-[0.01em] text-black sm:text-[41px]">
            Payment Not Verified
          </h1>

          <p className="mx-auto mt-4 max-w-[560px] text-[14px] font-normal leading-6 tracking-[0.025em] text-[#111111] sm:text-[17px]">
            We couldn't verify your payment. If you've been charged, please
            contact support with your payment ID.
          </p>

          <Link
            href="/"
            className="mx-auto mt-8 inline-flex h-[52px] items-center justify-center rounded-full bg-black px-8 text-[14px] font-semibold tracking-[0.02em] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Return to Storefront
          </Link>
        </motion.section>
      </main>
    );
  }

  if (order.paymentStatus !== 'paid') {
    return (
      <main
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 pb-12 pt-[122px] sm:px-6 sm:pb-16 sm:pt-[136px] lg:pt-[148px]"
        style={{ fontFamily: 'var(--font-sf-pro)' }}
      >
        <SuccessBackground />

        <motion.section
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-[650px] rounded-[40px] border border-white/60 bg-[#F0EFEF]/30 px-5 pb-8 pt-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.055)] backdrop-blur-[22px] sm:px-8 sm:pb-10 sm:pt-10"
        >
          <div className="mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#fff8e8]">
            <Clock3 size={32} strokeWidth={1.8} className="text-[#c88920]" />
          </div>

          <h1 className="mt-7 text-[33px] font-bold leading-[1.05] tracking-[0.01em] text-black sm:text-[41px]">
            Payment Pending
          </h1>

          <p className="mx-auto mt-4 max-w-[560px] text-[14px] font-normal leading-6 tracking-[0.025em] text-[#111111] sm:text-[17px]">
            Your payment is still processing or was incomplete. We will update
            your order once the payment clears.
          </p>

          <Link
            href="/"
            className="mx-auto mt-8 inline-flex h-[52px] items-center justify-center rounded-full bg-black px-8 text-[14px] font-semibold tracking-[0.02em] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Return to Storefront
          </Link>
        </motion.section>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-white px-4 pb-12 pt-[122px] sm:px-6 sm:pb-16 sm:pt-[136px] lg:pt-[148px]"
      style={{ fontFamily: 'var(--font-sf-pro)' }}
    >
      <SuccessBackground />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-182px)] w-full max-w-[650px] items-center justify-center sm:min-h-[calc(100vh-216px)]">
        <div className="w-full">
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[40px] border border-white/60 bg-[#F0EFEF]/30 px-5 pb-6 pt-7 text-center shadow-[0_18px_60px_rgba(0,0,0,0.055)] backdrop-blur-[22px] sm:px-7 sm:pb-7 sm:pt-8 lg:px-8"
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              whileHover={{ scale: 1.06 }}
              className="mx-auto flex h-[86px] w-[86px] items-center justify-center rounded-full bg-white/80 shadow-[0_18px_55px_rgba(1,129,117,0.18)]"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.18,
                  type: 'spring',
                  stiffness: 300,
                  damping: 16,
                }}
                className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#effaf8]"
              >
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.32, duration: 0.35 }}
                >
                  <CheckCircle
                    size={40}
                    strokeWidth={1.9}
                    className="text-[#018175]"
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.45 }}
              className="mt-7 text-[33px] font-bold leading-[1.05] tracking-[0.01em] text-black sm:text-[41px]"
            >
              Order Confirmed
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.45 }}
              className="mx-auto mt-4 max-w-[650px] text-[14px] font-normal leading-6 tracking-[0.025em] text-[#111111] sm:mt-5 sm:text-[17px]"
            >
              Your order has been placed successfully. You can track the latest
              status using your tracking ID.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.45 }}
              className="mt-7 rounded-[32px] border border-white/60 bg-white/45 px-5 py-5 text-left shadow-[0_14px_42px_rgba(0,0,0,0.045)] backdrop-blur-[18px] sm:mt-10 sm:px-6 sm:py-6"
            >
              <div className="flex items-start gap-3">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#effaf8]"
                >
                  <PackageCheck
                    size={20}
                    strokeWidth={1.8}
                    className="text-[#018175]"
                  />
                </motion.div>

                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-normal leading-5 tracking-[0.015em] text-[#999999]">
                    Assigned Order ID
                  </p>

                  <p className="mt-1 break-words text-[20px] font-semibold leading-7 text-[#222222] sm:text-[24px]">
                    {order.orderId}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="rounded-[24px] border border-white/70 bg-[#F0EFEF]/35 px-4 py-4 transition-shadow hover:shadow-[0_12px_30px_rgba(0,0,0,0.055)]"
                >
                  <p className="text-[11px] font-normal leading-5 tracking-[0.015em] text-[#aaaaaa]">
                    Tracking ID
                  </p>

                  <p className="mt-1 break-words text-[14px] font-semibold leading-6 text-[#222222]">
                    {order.trackingId}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  className="rounded-[24px] border border-white/70 bg-[#F0EFEF]/35 px-4 py-4 transition-shadow hover:shadow-[0_12px_30px_rgba(0,0,0,0.055)]"
                >
                  <p className="text-[11px] font-normal leading-5 tracking-[0.015em] text-[#aaaaaa]">
                    Delivery ETA
                  </p>

                  <p className="mt-1 text-[14px] font-semibold leading-6 text-[#222222]">
                    2 - 4 Business Days
                  </p>
                </motion.div>
              </div>

              <Link
                href={`/track-order?trackingId=${order.trackingId}`}
                className="group mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-[14px] font-semibold tracking-[0.02em] text-white shadow-[0_14px_34px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_18px_46px_rgba(0,0,0,0.24)] active:translate-y-0 active:scale-[0.98]"
              >
                Track Live Progress
                <ArrowRight
                  size={17}
                  strokeWidth={1.8}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.72, duration: 0.4 }}
            className="mt-3 flex flex-col items-center justify-center gap-2 px-3 text-center sm:flex-row sm:gap-3"
          >
            <Link
              href="/"
              className="text-[12px] font-normal leading-5 tracking-[0.015em] text-[#aaaaaa] transition-colors hover:text-black"
            >
              Continue Shopping
            </Link>

            <span className="hidden h-1 w-1 rounded-full bg-[#d9d9d9] sm:block" />

            <Link
              href="/contact"
              className="text-[12px] font-normal leading-5 tracking-[0.015em] text-[#aaaaaa] transition-colors hover:text-black"
            >
              Need help? Contact Support
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen items-center justify-center bg-white"
          style={{ fontFamily: 'var(--font-sf-pro)' }}
        >
          <Loader2 className="h-7 w-7 animate-spin text-black" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}