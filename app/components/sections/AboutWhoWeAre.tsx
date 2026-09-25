"use client";

import React from "react";

export default function AboutWhoWeAre() {
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
            LEFT CONTENT
        ====================================================== */}
        <div
          className="
            relative
            z-20
            flex
            w-full
            items-center

            px-[24px]

            sm:px-[40px]
            md:px-[52px]

            lg:min-h-[600px]
            lg:w-[46%]
            lg:px-0
            lg:pl-[76px]
            lg:pr-[30px]

            xl:min-h-[620px]
            xl:w-[45%]
            xl:pl-[90px]
            xl:pr-[35px]

            2xl:w-[44%]
            2xl:pl-[96px]
            2xl:pr-[40px]
          "
        >
          <div
            className="
              w-full
              max-w-[560px]
              font-[var(--font-sf-pro)]
              text-black
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
                tracking-[0.1px]
                text-black

                sm:text-[18px]
                lg:text-[20px]
              "
            >
              Who We Are
            </p>

            {/* =================================================
                HEADING
            ================================================= */}
            <h2
              className="
                mt-[22px]
                max-w-[500px]

                text-[38px]
                font-[650]
                leading-[1.08]
                tracking-[-1px]
                text-black

                sm:text-[44px]

                lg:mt-[24px]
                lg:text-[44px]

                xl:text-[48px]

                2xl:text-[50px]
              "
            >
              18 Years of Riding
              <br />
              Expertise.
            </h2>

            {/* =================================================
                DESCRIPTION
            ================================================= */}
            <p
              className="
                mt-[24px]
                w-full
                max-w-[540px]

                text-[17px]
                font-[400]
                leading-[1.55]
                tracking-[-0.15px]
                text-black

                sm:text-[18px]

                lg:text-[17px]
                lg:leading-[1.55]

                xl:text-[18px]
                xl:leading-[1.55]

                2xl:text-[20px]
                2xl:leading-[1.5]
              "
            >
              8 GEAR exists to redefine what motorcycle apparel can be. We
              don't simply manufacture motorcycle clothing. We engineer
              intelligent riding solutions. We combine advanced protection,
              premium materials, modern fashion, and intelligent design into
              apparel that moves effortlessly between the road and everyday
              life. We believe the future of motorcycle apparel is intelligent,
              versatile, and built entirely around the rider.
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT IMAGE — DESKTOP

            Image remains absolute and touches viewport right.
            Text has its own protected width, so it can NEVER
            run underneath the image.
        ====================================================== */}
        <div
          className="
            absolute
            bottom-0
            right-0
            top-0
            z-10

            hidden

            lg:block
            lg:w-[60%]

            xl:w-[61%]
          "
        >
          <img
            src="/assets/images/about-who-we-are.webp"
            alt="8-Gear rider with motorcycle"
            className="
              block
              h-full
              w-full
              object-cover
              object-left
            "
          />
        </div>

        {/* =====================================================
            MOBILE / TABLET IMAGE
        ====================================================== */}
        <div
          className="
            relative
            z-10
            mt-[40px]
            w-full
            lg:hidden
          "
        >
          <img
            src="/assets/images/about-who-we-are.webp"
            alt="8-Gear rider with motorcycle"
            className="
              block
              h-auto
              w-full
              object-contain
            "
          />
        </div>
      </div>
    </section>
  );
}