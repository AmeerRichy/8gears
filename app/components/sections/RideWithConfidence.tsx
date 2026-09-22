"use client";

import React from "react";
import Image from "next/image";

export default function RideWithConfidence() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-black

        h-[520px]

        sm:h-[580px]
        md:h-[620px]

        lg:h-[680px]

        xl:h-[700px]
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}
      <Image
        src="/assets/images/ride-confidence.png"
        alt="Motorcyclist standing beside an adventure motorcycle in the mountains"
        fill
        quality={90}
        sizes="100vw"
        className="
          select-none
          object-cover

          object-[66%_center]

          sm:object-[63%_center]
          md:object-[60%_center]

          lg:object-center
        "
      />

      {/* =====================================================
          IMAGE OVERLAYS
      ====================================================== */}

      {/* Main left readability gradient */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0

          bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.52)_22%,rgba(0,0,0,0.24)_42%,rgba(0,0,0,0.05)_60%,rgba(0,0,0,0)_75%)]
        "
      />

      {/* Overall subtle cinematic darkening */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0

          bg-black/10
        "
      />

      {/* Bottom fade */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0

          h-[220px]

          bg-gradient-to-t
          from-black/25
          via-black/5
          to-transparent
        "
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div
        className="
          relative
          z-10

          mx-auto
          flex
          h-full
          w-full
          max-w-[1920px]
          items-center

          px-[24px]

          sm:px-[40px]
          md:px-[52px]
          lg:px-[76px]
          xl:px-[108px]
        "
      >
        <div
          className="
            max-w-[650px]

            font-[var(--font-sf-pro)]
            text-white
          "
        >
          {/* =================================================
              MAIN HEADING
          ================================================= */}
          <h2
            className="
              text-[36px]
              font-[700]
              leading-[1.18]
              tracking-[-1px]
              text-white

              sm:text-[40px]

              md:text-[44px]
              md:tracking-[-1.2px]

              lg:text-[48px]
              lg:leading-[1.46]

              xl:text-[50px]
            "
          >
            <span className="block">
              Ride with Confidence.
            </span>

            <span
              className="
                mt-[10px]
                block

                sm:mt-[12px]
                lg:mt-[4px]
              "
            >
              Ride with Purpose.
            </span>

            <span
              className="
                mt-[10px]
                block

                sm:mt-[12px]
                lg:mt-[4px]
              "
            >
              Ride with Protection.
            </span>
          </h2>

          {/* =================================================
              SUBTEXT
          ================================================= */}
          <p
            className="
              mt-[18px]

              font-[var(--font-sf-pro)]

              text-[15px]
              font-[400]
              leading-[1.5]
              tracking-[0px]

              text-white/90

              sm:text-[16px]

              md:text-[17px]

              lg:mt-[12px]
              lg:text-[18px]

              xl:text-[19px]
            "
          >
            Ride Smart. Ride Protected. Ride Beyond.
          </p>
        </div>
      </div>

      {/* =====================================================
          MOBILE EXTRA READABILITY
      ====================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]

          bg-[linear-gradient(90deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.05)_100%)]

          sm:hidden
        "
      />
    </section>
  );
}