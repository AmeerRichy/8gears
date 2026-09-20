"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function AboutSustainability() {
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
          MAIN SECTION
      ====================================================== */}
      <div
        className="
          relative
          flex
          w-full
          flex-col

          lg:h-[600px]
          lg:flex-row
          lg:items-center

          xl:h-[620px]
        "
      >
        {/* =====================================================
            LEFT IMAGE — DESKTOP

            IMAGE TOUCHES LEFT EDGE.
            NO MASK / CLIP-PATH ADDED IN CODE.
        ====================================================== */}
        <div
          className="
            absolute
            bottom-0
            left-0
            top-0
            z-10

            hidden

            lg:block
            lg:w-[60%]

            xl:w-[61%]
          "
        >
          <img
            src="/assets/images/about-sustainability.png"
            alt="Sustainable and ethically sourced motorcycle gear"
            className="
              block
              h-full
              w-full

              object-cover
              object-right
            "
          />
        </div>

        {/* =====================================================
            CONTENT GRID
            MATCHES WEBSITE MAX WIDTH
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

            lg:h-full
            lg:w-[calc(100%-80px)]
            lg:justify-end
          "
        >
          {/* =================================================
              RIGHT CONTENT

              NARROWER WIDTH WHILE RIGHT-ALIGNED =
              CONTENT STARTS FURTHER RIGHT
          ================================================= */}
          <div
            className="
              w-full
              max-w-[570px]

              font-[var(--font-sf-pro)]
              text-black

              lg:w-[37%]
              lg:max-w-none

              xl:w-[36%]
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
              Sustainability
            </p>

            {/* =================================================
                HEADING
            ================================================= */}
            <h2
              className="
                mt-[22px]

                text-[38px]
                font-[650]
                leading-[1.08]
                tracking-[-1px]
                text-black

                sm:text-[44px]

                lg:mt-[24px]
                lg:text-[48px]

                xl:text-[50px]
              "
            >
              Sustainability &amp;
              <br />
              Ethical Sourcing
            </h2>

            {/* =================================================
                DESCRIPTION
            ================================================= */}
            <p
              className="
                mt-[24px]

                max-w-[550px]

                text-[17px]
                font-[400]
                leading-[1.55]
                tracking-[-0.15px]
                text-black

                sm:text-[18px]

                lg:text-[20px]
                lg:leading-[1.5]
              "
            >
              We source responsibly and create gear that
              <br className="hidden xl:block" />
              <span className="xl:hidden"> </span>
              lasts—so every ride protects people,
              <br className="hidden xl:block" />
              <span className="xl:hidden"> </span>
              communities, and the planet.
            </p>

            {/* =================================================
                CTA
            ================================================= */}
            <button
              type="button"
              onClick={() => router.push("/sustainability")}
              className="
                group/button

                mt-[34px]

                flex
                h-[54px]
                w-[205px]
                items-center
                justify-center
                gap-[12px]

                rounded-full

                border
                border-black/80

                bg-black

                font-[var(--font-sf-pro)]
                text-[15px]
                font-[400]
                text-white

                transition-all
                duration-300

                hover:-translate-y-[2px]
                hover:bg-white
                hover:text-black

                sm:mt-[38px]
                sm:h-[56px]
                sm:w-[215px]
                sm:text-[16px]

                lg:mt-[40px]
              "
            >
              <span>See More</span>

              <ArrowRight
                size={19}
                strokeWidth={1.7}
                className="
                  transition-transform
                  duration-300

                  group-hover/button:translate-x-[4px]
                "
              />
            </button>
          </div>
        </div>

        {/* =====================================================
            MOBILE / TABLET IMAGE

            CONTENT FIRST → IMAGE BELOW
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
            src="/assets/images/about-sustainability.png"
            alt="Sustainable and ethically sourced motorcycle gear"
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