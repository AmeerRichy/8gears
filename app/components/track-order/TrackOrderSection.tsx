"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import TrackOrderForm from "@/components/track-order/TrackOrderForm";
import TrackOrderResult, {
  type TrackedOrder,
} from "@/components/track-order/TrackOrderResult";

function TrackingBackground({ hasResponse }: { hasResponse: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-0 overflow-hidden ${
        hasResponse
          ? "top-[160px] h-[300px] sm:top-[150px] sm:h-[320px]"
          : "top-1/2 h-[300px] -translate-y-1/2 sm:h-[320px]"
      }`}
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

export default function TrackOrderSection() {
  const searchParams = useSearchParams();

  const [trackingId, setTrackingId] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackOrder = useCallback(async (id: string) => {
    const cleanedTrackingId = id.trim();

    if (!cleanedTrackingId) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch(
        `/api/orders/track?trackingId=${encodeURIComponent(cleanedTrackingId)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order not found.");
      }

      setOrder(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while tracking your order."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const idFromUrl = searchParams.get("trackingId");

    if (!idFromUrl) return;

    setTrackingId(idFromUrl.toUpperCase());
    trackOrder(idFromUrl);
  }, [searchParams, trackOrder]);

  const hasResponse = Boolean(order || error);

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-white px-4 pb-12 pt-[122px] sm:px-6 sm:pb-16 sm:pt-[136px] lg:pt-[148px] ${
        hasResponse ? "" : "flex"
      }`}
      style={{ fontFamily: "var(--font-sf-pro)" }}
    >
      <TrackingBackground hasResponse={hasResponse} />

      <div
        className={`relative z-10 mx-auto w-full ${
          hasResponse
            ? "max-w-[650px]"
            : "flex min-h-[calc(100vh-182px)] max-w-[760px] items-center justify-center sm:min-h-[calc(100vh-216px)]"
        }`}
      >
        <div className="w-full">
          <section className="rounded-[40px] border border-white/60 bg-[#F0EFEF]/30 px-5 pb-6 pt-7 shadow-[0_18px_60px_rgba(0,0,0,0.055)] backdrop-blur-[22px] sm:px-7 sm:pb-7 sm:pt-8 lg:px-8">
            <div className="text-center">
              <h1 className="text-[33px] font-bold leading-[1.05] tracking-[0.01em] text-black sm:text-[41px]">
                Track Your Gear
              </h1>

              <p className="mx-auto mt-4 max-w-[650px] text-[14px] font-normal leading-6 tracking-[0.025em] text-[#111111] sm:mt-5 sm:text-[17px]">
                Enter your tracking number to check latest status about your
                order.
              </p>
            </div>

            <div className="mt-7 sm:mt-10">
              <TrackOrderForm
                trackingId={trackingId}
                loading={loading}
                onTrackingIdChange={setTrackingId}
                onTrackOrder={trackOrder}
              />
            </div>
          </section>

          <p className="mt-3 px-3 text-center text-[11px] font-normal leading-5 tracking-[0.015em] text-[#aaaaaa] sm:text-[12px]">
            Your tracking ID is in your order confirmation message.
          </p>

          {error && (
            <div className="mt-8 flex items-start gap-3 rounded-[28px] border border-white/60 bg-[#F0EFEF]/30 px-5 py-5 shadow-[0_14px_42px_rgba(0,0,0,0.045)] backdrop-blur-[20px] sm:px-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0f0]">
                <AlertCircle
                  size={18}
                  strokeWidth={1.8}
                  className="text-[#d65353]"
                />
              </div>

              <div>
                <p className="text-[14px] font-semibold text-[#222222]">
                  Unable to locate your order
                </p>

                <p className="mt-1 text-[12px] font-normal leading-5 text-[#999999]">
                  {error}
                </p>
              </div>
            </div>
          )}

          {order && <TrackOrderResult order={order} />}
        </div>
      </div>
    </main>
  );
}