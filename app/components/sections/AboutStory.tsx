"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function AboutStory() {
  const router = useRouter();

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white

        py-[55px]
        sm:py-[70px]
        lg:py-[90px]
      "
    >
      {/* =====================================================
          STORY BANNER
      ====================================================== */}
      <div
        className="
          group
          relative
          mx-auto

          h-[560px]
          w-[calc(100%-32px)]
          max-w-[1500px]

          overflow-hidden
          rounded-[28px]

          sm:h-[610px]
          sm:w-[calc(100%-48px)]
          sm:rounded-[34px]

          lg:h-[670px]
          lg:w-[calc(100%-80px)]
          lg:rounded-[44px]
        "
      >
        {/* =====================================================
            BACKGROUND IMAGE
        ====================================================== */}
        <div
          className="
            absolute
            inset-0

            bg-cover
            bg-[58%_center]
            bg-no-repeat

            sm:bg-[56%_center]
            lg:bg-center
          "
          style={{
            backgroundImage:
              "url('/assets/images/about-story.webp')",
          }}
        />

        {/* =====================================================
            OVERLAYS
        ====================================================== */}

        {/* Main left readability gradient */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0

            bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.68)_18%,rgba(0,0,0,0.42)_36%,rgba(0,0,0,0.15)_54%,rgba(0,0,0,0)_72%)]
          "
        />

        {/* Bottom cinematic shading */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0

            h-[45%]

            bg-gradient-to-t
            from-black/35
            via-black/10
            to-transparent
          "
        />

        {/* Slight overall cinematic tint */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0

            bg-black/[0.08]
          "
        />

        {/* =====================================================
            CONTENT
        ====================================================== */}
        <div
          className="
            relative
            z-10

            flex
            h-full
            w-full
            items-center

            px-[28px]

            sm:px-[48px]

            lg:px-[82px]

            xl:px-[88px]
          "
        >
          <div
            className="
              w-full
              max-w-[600px]

              font-[var(--font-sf-pro)]
              text-white
            "
          >
            {/* =================================================
                EYEBROW
            ================================================= */}
            <p
              className="
                text-[16px]
                font-[500]
                uppercase
                leading-[1]
                tracking-[0.2px]
                text-white

                sm:text-[18px]

                lg:text-[20px]
              "
            >
              Our Story
            </p>

            {/* =================================================
                HEADING
            ================================================= */}
            <h2
              className="
                mt-[20px]

                text-[37px]
                font-[650]
                leading-[1.12]
                tracking-[-1px]
                text-white

                sm:text-[43px]

                lg:mt-[22px]
                lg:text-[48px]
                lg:leading-[1.1]

                xl:text-[50px]
              "
            >
              Crafted by People.
              <br />
              Driven by Passion.
            </h2>

            {/* =================================================
                DESCRIPTION
            ================================================= */}
            <p
              className="
                mt-[24px]
                max-w-[570px]

                text-[16px]
                font-[400]
                leading-[1.55]
                tracking-[-0.1px]
                text-white/95

                sm:text-[18px]

                lg:mt-[25px]
                lg:text-[20px]
                lg:leading-[1.5]
              "
            >
              The right gear doesn&apos;t just protect you—it sets
              <br className="hidden xl:block" />
              <span className="xl:hidden"> </span>
              you free to live the ride and terrain.
            </p>

            {/* =================================================
                CTA
            ================================================= */}
         <button
  type="button"
  onClick={() => router.push("/ourstory")}
  className="
    mt-[34px]

    flex
    h-[56px]
    w-[205px]
    items-center
    justify-center

    rounded-full

    border
    border-white/60

    bg-black/45
    backdrop-blur-[2px]

    font-[var(--font-sf-pro)]
    text-[15px]
    font-[400]
    tracking-[0px]
    text-white

    shadow-[0_8px_25px_rgba(0,0,0,0.18)]

    transition-all
    duration-300

    hover:-translate-y-[2px]
    hover:border-white
    hover:bg-white
    hover:text-black

    sm:mt-[38px]
    sm:h-[58px]
    sm:w-[215px]
    sm:text-[16px]

    lg:mt-[40px]
  "
>
  Our Story
</button>
          </div>
        </div>

        {/* =====================================================
            MOBILE READABILITY
        ====================================================== */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]

            bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.48)_65%,rgba(0,0,0,0.12)_100%)]

            sm:hidden
          "
        />
      </div>
    </section>
  );
}