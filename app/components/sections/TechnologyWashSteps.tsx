"use client";

import React from "react";

import {
  Shirt,
  RotateCcw,
  LockKeyhole,
  FlaskConical,
  WashingMachine,
  Ban,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

/* ============================================================
   CUSTOM HANGER ICON
============================================================ */

function HangerIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M32 24V18C32 13.6 35.6 10 40 10C44.4 10 48 13.6 48 18C48 21.7 45.5 24.8 42 25.7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M32 24L10 40C7.6 41.8 8.8 45.5 12 45.5H52C55.2 45.5 56.4 41.8 54 40L32 24Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M14 45.5V52H50V45.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
   STEPS
============================================================ */

const washSteps = [
  {
    number: "1",
    line1: "REMOVE ALL ARMOR",
    line2: "",
    icon: Shirt,
  },
  {
    number: "2",
    line1: "TURN INSIDE OUT",
    line2: "",
    icon: RotateCcw,
  },
  {
    number: "3",
    line1: "CLOSE ZIPPERS",
    line2: "& BUTTONS",
    icon: LockKeyhole,
  },
  {
    number: "4",
    line1: "USE RECOMMENDED",
    line2: "DETERGENT",
    icon: FlaskConical,
  },
  {
    number: "5",
    line1: "WASH MAX 30°C",
    line2: "GENTLE CYCLE",
    icon: WashingMachine,
  },
  {
    number: "6",
    line1: "NO FABRIC",
    line2: "SOFTENERS",
    icon: Ban,
  },
  {
    number: "7",
    line1: "HANG DRY, DO NOT",
    line2: "TUMBLE DRY",
    icon: HangerIcon,
  },
];

/* ============================================================
   COMPONENT
============================================================ */

export default function TechnologyWashSteps() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white

        py-[30px]

        sm:py-[42px]

        md:py-[52px]

        lg:py-[70px]
      "
    >
      <Swiper
        modules={[Autoplay]}
        loop={true}
        speed={4500}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        allowTouchMove={true}
        grabCursor={true}
        watchSlidesProgress={true}
        observer={true}
        observeParents={true}

        /* MOBILE */
        slidesPerView={2.05}
        spaceBetween={10}

        breakpoints={{
          390: {
            slidesPerView: 2.15,
            spaceBetween: 10,
          },

          480: {
            slidesPerView: 2.35,
            spaceBetween: 12,
          },

          520: {
            slidesPerView: 2.5,
            spaceBetween: 14,
          },

          640: {
            slidesPerView: 2.8,
            spaceBetween: 16,
          },

          768: {
            slidesPerView: 3.2,
            spaceBetween: 20,
          },

          1024: {
            slidesPerView: 3.8,
            spaceBetween: 24,
          },

          1280: {
            slidesPerView: 4.6,
            spaceBetween: 26,
          },

          1440: {
            slidesPerView: 5.15,
            spaceBetween: 28,
          },

          1700: {
            slidesPerView: 5.65,
            spaceBetween: 30,
          },
        }}
        onSwiper={(swiper) => {
          if (swiper.wrapperEl) {
            swiper.wrapperEl.style.transitionTimingFunction = "linear";
          }
        }}
        onSetTransition={(swiper) => {
          if (swiper.wrapperEl) {
            swiper.wrapperEl.style.transitionTimingFunction = "linear";
          }
        }}
        className="
          technology-wash-swiper
          !overflow-visible

          px-[14px]

          sm:px-[20px]

          lg:px-[50px]
        "
      >
        {washSteps.map((step) => {
          const Icon = step.icon;

          return (
            <SwiperSlide
              key={step.number}
              className="!h-auto"
            >
              <article
                className="
                  flex
                  h-[218px]
                  w-full
                  flex-col
                  items-center

                  rounded-[13px]

                  bg-[#F1F1F3]

                  px-[10px]
                  pb-[16px]
                  pt-[16px]

                  text-center

                  sm:h-[260px]
                  sm:rounded-[16px]
                  sm:px-[16px]
                  sm:pb-[22px]
                  sm:pt-[22px]

                  md:h-[300px]

                  lg:h-[350px]
                  lg:rounded-[18px]
                  lg:px-[22px]
                  lg:pb-[32px]
                  lg:pt-[34px]
                "
              >
                {/* =================================================
                    NUMBER
                ================================================= */}

                <div
                  className="
                    flex
                    h-[42px]
                    w-[42px]
                    shrink-0

                    items-center
                    justify-center

                    rounded-full

                    border
                    border-black/[0.06]

                    bg-white

                    font-[var(--font-sf-pro)]

                    text-[18px]
                    font-medium
                    leading-none
                    text-black

                    sm:h-[52px]
                    sm:w-[52px]
                    sm:text-[21px]

                    md:h-[60px]
                    md:w-[60px]
                    md:text-[24px]

                    lg:h-[70px]
                    lg:w-[70px]
                    lg:text-[29px]
                  "
                >
                  {step.number}
                </div>

                {/* =================================================
                    ICON
                ================================================= */}

                <div
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                  "
                >
                  <Icon
                    className="
                      h-[34px]
                      w-[34px]
                      text-black

                      sm:h-[40px]
                      sm:w-[40px]

                      md:h-[48px]
                      md:w-[48px]

                      lg:h-[56px]
                      lg:w-[56px]
                    "
                    strokeWidth={1.7}
                  />
                </div>

                {/* =================================================
                    TITLE
                ================================================= */}

                <div
                  className="
                    flex
                    min-h-[42px]
                    flex-col
                    items-center
                    justify-center

                    font-[var(--font-sf-pro)]

                    text-[11px]
                    font-semibold
                    leading-[1.3]
                    tracking-[-0.05px]

                    text-black

                    sm:min-h-[48px]
                    sm:text-[13px]

                    md:min-h-[54px]
                    md:text-[15px]

                    lg:min-h-[58px]
                    lg:text-[18px]
                    lg:font-medium
                    lg:leading-[1.4]
                  "
                >
                  <span>{step.line1}</span>

                  {step.line2 && (
                    <span>{step.line2}</span>
                  )}
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}