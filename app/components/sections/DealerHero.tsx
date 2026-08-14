"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DealerHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative min-h-[620px] w-full sm:min-h-[680px] lg:h-[817px] lg:min-h-0">
        {/* Background decorative lines */}
        <div
          className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/images/track-order-bg-lines.png')",
          }}
        />

        {/* Back To Home */}
        <Link
          href="/"
          className="absolute left-[24px] top-[42px] z-20 flex items-center gap-[10px] font-[var(--font-sf-pro)] text-[14px] font-medium text-black transition-opacity duration-200 hover:opacity-60 sm:left-[40px] sm:top-[60px] lg:left-[82px] lg:top-[135px] lg:text-[15px]"
        >
          <ArrowLeft size={18} strokeWidth={1.7} />
          <span>Back to Home</span>
        </Link>

        {/* Center Heading */}
        <div className="relative z-10 flex h-full min-h-[620px] w-full items-center justify-center px-[24px] sm:min-h-[680px] lg:min-h-0">
          <div className="relative text-center">

            <h1 className="relative font-[var(--font-sf-pro)] text-[48px] font-normal leading-[1] tracking-[-2px] text-black sm:text-[60px] lg:text-[72px] xl:text-[76px]">
              <span className="font-bold">Dealers</span>{" "}
              <span className="font-normal">Locator</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}