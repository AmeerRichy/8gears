"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Globe2,
  Recycle,
  Trees,
  Droplets,
  LucideIcon,
} from "lucide-react";

type ImpactItem = {
  target: number;
  suffix: string;
  description: string;
  progress: number;
  icon: LucideIcon;
};

const impactItems: ImpactItem[] = [
  {
    target: 65,
    suffix: "%",
    description: "Less CO₂ than conventional production",
    progress: 65,
    icon: Globe2,
  },
  {
    target: 15,
    suffix: "%",
    description: "Of our revenue invests in environmental projects",
    progress: 15,
    icon: Recycle,
  },
  {
    target: 150,
    suffix: "+",
    description: "Trees planted by our rider community",
    progress: 86,
    icon: Trees,
  },
  {
    target: 89,
    suffix: "%",
    description: "Less water used in our manufacturing",
    progress: 89,
    icon: Droplets,
  },
];

export default function ImpactProgressSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  const [counts, setCounts] = useState<number[]>(
    impactItems.map(() => 0)
  );

  /* ========================================
     DETECT WHEN SECTION ENTERS VIEW
  ======================================== */
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Run only once
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  /* ========================================
     COUNTER ANIMATION
  ======================================== */
  useEffect(() => {
    if (!isVisible) return;

    const duration = 1300;
    const startTime = performance.now();

    let animationFrame: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      const rawProgress = Math.min(elapsed / duration, 1);

      // Smooth ease-out animation
      const easedProgress =
        1 - Math.pow(1 - rawProgress, 3);

      setCounts(
        impactItems.map((item) =>
          Math.round(item.target * easedProgress)
        )
      );

      if (rawProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#ffffff]"
    >
      <div
        className="
          mx-auto
          flex
          min-h-[500px]
          w-full
          max-w-[1800px]
          flex-col
          justify-center
          px-5
          py-10

          sm:px-8
          md:px-12
          lg:px-16
          xl:px-20
        "
      >
        {/* ========================================
            HEADING
        ======================================== */}
        <div className="mb-16 text-center md:mb-24 lg:mb-28">
          <p
            className="
              mb-4
              text-[18px]
              font-medium
              tracking-[-0.02em]
              text-black

              sm:text-[20px]
              md:text-[22px]
            "
          >
            Our Impact
          </p>

          <h2
            className="
              text-[34px]
              font-semibold
              leading-none
              tracking-[-0.04em]
              text-black

              sm:text-[38px]
              md:text-[42px]
              lg:text-[46px]
            "
          >
            Our Progress
          </h2>
        </div>

        {/* ========================================
            STATS
        ======================================== */}
        <div
          className="
            grid
            grid-cols-1

            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {impactItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={`${item.target}-${index}`}
                className={`
                  relative
                  px-0
                  py-8

                  md:px-8
                  md:py-10

                  xl:px-10
                  xl:py-0

                  ${
                    index !== impactItems.length - 1
                      ? "border-b border-black/15 xl:border-b-0 xl:border-r"
                      : ""
                  }

                  ${
                    index === 1
                      ? "md:border-b md:border-black/15 xl:border-b-0"
                      : ""
                  }
                `}
              >
                {/* ========================================
                    ICON + ANIMATED NUMBER
                ======================================== */}
                <div className="mb-7 flex items-center gap-5">
                  <Icon
                    strokeWidth={1.7}
                    className="
                      h-[48px]
                      w-[48px]
                      flex-none
                      text-black

                      sm:h-[52px]
                      sm:w-[52px]

                      lg:h-[56px]
                      lg:w-[56px]
                    "
                  />

                  <span
                    className="
                      tabular-nums
                      text-[48px]
                      font-semibold
                      leading-none
                      tracking-[-0.05em]
                      text-black

                      sm:text-[52px]
                      lg:text-[58px]
                    "
                  >
                    {counts[index]}
                    {item.suffix}
                  </span>
                </div>

                {/* ========================================
                    ANIMATED PROGRESS BAR
                ======================================== */}
                <div
                  className="
                    mb-5
                    h-[11px]
                    w-full
                    overflow-hidden
                    rounded-full
                    bg-[#e6e6e6]
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-black
                      transition-[width]
                      duration-[1300ms]
                      ease-out
                    "
                    style={{
                      width: isVisible
                        ? `${item.progress}%`
                        : "0%",
                    }}
                  />
                </div>

                {/* ========================================
                    DESCRIPTION
                ======================================== */}
                <p
                  className="
                    max-w-[270px]
                    text-[16px]
                    font-normal
                    leading-[1.35]
                    tracking-[-0.015em]
                    text-black

                    sm:text-[17px]
                    lg:text-[18px]
                  "
                >
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}