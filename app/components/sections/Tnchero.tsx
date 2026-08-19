"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative min-h-[620px] w-full sm:min-h-[680px] lg:h-[760px]">
        {/* Background decorative lines */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-contain
            bg-center
            bg-no-repeat
            opacity-60
          "
          style={{
            backgroundImage:
              "url('/assets/images/track-order-bg-lines.png')",
          }}
        />

        {/* Faint 8 behind heading */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[220px]
            z-[1]
            -translate-x-1/2
            font-[var(--font-sf-pro)]
            text-[96px]
            font-semibold
            leading-none
            text-black/[0.045]

            sm:top-[230px]
            sm:text-[104px]

            lg:top-[255px]
            lg:text-[112px]
          "
        >
          8
        </div>

        {/* Back To Home */}
        <Link
          href="/"
          className="
            absolute
            left-[24px]
            top-[42px]
            z-20
            flex
            items-center
            gap-[10px]
            font-[var(--font-sf-pro)]
            text-[14px]
            font-medium
            text-black
            transition-opacity
            duration-200
            hover:opacity-60

            sm:left-[40px]
            sm:top-[60px]

            lg:left-[76px]
            lg:top-[78px]
            lg:text-[15px]
          "
        >
          <ArrowLeft size={18} strokeWidth={1.7} />
          <span>Back to Home</span>
        </Link>

        {/* Main Content */}
        <div
          className="
            relative
            z-10
            flex
            min-h-[620px]
            w-full
            items-center
            justify-center
            px-[24px]

            sm:min-h-[680px]
            sm:px-[40px]

            lg:h-full
            lg:min-h-0
            lg:px-[70px]
          "
        >
          <div
            className="
              relative
              mt-[10px]
              w-full
              max-w-[1100px]
              text-center

              sm:mt-[20px]
              lg:mt-[30px]
            "
          >
            {/* Title */}
            <h1
              className="
                font-[var(--font-sf-pro)]
                text-[42px]
                font-bold
                leading-[1.08]
                tracking-[-1.6px]
                text-black

                sm:text-[52px]
                sm:tracking-[-2px]

                md:text-[58px]

                lg:text-[64px]
                lg:tracking-[-2.5px]

                xl:text-[68px]
              "
            >
              Terms &amp; Conditions
            </h1>

            {/* Subtitle */}
            <p
              className="
                mx-auto
                mt-[22px]
                max-w-[700px]
                font-[var(--font-sf-pro)]
                text-[16px]
                font-normal
                leading-[1.6]
                tracking-[0.1px]
                text-black/50

                sm:text-[18px]

                lg:mt-[24px]
                lg:text-[20px]
              "
            >
              Please read these terms carefully before using 8Gear.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}