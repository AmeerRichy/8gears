"use client";

import React from "react";
import { Eye, Target } from "lucide-react";

export default function AboutPurpose() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white

        py-[70px]
        sm:py-[85px]
        lg:py-[105px]
        xl:py-[115px]
      "
    >
      {/* =====================================================
          SECTION HEADING
      ====================================================== */}
      <div
        className="
          mx-auto
          w-full
          px-[24px]
          text-center

          sm:px-[40px]
          md:px-[52px]
          lg:px-[76px]
        "
      >
        <p
          className="
            font-[var(--font-sf-pro)]
            text-[17px]
            font-[500]
            uppercase
            leading-[1]
            tracking-[0.2px]
            text-black

            sm:text-[19px]
            lg:text-[21px]
          "
        >
          Our Purpose
        </p>

        <h2
          className="
            mt-[20px]

            font-[var(--font-sf-pro)]
            text-[38px]
            font-[650]
            leading-[1]
            tracking-[-1.2px]
            text-black

            sm:text-[44px]
            lg:text-[50px]
            xl:text-[52px]
          "
        >
          Vision &amp; Mission
        </h2>
      </div>

      {/* =====================================================
          CARDS
      ====================================================== */}
      <div
        className="
          mx-auto
          mt-[65px]

          grid
          w-[calc(100%-32px)]
          max-w-[1500px]
          grid-cols-1
          gap-[24px]

          sm:w-[calc(100%-48px)]

          md:mt-[75px]

          lg:mt-[80px]
          lg:w-[calc(100%-80px)]
          lg:grid-cols-2
          lg:gap-[48px]
        "
      >
        {/* =====================================================
            VISION
        ====================================================== */}
        <article
          className="
            group
            relative

            h-[500px]
            overflow-hidden

            rounded-[32px]

            border
            border-black/[0.08]

            bg-white

            shadow-[0_1px_7px_rgba(0,0,0,0.16)]

            sm:h-[550px]
            sm:rounded-[38px]

            lg:h-[570px]

            xl:h-[575px]
          "
        >
          {/* =================================================
              VISION IMAGE
          ================================================= */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0

              h-[62%]
              overflow-hidden
            "
          >
            {/* Slow cinematic movement */}
            <div
              className="
                h-full
                w-full

                scale-[1.01]

                transition-transform
                duration-[2400ms]
                ease-[cubic-bezier(0.16,1,0.3,1)]

                will-change-transform

                group-hover:scale-[1.035]
              "
            >
              <img
                src="/assets/images/about-vision.jpg"
                alt="Mountain road representing the vision of 8-Gear"
                className="
                  h-full
                  w-full

                  object-cover
                  object-center

                  grayscale

                  transition-[filter]
                  duration-[900ms]
                  ease-out

                  group-hover:grayscale-0
                "
              />
            </div>

            {/* WHITE IMAGE FADE */}
            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                z-10

                h-[48%]

                bg-gradient-to-b
                from-white
                via-white/80
                to-transparent
              "
            />
          </div>

          {/* =================================================
              VISION CONTENT
          ================================================= */}
          <div
            className="
              relative
              z-20

              px-[30px]
              pt-[38px]

              sm:px-[42px]
              sm:pt-[45px]

              lg:px-[48px]
              lg:pt-[50px]
            "
          >
            {/* ICON */}
            <div
              className="
                flex
                h-[68px]
                w-[68px]
                items-center
                justify-center

                rounded-full

                bg-black
                text-white

                sm:h-[72px]
                sm:w-[72px]
              "
            >
              <Eye
                className="h-[34px] w-[34px]"
                strokeWidth={2.2}
              />
            </div>

            {/* TITLE */}
            <h3
              className="
                mt-[35px]

                font-[var(--font-sf-pro)]
                text-[28px]
                font-[650]
                leading-[1]
                tracking-[-0.5px]
                text-black

                sm:text-[30px]
                lg:text-[32px]
              "
            >
              Vision
            </h3>

            {/* DESCRIPTION */}
            <p
              className="
                mt-[22px]
                max-w-[600px]

                font-[var(--font-sf-pro)]
                text-[17px]
                font-[400]
                leading-[1.42]
                tracking-[-0.1px]
                text-black/50

                sm:text-[18px]

                lg:text-[20px]
                lg:leading-[1.4]
              "
            >
              To build a global brand with sustainable, high-performance
              gear that delivers unmatched safety, comfort, style, and
              reliability—for every rider and terrain.
            </p>
          </div>
        </article>

        {/* =====================================================
            MISSION
        ====================================================== */}
        <article
          className="
            group
            relative

            h-[500px]
            overflow-hidden

            rounded-[32px]

            border
            border-black/[0.08]

            bg-white

            shadow-[0_1px_7px_rgba(0,0,0,0.16)]

            sm:h-[550px]
            sm:rounded-[38px]

            lg:h-[570px]

            xl:h-[575px]
          "
        >
          {/* =================================================
              MISSION IMAGE
          ================================================= */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0

              h-[62%]
              overflow-hidden
            "
          >
            {/* Slow cinematic movement */}
            <div
              className="
                h-full
                w-full

                scale-[1.01]

                transition-transform
                duration-[2400ms]
                ease-[cubic-bezier(0.16,1,0.3,1)]

                will-change-transform

                group-hover:scale-[1.035]
              "
            >
              <img
                src="/assets/images/about-mission.jpg"
                alt="Motorcyclist representing the mission of 8-Gear"
                className="
                  h-full
                  w-full

                  object-cover
                  object-center

                  grayscale

                  transition-[filter]
                  duration-[900ms]
                  ease-out

                  group-hover:grayscale-0
                "
              />
            </div>

            {/* WHITE IMAGE FADE */}
            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                z-10

                h-[48%]

                bg-gradient-to-b
                from-white
                via-white/80
                to-transparent
              "
            />
          </div>

          {/* =================================================
              MISSION CONTENT
          ================================================= */}
          <div
            className="
              relative
              z-20

              px-[30px]
              pt-[38px]

              sm:px-[42px]
              sm:pt-[45px]

              lg:px-[48px]
              lg:pt-[50px]
            "
          >
            {/* ICON */}
            <div
              className="
                flex
                h-[68px]
                w-[68px]
                items-center
                justify-center

                rounded-full

                bg-black
                text-white

                sm:h-[72px]
                sm:w-[72px]
              "
            >
              <Target
                className="h-[34px] w-[34px]"
                strokeWidth={2.2}
              />
            </div>

            {/* TITLE */}
            <h3
              className="
                mt-[35px]

                font-[var(--font-sf-pro)]
                text-[28px]
                font-[650]
                leading-[1]
                tracking-[-0.5px]
                text-black

                sm:text-[30px]
                lg:text-[32px]
              "
            >
              Mission
            </h3>

            {/* DESCRIPTION */}
            <p
              className="
                mt-[22px]
                max-w-[600px]

                font-[var(--font-sf-pro)]
                text-[17px]
                font-[400]
                leading-[1.42]
                tracking-[-0.1px]
                text-black/50

                sm:text-[18px]

                lg:text-[20px]
                lg:leading-[1.4]
              "
            >
              To create purpose-driven products with a commitment to
              sustainability, innovation, and craftsmanship—empowering
              riders and the planet.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}