import { Suspense } from "react";
import TrackOrderSection from "@/components/track-order/TrackOrderSection";

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100vh-96px)] items-center justify-center bg-[#f7f9fc] px-5">
          <p className="text-sm font-medium text-[#8a94a6]">
            Loading tracking page...
          </p>
        </main>
      }
    >
      <TrackOrderSection />
    </Suspense>
  );
}