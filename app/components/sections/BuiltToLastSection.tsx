"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function BuiltToLastSection() {
  return (
    <section className="w-full bg-white">
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1906px]
          flex-col
          px-5
          py-16

          sm:px-8

          lg:min-h-[774px]
          lg:flex-row
          lg:items-center
          lg:gap-[70px]
          lg:px-[66px]
          lg:py-[70px]

          xl:gap-[115px]
        "
      >
        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}
        <div
          className="
            flex
            w-full
            shrink-0
            flex-col
            items-start

            lg:w-[360px]
            xl:w-[360px]
          "
        >
          {/* Small label - remove if you want EXACT screenshot 2 */}
          <p
            className="
              mb-6
              text-[12px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-black/45

              lg:hidden
            "
          >
            Made For The Long Ride
          </p>

          <h2
            className="
              text-[48px]
              font-medium
              leading-[1.04]
              tracking-[-0.045em]
              text-black

              sm:text-[56px]

              lg:text-[66px]
              lg:leading-[1.08]

              xl:text-[72px]
            "
          >
            Build To
            <br />
            Last Not
            <br />
            To Waste.
          </h2>

          {/* Hide description on desktop to match reference */}
          <p
            className="
              mt-6
              max-w-[390px]
              text-[16px]
              leading-[1.6]
              text-black/60

              lg:hidden
            "
          >
            Thoughtfully engineered gear designed for years of riding,
            reducing waste without compromising protection or performance.
          </p>

          <a
            href="/shop"
            className="
              group
              mt-10
              inline-flex
              h-[68px]
              min-w-[260px]
              items-center
              justify-center
              gap-4
              rounded-full
              bg-black
              px-8
              text-[17px]
              font-normal
              text-white
              transition-all
              duration-300

              hover:bg-black/80

              lg:mt-[48px]
            "
          >
            View All Gear

            <ArrowUpRight
              size={18}
              strokeWidth={1.8}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
                group-hover:-translate-y-1
              "
            />
          </a>
        </div>

        {/* =====================================================
            RIGHT — FULL COLLAGE IMAGE
        ====================================================== */}
        <div
          className="
            relative
            mt-12
            w-full

            lg:mt-0
            lg:min-w-0
            lg:flex-1
          "
        >
          <div
            className="
              relative
              w-full
              overflow-hidden

              aspect-[2.05/1]
            "
          >
            <Image
              src="/assets/images/built-to-last.webp"
              alt="Sustainable motorcycle gear designed to last"
              fill
              priority={false}
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="
                object-contain
                object-center
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}