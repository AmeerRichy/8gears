"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useAnimate, useReducedMotion } from "motion/react";

export default function OurOrigin() {
  const [showBack, setShowBack] = useState(false);
  const [scope, animate] = useAnimate();
  const prefersReducedMotion = useReducedMotion();

  const isAnimating = useRef(false);

  const flipCard = useCallback(
    async (nextSide: boolean) => {
      if (isAnimating.current) return;

      isAnimating.current = true;

      try {
        if (prefersReducedMotion) {
          setShowBack(nextSide);
          return;
        }

        await animate(
          scope.current,
          {
            scaleX: 0.025,
          },
          {
            duration: 0.22,
            ease: [0.4, 0, 1, 1],
          }
        );

        setShowBack(nextSide);

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });

        await animate(
          scope.current,
          {
            scaleX: 1,
          },
          {
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }
        );
      } finally {
        isAnimating.current = false;
      }
    },
    [animate, prefersReducedMotion, scope]
  );

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white

        py-[18px]
        sm:py-[28px]
        md:py-[38px]
        lg:py-[50px]
      "
    >
      {/* MAIN CONTAINER */}
      <div
        className="
          mx-auto
          w-full
          max-w-[1920px]

          px-[16px]
          sm:px-[40px]
          md:px-[52px]
          lg:px-[76px]
          xl:px-[108px]
        "
      >
        {/* CARD */}
        <motion.div
          ref={scope}
          initial={false}
          className={`
            relative
            mx-auto

            w-full
            max-w-[1600px]

            origin-center
            overflow-hidden

            rounded-[24px]
            bg-[#0b0b0b]

            sm:rounded-[34px]
            lg:rounded-[38px]

            ${
              showBack
                ? `
                  h-[860px]
                  min-[390px]:h-[800px]
                  sm:h-[680px]
                  md:h-[620px]
                  lg:h-[610px]
                `
                : `
                  h-[520px]
                  sm:h-[560px]
                  md:h-[590px]
                  lg:h-[610px]
                `
            }
          `}
          style={{
            willChange: "transform",
          }}
        >
          {!showBack ? (
            /* ================= FRONT ================= */
            <div className="absolute inset-0">
              <Image
                src="/assets/images/ourorigin.webp"
                alt="Designers working together in a motorcycle gear workshop"
                fill
                priority={false}
                quality={88}
                draggable={false}
                sizes="
                  (max-width: 640px) 100vw,
                  (max-width: 1024px) calc(100vw - 104px),
                  (max-width: 1536px) calc(100vw - 152px),
                  1600px
                "
                className="
                  select-none
                  object-cover

                  object-[58%_center]

                  sm:object-[55%_center]
                  md:object-center
                "
              />

              {/* LEFT GRADIENT */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0

                  bg-[linear-gradient(90deg,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.57)_19%,rgba(0,0,0,0.25)_38%,rgba(0,0,0,0.06)_55%,rgba(0,0,0,0)_68%)]
                "
              />

              {/* BOTTOM FADE */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-0

                  h-[330px]

                  bg-gradient-to-t
                  from-black/45
                  via-black/10
                  to-transparent
                "
              />

              {/* FRONT CONTENT */}
              <div
                className="
                  absolute
                  inset-0
                  z-10

                  flex
                  items-end
                "
              >
                <div
                  className="
                    w-full

                    px-[24px]
                    pb-[34px]

                    sm:px-[40px]
                    sm:pb-[50px]

                    md:px-[54px]
                    md:pb-[60px]

                    lg:px-[68px]
                    lg:pb-[72px]
                  "
                >
                  <div
                    className="
                      max-w-[470px]
                      text-white
                    "
                  >
                    <h2
                      className="
                        font-[var(--font-sf-pro)]

                        text-[30px]
                        font-[650]
                        leading-[1.05]
                        tracking-[-1px]
                        text-white

                        sm:text-[38px]
                        md:text-[40px]
                        lg:text-[42px]
                      "
                    >
                      Our Origin
                    </h2>

                    <p
                      className="
                        mt-[12px]

                        max-w-[455px]

                        font-[var(--font-sf-pro)]

                        text-[14px]
                        font-[400]
                        leading-[1.5]
                        tracking-[-0.1px]
                        text-white/95

                        sm:mt-[14px]
                        sm:text-[17px]

                        md:text-[18px]
                        lg:text-[19px]
                      "
                    >
                      8 GEAR was never created to become just another motorcycle
                      apparel brand. It was created to...
                    </p>

                    <button
                      type="button"
                      onClick={() => flipCard(true)}
                      className="
                        group

                        mt-[16px]

                        inline-flex
                        cursor-pointer
                        items-center
                        gap-[7px]

                        border-0
                        bg-transparent
                        p-0

                        font-[var(--font-sf-pro)]

                        text-[15px]
                        font-[400]
                        leading-none
                        text-white

                        transition-opacity
                        duration-200

                        hover:opacity-70

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-white/80
                        focus-visible:ring-offset-4
                        focus-visible:ring-offset-black

                        sm:text-[17px]
                        lg:text-[18px]
                      "
                    >
                      <span>Show More</span>

                      <ArrowRight
                        size={20}
                        strokeWidth={1.6}
                        aria-hidden="true"
                        className="
                          transition-transform
                          duration-200

                          group-hover:translate-x-[3px]
                        "
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= BACK ================= */
            <div
              className="
                absolute
                inset-0
                bg-[#0b0b0b]
              "
            >
              {/* BACKGROUND */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0

                  bg-[linear-gradient(135deg,#111111_0%,#0b0b0b_55%,#050505_100%)]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0

                  bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.06),transparent_36%)]
                "
              />

              {/* EDGE */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0

                  rounded-[inherit]

                  ring-1
                  ring-inset
                  ring-white/[0.08]
                "
              />

              {/* BACK CONTENT */}
              <div
                className="
                  relative
                  z-10

                  h-full
                  w-full

                  overflow-hidden

                  px-[24px]
                  py-[30px]

                  sm:px-[42px]
                  sm:py-[40px]

                  md:px-[54px]
                  md:py-[48px]

                  lg:px-[68px]
                  lg:py-[60px]

                  xl:px-[78px]
                "
              >
                <div
                  className="
                    flex
                    min-h-full
                    w-full
                    max-w-[1180px]
                    flex-col
                    justify-center
                  "
                >
                  {/* EYEBROW */}
                  <p
                    className="
                      font-[var(--font-sf-pro)]

                      text-[10px]
                      font-[500]
                      uppercase
                      tracking-[2.1px]
                      text-white/45

                      sm:text-[12px]
                      sm:tracking-[2.4px]
                    "
                  >
                    Where it started
                  </p>

                  {/* TITLE */}
                  <h2
                    className="
                      mt-[10px]

                      font-[var(--font-sf-pro)]

                      text-[29px]
                      font-[650]
                      leading-[1.05]
                      tracking-[-1px]
                      text-white

                      sm:mt-[14px]
                      sm:text-[38px]

                      md:text-[42px]
                      lg:text-[44px]
                    "
                  >
                    Our Origin
                  </h2>

                  {/* FULL STORY */}
                  <div
                    className="
                      mt-[18px]

                      w-full
                      max-w-[1120px]

                      space-y-[11px]

                      font-[var(--font-sf-pro)]

                      text-[13px]
                      font-[400]
                      leading-[1.5]
                      text-white/72

                      sm:mt-[22px]
                      sm:space-y-[13px]
                      sm:text-[14px]
                      sm:leading-[1.55]

                      md:mt-[24px]
                      md:text-[15px]

                      lg:space-y-[15px]
                      lg:text-[17px]
                      lg:leading-[1.62]
                    "
                  >
                    <p>
                      8 GEAR was never created to become just another motorcycle
                      apparel brand. It was created to solve a problem. Before
                      founding 8 GEAR, we spent years working behind the scenes
                      in the apparel industry, manufacturing and supplying
                      private-label products for brands and businesses around
                      the world.
                    </p>

                    <p>
                      Like countless riders around the world, we also experienced
                      the realities of the road. Falls, close calls, changing
                      weather, and thousands of kilometers taught us one
                      important lesson:
                    </p>

                    <p>
                      <b>
                        Protection isn't optional—but it should never come at
                        the cost of comfort or style.
                      </b>
                    </p>

                    <p>
                      Traditional motorcycle gear was often heavy, hot, bulky,
                      and uncomfortable, especially during long summer rides.
                      We knew there had to be another way. A way to create
                      riding apparel that delivers real protection while
                      looking and feeling like modern lifestyle clothing. That
                      belief became the beginning of 8 GEAR.
                    </p>
                  </div>

                  {/* BACK BUTTON */}
                  <button
                    type="button"
                    onClick={() => flipCard(false)}
                    className="
                      group

                      mt-[20px]

                      inline-flex
                      w-fit
                      cursor-pointer
                      items-center
                      gap-[8px]

                      border-0
                      bg-transparent
                      p-0

                      font-[var(--font-sf-pro)]

                      text-[14px]
                      font-[400]
                      text-white

                      transition-opacity
                      duration-200

                      hover:opacity-65

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-white/80
                      focus-visible:ring-offset-4
                      focus-visible:ring-offset-[#0b0b0b]

                      sm:mt-[24px]
                      sm:text-[16px]

                      lg:mt-[27px]
                    "
                  >
                    <ArrowLeft
                      size={19}
                      strokeWidth={1.6}
                      aria-hidden="true"
                      className="
                        transition-transform
                        duration-200

                        group-hover:-translate-x-[3px]
                      "
                    />

                    <span>Back</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}