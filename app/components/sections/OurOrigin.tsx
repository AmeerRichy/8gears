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

        /*
         * PHASE 1
         * Compress card toward the centre.
         *
         * This creates the visual illusion of the card turning
         * without using expensive preserve-3d / rotateY rendering.
         */
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

        /*
         * Change content only when the card is edge-on.
         * User never sees the swap.
         */
        setShowBack(nextSide);

        /*
         * Allow React to commit the new content before reopening.
         */
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });

        /*
         * PHASE 2
         * Expand the opposite face.
         */
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
        {/* =====================================================
            CARD
        ====================================================== */}
        <motion.div
          ref={scope}
          initial={false}
          className="
            relative
            mx-auto

            h-[520px]
            w-full
            max-w-[1380px]

            origin-center

            overflow-hidden
            rounded-[30px]

            bg-[#0b0b0b]

            sm:h-[560px]
            sm:rounded-[34px]

            md:h-[590px]

            lg:h-[610px]
            lg:rounded-[38px]
          "
          style={{
            willChange: "transform",
          }}
        >
          {!showBack ? (
            /* =================================================
                FRONT
            ================================================= */
            <div className="absolute inset-0">
              {/* ===============================================
                  IMAGE
              =============================================== */}
              <Image
                src="/assets/images/ourorigin.png"
                alt="Designers working together in a motorcycle gear workshop"
                fill
                priority={false}
                quality={88}
                draggable={false}
                sizes="
                  (max-width: 640px) 100vw,
                  (max-width: 1024px) calc(100vw - 104px),
                  (max-width: 1536px) calc(100vw - 152px),
                  1380px
                "
                className="
                  select-none
                  object-cover

                  object-[58%_center]

                  sm:object-[55%_center]
                  md:object-center
                "
              />

              {/* ===============================================
                  LEFT READABILITY GRADIENT
              =============================================== */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0

                  bg-[linear-gradient(90deg,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.57)_19%,rgba(0,0,0,0.25)_38%,rgba(0,0,0,0.06)_55%,rgba(0,0,0,0)_68%)]
                "
              />

              {/* ===============================================
                  BOTTOM CINEMATIC FADE
              =============================================== */}
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

              {/* ===============================================
                  FRONT CONTENT
              =============================================== */}
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

                    px-[28px]
                    pb-[42px]

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
                    {/* TITLE */}
                    <h2
                      className="
                        font-[var(--font-sf-pro)]

                        text-[34px]
                        font-[650]
                        leading-[1.05]
                        tracking-[-1.1px]
                        text-white

                        sm:text-[38px]
                        md:text-[40px]
                        lg:text-[42px]
                      "
                    >
                      Our Origin
                    </h2>

                    {/* DESCRIPTION */}
                    <p
                      className="
                        mt-[14px]

                        max-w-[455px]

                        font-[var(--font-sf-pro)]

                        text-[16px]
                        font-[400]
                        leading-[1.5]
                        tracking-[-0.1px]
                        text-white/95

                        sm:text-[17px]
                        md:text-[18px]
                        lg:text-[19px]
                      "
                    >
                      We source responsibly and create gear
                      that lasts—so every ride protects people,
                      communities, and the planet.
                    </p>

                    {/* SHOW MORE */}
                    <button
                      type="button"
                      onClick={() => flipCard(true)}
                      className="
                        group

                        mt-[17px]

                        inline-flex
                        cursor-pointer
                        items-center
                        gap-[7px]

                        border-0
                        bg-transparent
                        p-0

                        font-[var(--font-sf-pro)]

                        text-[16px]
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
            /* =================================================
                BACK
            ================================================= */
            <div
              className="
                absolute
                inset-0

                bg-[#0b0b0b]
              "
            >
              {/* ===============================================
                  BACKGROUND DEPTH
              =============================================== */}
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

              {/* ===============================================
                  SUBTLE EDGE
              =============================================== */}
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

              {/* ===============================================
                  BACK CONTENT
              =============================================== */}
              <div
                className="
                  relative
                  z-10

                  h-full
                  w-full

                  overflow-y-auto

                  px-[28px]
                  py-[36px]

                  sm:px-[42px]
                  sm:py-[44px]

                  md:px-[54px]
                  md:py-[52px]

                  lg:px-[68px]
                  lg:py-[60px]
                "
              >
                <div
                  className="
                    flex
                    min-h-full
                    max-w-[850px]
                    flex-col
                    justify-center
                  "
                >
                  {/* EYEBROW */}
                  <p
                    className="
                      font-[var(--font-sf-pro)]

                      text-[11px]
                      font-[500]
                      uppercase
                      tracking-[2.4px]
                      text-white/45

                      sm:text-[12px]
                    "
                  >
                    Where it started
                  </p>

                  {/* TITLE */}
                  <h2
                    className="
                      mt-[14px]

                      font-[var(--font-sf-pro)]

                      text-[34px]
                      font-[650]
                      leading-[1.05]
                      tracking-[-1.1px]
                      text-white

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
                      mt-[24px]

                      max-w-[790px]

                      space-y-[15px]

                      font-[var(--font-sf-pro)]

                      text-[14px]
                      font-[400]
                      leading-[1.58]
                      text-white/72

                      sm:text-[15px]
                      sm:leading-[1.62]

                      md:text-[16px]

                      lg:text-[17px]
                      lg:leading-[1.65]
                    "
                  >
                    <p>
                      We started with a simple belief:
                      motorcycle gear should never force a
                      rider to choose between protection,
                      comfort, and style.
                    </p>

                    <p>
                      Every piece begins with the rider in
                      mind. From the materials we select to
                      the way each panel is shaped, stitched,
                      and tested, our focus is on creating
                      gear that feels natural on the road and
                      dependable when it matters most.
                    </p>

                    <p>
                      We work with responsible materials,
                      thoughtful production methods, and
                      long-lasting construction because the
                      best gear should not be disposable.
                      It should travel with you, age with you,
                      and become part of the stories you
                      collect along the way.
                    </p>

                    <p>
                      What began as a pursuit of better riding
                      gear continues as a commitment to build
                      pieces riders can trust—designed with
                      purpose, made with care, and created for
                      the road ahead.
                    </p>
                  </div>

                  {/* BACK */}
                  <button
                    type="button"
                    onClick={() => flipCard(false)}
                    className="
                      group

                      mt-[27px]

                      inline-flex
                      w-fit
                      cursor-pointer
                      items-center
                      gap-[8px]

                      border-0
                      bg-transparent
                      p-0

                      font-[var(--font-sf-pro)]

                      text-[15px]
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

                      sm:text-[16px]
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