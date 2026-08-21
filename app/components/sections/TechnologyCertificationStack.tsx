"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

export default function TechnologyCertificationStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* =====================================================
         DESKTOP / TABLET
      ====================================================== */

      mm.add("(min-width: 768px)", () => {
        const cardElements =
          gsap.utils.toArray<HTMLElement>(".certification-stack-card");

        if (cardElements.length < 3) return;

        /* =================================================
           INITIAL STATE

           Only Class A is visible.

           AA + AAA stay inside the stage but are:
           - invisible
           - slightly lower
           - blurred

           This means NO overflow clipping is required.
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

            // Fast / responsive
            end: "+=1000",

            pin: true,

            // Smooth without feeling delayed
            scrub: 0.32,

            anticipatePin: 1,

            invalidateOnRefresh: true,
          },
        });

        /* =================================================
           CLASS AA ENTERS

           Full card remains visible.
           No clipping.
           Blur -> sharp.
           Fade -> solid.
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

        /* Slight depth on A */

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

        /* AA moves slightly into background */

        timeline.to(
          cardElements[1],
          {
            scale: 0.993,
            duration: 1,
            ease: "none",
          },
          1
        );

        /* A moves slightly further back */

        timeline.to(
          cardElements[0],
          {
            scale: 0.975,
            duration: 1,
            ease: "none",
          },
          1
        );

        /* =================================================
           SMALL END HOLD

           Prevents the section from releasing instantly
           after AAA becomes fully visible.
        ================================================= */

        timeline.to({}, { duration: 0.12 });

        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });

      /* =====================================================
         MOBILE

         Normal static layout.
      ====================================================== */

      mm.add("(max-width: 767px)", () => {
        const cardElements =
          gsap.utils.toArray<HTMLElement>(".certification-stack-card");

        gsap.set(cardElements, {
          clearProps:
            "transform,zIndex,opacity,visibility,filter,willChange",
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
        bg-white

        py-[50px]

        md:flex
        md:h-screen
        md:min-h-[650px]
        md:items-center
        md:justify-center
        md:py-0
      "
    >
      {/* =====================================================
          STAGE

          IMPORTANT:
          No overflow-hidden here.

          Upcoming cards are hidden by GSAP instead,
          so their bottoms never get cut during animation.
      ====================================================== */}

      <div
        ref={stageRef}
        className="
          relative
          mx-auto

          flex
          w-full
          flex-col
          gap-[18px]

          px-[16px]

          sm:px-[24px]

          md:block
          md:h-[520px]
          md:w-[92%]
          md:max-w-[1500px]
          md:px-0

          lg:h-[535px]

          xl:h-[550px]
      "
      >
        {cards.map((card, index) => (
          <CertificationCard
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
   CARD
============================================================ */

type CertificationCardProps = {
  title: string;
  description: string;
  image: string;
  index: number;
};

function CertificationCard({
  title,
  description,
  image,
}: CertificationCardProps) {
  return (
    <article
      className="
        certification-stack-card

        relative
        w-full
        overflow-hidden

        rounded-[22px]

        border-[2px]
        border-[#E3E3E3]

        bg-[#FFFCFC]

        [backface-visibility:hidden]
        [transform:translateZ(0)]
        [will-change:transform,opacity,filter]

        md:absolute
        md:left-0
        md:top-0

        md:h-[430px]

        md:rounded-[28px]
        md:border-[3px]

        lg:h-[445px]

        xl:h-[455px]
      "
    >
      <div
        className="
          grid
          h-full
          w-full
          grid-cols-1

          md:grid-cols-[1.03fr_0.97fr]
        "
      >
        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}

        <div
          className="
            flex
            items-center

            px-[24px]
            pb-[24px]
            pt-[32px]

            sm:px-[34px]
            sm:pb-[30px]
            sm:pt-[40px]

            md:px-[50px]
            md:py-[35px]

            lg:px-[64px]

            xl:px-[72px]
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[610px]

              md:mx-0
            "
          >
            <h2
              className="
                font-[var(--font-sf-pro)]

                text-[22px]
                font-semibold
                leading-[1.2]
                tracking-[-0.45px]

                text-black

                sm:text-[25px]

                md:text-[26px]

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

                text-[14px]
                font-normal
                leading-[1.55]

                text-black/80

                sm:text-[15px]

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
            min-h-[310px]
            items-center
            justify-center

            px-[18px]
            pb-[28px]

            sm:min-h-[360px]

            md:min-h-0
            md:px-[24px]
            md:py-[22px]

            lg:px-[30px]
          "
        >
          {/* =================================================
              SOFT CENTER FADE
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0

              bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(255,255,255,0.95)_48%,rgba(255,252,252,0)_80%)]
            "
          />

          {/* =================================================
              IMAGE
          ================================================= */}

          <div
            className="
              relative
              z-10

              h-[285px]
              w-full
              max-w-[440px]

              sm:h-[330px]
              sm:max-w-[500px]

              md:h-[340px]
              md:max-w-[470px]

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
                (max-width: 767px) 90vw,
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