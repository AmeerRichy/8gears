"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    image: "/images/riding-hero.webp",
    title: (
      <>
        Intelligent Riding
        <br />
        Apparel
      </>
    ),
    description: (
      <>
        High-performance riding essentials crafted for comfort,
        <br className="hidden md:block" />
        safety, and limitless adventure.
      </>
    ),
  },

  {
    image: "/assets/images/h1m.png",
    title: (
      <>
        Ride Beyond
        <br />
        Limits
      </>
    ),
    description: (
      <>
        Premium riding gear engineered for protection,
        <br className="hidden md:block" />
        performance, and everyday adventure.
      </>
    ),
  },

  {
    image: "/assets/images/h1m.png",
    title: (
      <>
        Built For Every
        <br />
        Journey
      </>
    ),
    description: (
      <>
        Purpose-built apparel for riders who demand comfort,
        <br className="hidden md:block" />
        confidence, and complete protection.
      </>
    ),
  },
];

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        loop={slides.length > 1}
        speed={900}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[100svh] min-h-[680px] w-full overflow-hidden lg:min-h-[760px]">
              {/* Background image */}
              <img
                src={slide.image}
                alt="8Gears riding apparel"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              {/* Overall dark overlay */}
              <div className="absolute inset-0 bg-black/15" />

              {/* Left cinematic gradient */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,6,0.76)_0%,rgba(12,10,8,0.55)_28%,rgba(15,12,10,0.22)_52%,rgba(0,0,0,0)_76%)]" />

              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-[230px] bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

              {/* Top slight gradient */}
              <div className="absolute inset-x-0 top-0 h-[160px] bg-gradient-to-b from-black/25 to-transparent" />

              {/* Content */}
              <div className="relative z-10 mx-auto flex h-full w-full max-w-[1920px] items-center">
                <div className="w-full px-[24px] sm:px-[40px] md:px-[52px] lg:px-[70px] xl:px-[72px]">
                  <div className="mt-[-15px] max-w-[900px] text-white">
                    <h1 className="font-[var(--font-sf-pro)] text-[46px] font-semibold leading-[1.05] tracking-[0.2px] text-white sm:text-[56px] md:text-[62px] lg:text-[68px] xl:text-[72px]">
                      {slide.title}
                    </h1>

                    <p className="mt-[28px] max-w-[900px] font-[var(--font-sf-pro)] text-[19px] font-normal leading-[1.3] tracking-[0.1px] text-white/95 sm:text-[22px] md:text-[25px] lg:text-[29px] xl:text-[31px]">
                      {slide.description}
                    </p>

                    <div className="mt-[58px] flex w-full flex-col gap-[16px] sm:mt-[72px] sm:flex-row sm:items-center sm:gap-[38px]">
                      <button
                        onClick={() => router.push("/category?cat=all")}
                        className="flex h-[62px] w-full items-center justify-center rounded-full border border-white/45 bg-black/20 px-[30px] font-[var(--font-sf-pro)] text-[17px] font-semibold text-white backdrop-blur-[5px] transition-all duration-300 hover:bg-white hover:text-black sm:h-[72px] sm:w-[260px] sm:text-[19px]"
                      >
                        Explore Collection
                      </button>

                      <button
                        onClick={() => router.push("/about")}
                        className="flex h-[62px] w-full items-center justify-center rounded-full border border-white/10 bg-[#858181]/85 px-[30px] font-[var(--font-sf-pro)] text-[17px] font-semibold text-white backdrop-blur-[12px] transition-all duration-300 hover:bg-white hover:text-black sm:h-[72px] sm:w-[260px] sm:text-[19px]"
                      >
                        About
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .hero-swiper {
          width: 100%;
          height: 100%;
        }

        .hero-swiper .swiper-wrapper {
          height: 100%;
        }

        .hero-swiper .swiper-slide {
          height: auto;
        }

        .hero-swiper .swiper-pagination {
          bottom: 28px !important;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }

        .hero-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          margin: 0 !important;
          border-radius: 999px;
          background: rgba(51, 43, 37, 0.9);
          opacity: 1;
          transition:
            width 300ms ease,
            height 300ms ease,
            background-color 300ms ease,
            opacity 300ms ease;
        }

        .hero-swiper .swiper-pagination-bullet-active {
          width: 42px;
          height: 11px;
          background: #ffffff;
        }

        @media (max-width: 767px) {
          .hero-swiper .swiper-pagination {
            bottom: 20px !important;
          }

          .hero-swiper .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
          }

          .hero-swiper .swiper-pagination-bullet-active {
            width: 32px;
            height: 9px;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;