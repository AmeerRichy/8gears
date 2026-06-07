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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            strokeWidth={1.7}
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#a0a0a0]"
          />

          <input
            type="text"
            value={trackingId}
            onChange={(event) =>
              onTrackingIdChange(event.target.value.toUpperCase())
            }
            placeholder="Enter tracking ID, e.g. TRK-8G-XXXXXX"
            className="h-[50px] w-full rounded-full border border-white/50 bg-white/45 pl-[52px] pr-5 text-[12px] font-medium uppercase tracking-[0.045em] text-[#111111] outline-none backdrop-blur-[12px] transition-all duration-200 placeholder:normal-case placeholder:font-normal placeholder:tracking-[0.025em] placeholder:text-[#a0a0a0] focus:border-white/80 focus:bg-white/65 sm:h-[48px] sm:text-[13px]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-[50px] w-full shrink-0 items-center justify-center rounded-full bg-black px-8 text-[13px] font-medium tracking-[-0.01em] text-white transition-all duration-200 hover:bg-[#222222] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[48px] sm:w-[32%] sm:min-w-[170px]"
        >
          {loading ? "Searching..." : "Track Order"}
        </button>
      </div>
    </form>
  );
}