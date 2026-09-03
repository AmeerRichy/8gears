import { Suspense } from "react";
import TrackOrderSection from "@/components/track-order/TrackOrderSection";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata = createPageMetadata({
  title: "Track Your Order",
  description: "Check the current status and delivery progress of your 8-Gear order.",
  path: "/track-order",
  noIndex: true,
  image: null,
});

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
