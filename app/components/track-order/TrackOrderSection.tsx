"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TrackOrderForm from "@/components/track-order/TrackOrderForm";
import TrackOrderResult, {
  type TrackedOrder,
} from "@/components/track-order/TrackOrderResult";
import { AlertCircle } from "lucide-react";

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

    setTrackingId(idFromUrl);
    trackOrder(idFromUrl);
  }, [searchParams, trackOrder]);

  const hasResponse = Boolean(order || error);

  return (
    <main
      className={`min-h-[calc(100vh-96px)] bg-[#f7f9fc] px-5 sm:px-8 ${
        hasResponse
          ? "py-12 lg:py-16"
          : "flex items-center justify-center py-12"
      }`}
    >
      <div className="mx-auto w-full max-w-[920px]">
        <section className={hasResponse ? "mb-10" : ""}>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#f36b2b]">
              Order Tracking
            </p>

            <h1 className="text-[38px] font-black leading-[1.05] tracking-[-2px] text-[#0c172f] sm:text-[52px]">
              Track Your Gear
            </h1>

            <p className="mx-auto mt-4 max-w-[600px] text-[14px] font-medium leading-6 text-[#7c8799] sm:text-[15px]">
              Enter your tracking ID to check the latest status of your order
              and follow its delivery progress.
            </p>
          </div>

          <div className="mx-auto mt-9 max-w-[760px]">
            <TrackOrderForm
              trackingId={trackingId}
              loading={loading}
              onTrackingIdChange={setTrackingId}
              onTrackOrder={trackOrder}
            />
          </div>
        </section>

        {error && (
          <div className="mx-auto mt-7 flex max-w-[760px] items-start gap-4 rounded-[20px] border border-[#ffd7d7] bg-[#fff7f7] px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe4e4]">
              <AlertCircle
                size={20}
                strokeWidth={2}
                className="text-[#d94b4b]"
              />
            </div>

            <div>
              <p className="text-[14px] font-bold text-[#b83838]">
                Unable to locate your order
              </p>

              <p className="mt-1 text-[13px] font-medium leading-5 text-[#d05a5a]">
                {error}
              </p>
            </div>
          </div>
        )}

        {order && <TrackOrderResult order={order} />}
      </div>
    </main>
  );
}