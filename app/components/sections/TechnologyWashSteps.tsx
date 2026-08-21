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
        py-[48px]

        sm:py-[58px]

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
        slidesPerView={1.25}
        spaceBetween={14}
        breakpoints={{
          420: {
            slidesPerView: 1.45,
            spaceBetween: 16,
          },

          520: {
            slidesPerView: 1.8,
            spaceBetween: 16,
          },

          640: {
            slidesPerView: 2.25,
            spaceBetween: 18,
          },

          768: {
            slidesPerView: 2.8,
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
            swiper.wrapperEl.style.transitionTimingFunction =
              "linear";
          }
        }}
        onSetTransition={(swiper) => {
          if (swiper.wrapperEl) {
            swiper.wrapperEl.style.transitionTimingFunction =
              "linear";
          }
        }}
        className="
          technology-wash-swiper
          !overflow-visible
          px-[18px]

          sm:px-[24px]

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
                  h-[315px]
                  w-full
                  flex-col
                  items-center
                  rounded-[18px]
                  bg-[#F1F1F3]
                  px-[18px]
                  pb-[28px]
                  pt-[30px]
                  text-center

                  sm:h-[335px]
                  sm:px-[20px]
                  sm:pb-[30px]
                  sm:pt-[32px]

                  lg:h-[350px]
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
                    h-[64px]
                    w-[64px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-black/[0.06]
                    bg-white
                    font-[var(--font-sf-pro)]
                    text-[26px]
                    font-medium
                    leading-none
                    text-black

                    sm:h-[68px]
                    sm:w-[68px]
                    sm:text-[28px]

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
                      h-[48px]
                      w-[48px]
                      text-black

                      sm:h-[52px]
                      sm:w-[52px]

                      lg:h-[56px]
                      lg:w-[56px]
                    "
                    strokeWidth={1.8}
                  />
                </div>

                {/* =================================================
                    TITLE
                ================================================= */}

                <div
                  className="
                    flex
                    min-h-[58px]
                    flex-col
                    items-center
                    justify-center
                    font-[var(--font-sf-pro)]
                    text-[16px]
                    font-medium
                    leading-[1.4]
                    tracking-[-0.1px]
                    text-black

                    sm:text-[17px]

                    lg:text-[18px]
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