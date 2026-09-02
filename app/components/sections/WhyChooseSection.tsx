"use client";

import React from "react";
import Image from "next/image";
import { Focus } from "lucide-react";

export default function WhyChooseSection() {
  return (
    <section className="w-full bg-white">
      {/* =====================================================
          TOP HEADING
      ====================================================== */}
      <div
        className="
          flex
          h-[175px]
          w-full
          items-center
          justify-center
          px-5

          sm:h-[185px]
          md:h-[195px]
          lg:h-[205px]
        "
      >
        <div className="text-center">
          <p
            className="
              text-[21px]
              font-medium
              leading-none
              tracking-[-0.02em]
              text-black

              sm:text-[24px]
              lg:text-[28px]
            "
          >
            Why Choose
          </p>

          <h2
            className="
              mt-6
              text-[36px]
              font-semibold
              leading-none
              tracking-[-0.04em]
              text-black

              sm:text-[40px]
              lg:text-[46px]
            "
          >
            8-Gear
          </h2>
        </div>
      </div>

      {/* =====================================================
          DESKTOP / TABLET BANNER
      ====================================================== */}
      <div
        className="
          relative
          hidden
          h-[430px]
          w-full
          overflow-hidden

          md:block
          lg:h-[445px]
          xl:h-[465px]
        "
      >
        {/* Background image */}
        <Image
          src="/assets/images/why-choose-gear.png"
          alt="8-Gear premium motorcycle riding gear"
          fill
          sizes="100vw"
          className="
            object-cover
            object-[78%_center]

            lg:object-[76%_center]
            xl:object-[73%_center]
          "
        />

        {/* =====================================================
            PROTECTED LEFT TEXT ZONE
        ====================================================== */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
          "
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(255,248,229,1) 0%,
                rgba(255,248,229,1) 30%,
                rgba(255,248,229,0.99) 38%,
                rgba(255,248,229,0.95) 43%,
                rgba(255,248,229,0.78) 48%,
                rgba(255,248,229,0.38) 54%,
                rgba(255,248,229,0.08) 61%,
                rgba(255,248,229,0) 68%
              )
            `,
          }}
        />

        {/* Subtle cinematic bottom shading */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            bg-gradient-to-t
            from-black/10
            via-transparent
            to-transparent
          "
        />

        {/* =====================================================
            DESKTOP CONTENT
        ====================================================== */}
        <div
          className="
            relative
            z-10
            mx-auto
            flex
            h-full
            w-full
            max-w-[1800px]
            items-center
            px-10

            lg:px-16
            xl:px-20
          "
        >
          {/* Strict safe width */}
          <div
            className="
              w-[47%]
              max-w-[720px]
            "
          >
            {/* TITLE */}
            <div
              className="
                flex
                items-center
                gap-6
              "
            >
              <Focus
                strokeWidth={1.8}
                className="
                  h-[54px]
                  w-[54px]
                  shrink-0
                  text-[#ad8153]

                  lg:h-[62px]
                  lg:w-[62px]
                "
              />

              <h3
                className="
                  whitespace-nowrap
                  text-[40px]
                  font-semibold
                  leading-none
                  tracking-[-0.045em]
                  text-black

                  lg:text-[50px]
                  xl:text-[56px]
                "
              >
                Ride With A Purpose.
              </h3>
            </div>

            {/* BODY */}
            <div
              className="
                ml-[78px]
                mt-7
                max-w-[540px]

                lg:ml-[86px]
                lg:max-w-[580px]

                xl:ml-[88px]
              "
            >
              <p
                className="
                  text-[16px]
                  font-normal
                  leading-[1.55]
                  tracking-[-0.005em]
                  text-black

                  lg:text-[18px]
                  xl:text-[19px]
                "
              >
                When you choose 8-Gear, you&apos;re choosing performance,
                protection and progress, with gear designed to go the distance
                while respecting the planet.
              </p>

              <p
                className="
                  mt-5
                  max-w-[520px]
                  text-[16px]
                  font-semibold
                  leading-[1.5]
                  text-black

                  lg:text-[18px]
                  xl:text-[19px]
                "
              >
                Because the future of riding depends on the choices we make
                today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE VERSION

          Text and image intentionally separated so readability
          never depends on the image crop.
      ====================================================== */}
      <div className="md:hidden">
        {/* Mobile content */}
        <div
          className="
            bg-[#fff8e5]
            px-5
            py-12

            sm:px-8
            sm:py-14
          "
        >
          <div className="flex items-start gap-4">
            <Focus
              strokeWidth={1.8}
              className="
                mt-1
                h-[42px]
                w-[42px]
                shrink-0
                text-[#ad8153]

                sm:h-[48px]
                sm:w-[48px]
              "
            />

            <div>
              <h3
                className="
                  text-[34px]
                  font-semibold
                  leading-[1.05]
                  tracking-[-0.045em]
                  text-black

                  sm:text-[40px]
                "
              >
                Ride With A Purpose.
              </h3>

              <p
                className="
                  mt-6
                  max-w-[520px]
                  text-[16px]
                  leading-[1.55]
                  text-black
                "
              >
                When you choose 8-Gear, you&apos;re choosing performance,
                protection and progress, with gear designed to go the distance
                while respecting the planet.
              </p>

              <p
                className="
                  mt-5
                  max-w-[500px]
                  text-[16px]
                  font-semibold
                  leading-[1.5]
                  text-black
                "
              >
                Because the future of riding depends on the choices we make
                today.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile image */}
        <div
          className="
            relative
            h-[330px]
            w-full
            overflow-hidden

            sm:h-[390px]
          "
        >
          <Image
            src="/assets/images/why-choose-gear.png"
            alt="8-Gear premium motorcycle riding gear"
            fill
            sizes="100vw"
            className="
              object-cover
              object-[78%_center]
            "
          />
        </div>
      </div>
    </section>
  );
}