"use client";

import React from "react";

export default function OurPromise() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white

        py-[85px]
        sm:py-[100px]
        md:py-[115px]
        lg:py-[125px]
      "
    >
      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}
      <div
        className="
          mx-auto
          w-full
          max-w-[1920px]

          px-[24px]
          sm:px-[40px]
          md:px-[52px]
          lg:px-[76px]
          xl:px-[108px]
        "
      >
        {/* =================================================
            SECTION TITLE
        ================================================= */}
        <h2
          className="
            text-center

            font-[var(--font-sf-pro)]

            text-[30px]
            font-[600]
            leading-none
            tracking-[-0.4px]
            text-black

            sm:text-[34px]
            md:text-[38px]
            lg:text-[46px]
          "
        >
          OUR PROMISE
        </h2>

        {/* =================================================
            CENTERING WRAPPER

            This centers the ACTUAL visible quote group,
            not an invisible fixed-width box.
        ================================================= */}
        <div
          className="
            mt-[52px]

            flex
            w-full
            justify-center

            sm:mt-[58px]
            md:mt-[64px]
            lg:mt-[70px]
          "
        >
          {/* =================================================
              ACTUAL QUOTE GROUP
          ================================================= */}
          <div
            className="
              flex
              w-full
              max-w-full
              items-stretch

              sm:w-fit
            "
          >
            {/* ===============================================
                VERTICAL LINE
            =============================================== */}
            <div
              className="
                w-[2px]
                shrink-0
                self-stretch
                bg-black

                sm:w-[2px]
              "
            />

            {/* ===============================================
                QUOTE
            =============================================== */}
            <blockquote
              className="
                ml-[22px]

                font-[var(--font-sf-pro)]

                text-[25px]
                font-[650]
                leading-[1.32]
                tracking-[-0.5px]
                text-black

                sm:ml-[27px]
                sm:text-[30px]

                md:ml-[30px]
                md:text-[36px]
                md:leading-[1.3]

                lg:ml-[32px]
                lg:text-[42px]
                lg:leading-[1.28]
                lg:tracking-[-0.9px]
              "
            >
              {/* MOBILE — NATURAL WRAPPING */}
              <span className="sm:hidden">
                &quot;Protection isn&apos;t optional - but it should
                never come at the cost of comfort or style.&quot;
              </span>

              {/* TABLET / DESKTOP — EXACT 3 LINES */}
              <span className="hidden sm:block">
                <span className="block whitespace-nowrap">
                  &quot;Protection isn&apos;t optional -
                </span>

                <span className="block whitespace-nowrap">
                  but it should never come at
                </span>

                <span className="block whitespace-nowrap">
                  the cost of comfort or style.&quot;
                </span>
              </span>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}