"use client";

import { Search } from "lucide-react";

type TrackOrderFormProps = {
  trackingId: string;
  loading: boolean;
  onTrackingIdChange: (value: string) => void;
  onTrackOrder: (trackingId: string) => void;
};

export default function TrackOrderForm({
  trackingId,
  loading,
  onTrackingIdChange,
  onTrackOrder,
}: TrackOrderFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trackingId.trim()) return;

    onTrackOrder(trackingId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-[24px] border border-[#e7ebf1] bg-white p-2.5 shadow-[0_18px_55px_rgba(23,38,71,0.08)] sm:p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={21}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#91a0b5] sm:left-5"
            />

            <input
              type="text"
              value={trackingId}
              onChange={(event) =>
                onTrackingIdChange(event.target.value.toUpperCase())
              }
              placeholder="Enter tracking ID, e.g. TRK-8G-XXXXXX"
              className="h-[58px] w-full rounded-[17px] bg-[#f8fafc] pl-[50px] pr-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#17233c] outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-[#9ca7b7] focus:bg-[#f4f7fb] sm:h-[64px] sm:pl-[55px] sm:text-[14px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-[56px] shrink-0 items-center justify-center rounded-[16px] bg-[#0c172f] px-8 text-[13px] font-bold tracking-[0.01em] text-white transition-all duration-300 hover:bg-[#f36b2b] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[64px] sm:min-w-[156px]"
          >
            {loading ? "Searching..." : "Track Now"}
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] font-medium leading-5 text-[#a0a9b8]">
        Your tracking ID is included in your order confirmation message.
      </p>
    </form>
  );
}