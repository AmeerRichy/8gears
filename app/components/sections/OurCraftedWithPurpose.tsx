"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function CraftedWithPurpose() {
  const [expanded, setExpanded] = useState(false);

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
          MAIN SECTION
      ====================================================== */}
      <div
        className="
          relative
          flex
          w-full
          flex-col

          lg:min-h-[600px]
          lg:flex-row
          lg:items-center

          xl:min-h-[620px]
        "
      >
        {/* =====================================================
            LEFT IMAGE — DESKTOP ONLY

            IMAGE:
            - Keeps its own height
            - Never grows with expanded text
            - Never crops
            - Shrinks toward the left when expanded
        ====================================================== */}
        <div
          className={`
            absolute
            left-0
            top-1/2
            z-10

            hidden

            origin-left
            -translate-y-1/2

            transition-transform
            duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]

            lg:block
            lg:h-[510px]
            lg:w-[60%]

            xl:h-[520px]
            xl:w-[61%]

            2xl:h-[540px]

            ${
              expanded
                ? "lg:scale-[0.90] xl:scale-[0.89]"
                : "scale-100"
            }
          `}
        >
          <img
            src="/assets/images/crafted-purpose.png"
            alt="Craftsperson stitching premium motorcycle gear"
            className="
              block
              h-full
              w-full

              object-contain
              object-left
            "
          />
        </div>

        {/* =====================================================
            CONTENT GRID
        ====================================================== */}
        <div
          className="
            relative
            z-20

            mx-auto
            flex
            w-[calc(100%-32px)]
            max-w-[1500px]
            items-center

            sm:w-[calc(100%-48px)]

            md:w-[calc(100%-64px)]

            lg:min-h-[600px]
            lg:w-[calc(100%-80px)]
            lg:justify-end

            xl:min-h-[620px]
          "
        >
          {/* =================================================
              RIGHT CONTENT
          ================================================= */}
          <div
            className={`
              w-full
              max-w-[600px]

              font-[var(--font-sf-pro)]
              text-black

              transition-[width]
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]

              lg:max-w-none

              ${
                expanded
                  ? "lg:w-[43%] xl:w-[42%]"
                  : "lg:w-[37%] xl:w-[36%]"
              }
            `}
          >
            {/* =================================================
                NUMBER
            ================================================= */}
            <p
              className="
                text-[15px]
                font-[400]
                leading-none
                tracking-[0px]
                text-black

                sm:text-[16px]

                md:text-[18px]

                lg:text-[20px]
              "
            >
              02
            </p>

            {/* =================================================
                HEADING
            ================================================= */}
            <h2
              className="
                mt-[16px]

                text-[34px]
                font-[650]
                leading-[1.08]
                tracking-[-0.9px]
                text-black

                sm:text-[39px]

                md:text-[44px]

                lg:mt-[20px]
                lg:text-[46px]

                xl:text-[50px]
              "
            >
              Crafted with Purpose
            </h2>

            {/* =================================================
                INITIAL TEXT
            ================================================= */}
            <p
              className="
                mt-[22px]

                max-w-[570px]

                text-[16px]
                font-[400]
                leading-[1.55]
                tracking-[-0.1px]
                text-black

                sm:text-[17px]

                md:text-[18px]

                lg:mt-[24px]
                lg:text-[19px]
                lg:leading-[1.55]

                xl:text-[20px]
                xl:leading-[1.5]
              "
            >
              Every piece begins with thoughtful design,
              premium materials, and a commitment to creating
              gear that performs as beautifully as it looks.
            </p>

            {/* =================================================
                EXPANDED CONTENT
            ================================================= */}
            <div
              className={`
                grid

                transition-[grid-template-rows,opacity,margin]
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]

                ${
                  expanded
                    ? "mt-[18px] grid-rows-[1fr] opacity-100"
                    : "mt-0 grid-rows-[0fr] opacity-0"
                }
              `}
            >
              <div className="overflow-hidden">
                <div
                  className="
                    max-w-[570px]

                    space-y-[15px]

                    text-[16px]
                    font-[400]
                    leading-[1.55]
                    tracking-[-0.1px]
                    text-black/75

                    sm:text-[17px]

                    md:text-[18px]

                    lg:text-[18px]
                    lg:leading-[1.55]

                    xl:text-[19px]
                  "
                >
                  <p>
                    From the first sketch to the final stitch,
                    every detail is considered with the rider
                    in mind. We focus on durability, comfort,
                    movement, and protection without compromising
                    the refined aesthetic that defines our approach.
                  </p>

                  <p>
                    Our materials are selected for how they perform
                    on the road and how they age over time.
                    Construction is deliberate, with attention
                    given to every seam, panel, and finishing detail.
                  </p>

                  <p>
                    The result is motorcycle gear designed to become
                    part of the ride — dependable, considered, and
                    built with purpose.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                SHOW MORE / LESS
            ================================================= */}
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              aria-expanded={expanded}
              className="
                group/button

                mt-[26px]

                inline-flex
                cursor-pointer
                items-center
                gap-[9px]

                border-0
                bg-transparent
                p-0

                font-[var(--font-sf-pro)]

                text-[16px]
                font-[400]
                text-black

                transition-opacity
                duration-300

                hover:opacity-60

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-black
                focus-visible:ring-offset-4

                sm:text-[17px]

                lg:mt-[28px]
                lg:text-[18px]
              "
            >
              <span>
                {expanded ? "Show Less" : "Show More"}
              </span>

              <ArrowRight
                size={20}
                strokeWidth={1.6}
                aria-hidden="true"
                className={`
                  transition-transform
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]

                  ${
                    expanded
                      ? "rotate-[-180deg]"
                      : "rotate-0 group-hover/button:translate-x-[4px]"
                  }
                `}
              />
            </button>
          </div>
        </div>

        {/* =====================================================
            MOBILE / TABLET IMAGE

            Below lg:
            - Text stays first
            - Image stays underneath
            - Full natural aspect ratio
            - No scaling/cropping interaction
        ====================================================== */}
        <div
          className="
            relative
            z-10

            mt-[42px]
            w-full

            lg:hidden
          "
        >
          <div
            className="
              mx-auto
              w-[calc(100%-32px)]

              sm:w-[calc(100%-48px)]

              md:w-[calc(100%-64px)]
            "
          >
            <img
              src="/assets/images/crafted-purpose.png"
              alt="Craftsperson stitching premium motorcycle gear"
              className="
                block
                h-auto
                w-full

                object-contain
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}