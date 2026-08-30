"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   CONFIG
============================================================ */

const STACK_GAP = 18;

const cards = [
  {
    title: "Class A Garments (EN 17092-4:2020)",
    description:
      "Class A garments provide essential motorcycle protection with a greater focus on comfort, mobility, and lighter construction. They are particularly suitable for urban riding and lower-speed environments where ease of movement is a priority.",
    image: "/assets/images/class-a.png",
  },
  {
    title: "Class AA Garments (EN 17092-3:2020)",
    description:
      "Class AA garments provide a high level of protection from impact and abrasion while maintaining greater comfort and flexibility. They are designed for a wide range of road riding environments where certified protection and everyday usability are equally important.",
    image: "/assets/images/class-aa.png",
  },
  {
    title: "Class AAA Garments (EN 17092-2:2020)",
    description:
      "Class AAA garments offer the highest level of protection from impact and abrasion, using materials and constructions that meet higher requirements than for garments classified as Class AA and Class A. Class AAA garments may have limiting ergonomic, weight, and thermal penalties for some riding activities. Some common examples include one-piece or combi suits.",
    image: "/assets/images/class-aaa.png",
  },
];

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function TechnologyCertificationStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* =====================================================
         DESKTOP / TABLET STACK
      ====================================================== */

      mm.add("(min-width: 768px)", () => {
        const cardElements = gsap.utils.toArray<HTMLElement>(
          ".certification-stack-card-desktop"
        );

        if (cardElements.length < 3) return;

        /* =================================================
           INITIAL STATE
        ================================================= */

        gsap.set(cardElements[0], {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          filter: "blur(0px)",
          zIndex: 20,
          transformOrigin: "center center",
        });

        gsap.set(cardElements[1], {
          y: 110,
          scale: 0.99,
          autoAlpha: 0,
          filter: "blur(12px)",
          zIndex: 21,
          transformOrigin: "center center",
        });

        gsap.set(cardElements[2], {
          y: 110,
          scale: 0.99,
          autoAlpha: 0,
          filter: "blur(12px)",
          zIndex: 22,
          transformOrigin: "center center",
        });

        /* =================================================
           TIMELINE
        ================================================= */

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=1000",
            pin: true,
            scrub: 0.32,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        /* =================================================
           CLASS AA ENTERS
        ================================================= */

        timeline.to(
          cardElements[1],
          {
            y: STACK_GAP,
            scale: 1,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "none",
          },
          0
        );

        timeline.to(
          cardElements[0],
          {
            scale: 0.986,
            duration: 1,
            ease: "none",
          },
          0
        );

        /* =================================================
           CLASS AAA ENTERS
        ================================================= */

        timeline.to(
          cardElements[2],
          {
            y: STACK_GAP * 2,
            scale: 1,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "none",
          },
          1
        );

        timeline.to(
          cardElements[1],
          {
            scale: 0.993,
            duration: 1,
            ease: "none",
          },
          1
        );

        timeline.to(
          cardElements[0],
          {
            scale: 0.975,
            duration: 1,
            ease: "none",
          },
          1
        );

        timeline.to({}, { duration: 0.12 });

        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });

      return () => {
        mm.revert();
      };
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        bg-white

        py-[38px]

        md:flex
        md:h-screen
        md:min-h-[650px]
        md:items-center
        md:justify-center
        md:overflow-visible
        md:py-0
      "
    >
      {/* =====================================================
          MOBILE SLIDER
      ====================================================== */}

      <div className="w-full md:hidden">
        <Swiper
          slidesPerView={1.18}
          spaceBetween={12}
          grabCursor
          className="
            certification-mobile-swiper
            !overflow-visible
            !px-[18px]
          "
          breakpoints={{
            390: {
              slidesPerView: 1.22,
              spaceBetween: 14,
            },
            480: {
              slidesPerView: 1.4,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 1.7,
              spaceBetween: 18,
            },
          }}
        >
          {cards.map((card, index) => (
            <SwiperSlide
              key={card.title}
              className="!h-auto"
            >
              <MobileCertificationCard
                {...card}
                index={index}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* MOBILE SWIPE HINT */}
        <div
          className="
            mt-[16px]
            flex
            items-center
            justify-center
            gap-[6px]

            font-[var(--font-sf-pro)]
            text-[10px]
            font-medium
            uppercase
            tracking-[0.12em]
            text-black/40
          "
        >
          <span>Swipe to explore</span>
          <span className="text-[13px]">→</span>
        </div>
      </div>

      {/* =====================================================
          DESKTOP / TABLET STACK
      ====================================================== */}

      <div
        ref={stageRef}
        className="
          relative
          mx-auto

          hidden
          w-full

          md:block
          md:h-[520px]
          md:w-[92%]
          md:max-w-[1500px]

          lg:h-[535px]

          xl:h-[550px]
        "
      >
        {cards.map((card, index) => (
          <DesktopCertificationCard
            key={card.title}
            {...card}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   MOBILE CARD
============================================================ */

type CertificationCardProps = {
  title: string;
  description: string;
  image: string;
  index: number;
};

function MobileCertificationCard({
  title,
  description,
  image,
  index,
}: CertificationCardProps) {
  return (
    <article
      className="
        flex
        h-[390px]
        w-full
        flex-col
        overflow-hidden

        rounded-[18px]

        border
        border-[#E3E3E3]

        bg-[#FFFCFC]
      "
    >
      {/* =====================================================
          MOBILE IMAGE
      ====================================================== */}

      <div
        className="
          relative
          h-[178px]
          w-full
          shrink-0

          overflow-hidden

          bg-[#fafafa]
        "
      >
        {/* SOFT BACKGROUND */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0

            bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(249,249,249,1)_55%,rgba(244,244,244,1)_100%)]
          "
        />

        {/* CLASS BADGE */}
        <div
          className="
            absolute
            left-[14px]
            top-[14px]
            z-20

            flex
            h-[30px]
            min-w-[54px]
            items-center
            justify-center

            rounded-full

            border
            border-black/[0.07]

            bg-white

            px-[11px]

            font-[var(--font-sf-pro)]
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.08em]

            text-black
          "
        >
          {index === 0
            ? "A"
            : index === 1
            ? "AA"
            : "AAA"}
        </div>

        {/* IMAGE */}
        <div
          className="
            absolute
            inset-x-[15px]
            bottom-[6px]
            top-[10px]
            z-10
          "
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="80vw"
            className="
              object-contain
              object-center
            "
          />
        </div>
      </div>

      {/* =====================================================
          MOBILE CONTENT
      ====================================================== */}

      <div
        className="
          flex
          flex-1
          flex-col

          px-[18px]
          pb-[18px]
          pt-[17px]
        "
      >
        <h2
          className="
            font-[var(--font-sf-pro)]

            text-[17px]
            font-semibold
            leading-[1.2]
            tracking-[-0.3px]

            text-black
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-[11px]

            line-clamp-6

            font-[var(--font-sf-pro)]

            text-[12px]
            font-normal
            leading-[1.5]

            text-black/65
          "
        >
          {description}
        </p>
      </div>
    </article>
  );
}

/* ============================================================
   DESKTOP CARD
============================================================ */

function DesktopCertificationCard({
  title,
  description,
  image,
}: CertificationCardProps) {
  return (
    <article
      className="
        certification-stack-card-desktop

        absolute
        left-0
        top-0

        h-[430px]
        w-full

        overflow-hidden

        rounded-[28px]

        border-[3px]
        border-[#E3E3E3]

        bg-[#FFFCFC]

        [backface-visibility:hidden]
        [transform:translateZ(0)]
        [will-change:transform,opacity,filter]

        lg:h-[445px]

        xl:h-[455px]
      "
    >
      <div
        className="
          grid
          h-full
          w-full

          grid-cols-[1.03fr_0.97fr]
        "
      >
        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}

        <div
          className="
            flex
            items-center

            px-[50px]
            py-[35px]

            lg:px-[64px]

            xl:px-[72px]
          "
        >
          <div
            className="
              w-full
              max-w-[610px]
            "
          >
            <h2
              className="
                font-[var(--font-sf-pro)]

                text-[26px]
                font-semibold
                leading-[1.2]
                tracking-[-0.45px]

                text-black

                lg:text-[29px]

                xl:text-[30px]
              "
            >
              {title}
            </h2>

            <p
              className="
                mt-[18px]
                max-w-[570px]

                font-[var(--font-sf-pro)]

                text-[15px]
                font-normal
                leading-[1.55]

                text-black/80

                lg:text-[16px]
                lg:leading-[1.6]
              "
            >
              {description}
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT IMAGE
        ====================================================== */}

        <div
          className="
            relative

            flex
            min-h-0
            items-center
            justify-center

            px-[24px]
            py-[22px]

            lg:px-[30px]
          "
        >
          {/* SOFT CENTER FADE */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0

              bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(255,255,255,0.95)_48%,rgba(255,252,252,0)_80%)]
            "
          />

          {/* IMAGE */}
          <div
            className="
              relative
              z-10

              h-[340px]
              w-full
              max-w-[470px]

              lg:h-[355px]
              lg:max-w-[500px]

              xl:h-[365px]
              xl:max-w-[520px]
            "
          >
            <Image
              src={image}
              alt={title}
              fill
              sizes="
                (max-width: 1200px) 45vw,
                520px
              "
              onLoad={() => {
                ScrollTrigger.refresh();
              }}
              className="
                object-contain
                object-center
              "
            />
          </div>
        </div>
      </div>
    </article>
  );
}