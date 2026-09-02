"use client";

import React from "react";
import {
  Shield,
  UsersRound,
  Layers3,
} from "lucide-react";

const pillars = [
  {
    id: 1,
    image: "/assets/images/sustainability-materials.png",
    title: "Responsible Materials",
    description:
      "We prioritize materials that reduce environmental impact without compromising protection or performance.",
    icon: Layers3,
  },
  {
    id: 2,
    image: "/assets/images/sustainability-durability.png",
    title: "Built For Durability",
    description:
      "The most suitable gear is the gear that lasts. Our first and foremost priority is to make sure our gear passes every durability test.",
    icon: Shield,
  },
  {
    id: 3,
    image: "/assets/images/sustainability-ethical.png",
    title: "Ethical Manufacturing",
    description:
      "We partner with certified factories that meet strict standards for people and the planet.",
    icon: UsersRound,
  },
];

export default function SustainabilityCommitment() {
  return (
    <section
      className="
        w-full
        bg-white
        py-[80px]

        sm:py-[100px]
        lg:py-[130px]
        xl:py-[145px]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1920px]
          px-[20px]

          sm:px-[32px]
          md:px-[42px]
          lg:px-[40px]
        "
      >
        {/* =====================================================
            HEADING
        ====================================================== */}
        <div className="text-center">
          <p
            className="
              font-[var(--font-sf-pro)]
              text-[20px]
              font-[600]
              tracking-[0.2px]
              text-black

              sm:text-[24px]
              md:text-[27px]
              lg:text-[30px]
            "
          >
            Our Commitment
          </p>

          <h2
            className="
              mt-[20px]
              font-[var(--font-sf-pro)]
              text-[32px]
              font-[650]
              leading-[1.1]
              tracking-[-0.7px]
              text-black

              sm:text-[39px]
              md:text-[44px]
              lg:text-[48px]
              xl:text-[51px]
            "
          >
            We Focus On Three Pillars.
          </h2>
        </div>

        {/* =====================================================
            CARDS
        ====================================================== */}
        <div
          className="
            mt-[70px]
            grid
            grid-cols-1
            gap-[28px]

            md:mt-[90px]
            md:grid-cols-2

            lg:mt-[105px]
            lg:grid-cols-3
            lg:gap-[54px]
          "
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article
                key={pillar.id}
                className="
                  group
                  overflow-hidden
                  rounded-[24px]
                  bg-[#f1f1f3]
                "
              >
                {/* =============================================
                    IMAGE
                ============================================== */}
                <div
                  className="
                    relative
                    h-[220px]
                    w-full
                    overflow-hidden

                    sm:h-[240px]
                    lg:h-[195px]
                    xl:h-[205px]
                    2xl:h-[220px]
                  "
                >
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      ease-out

                      group-hover:scale-[1.035]
                    "
                  />

                  {/* subtle image depth */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/10
                      via-transparent
                      to-transparent
                    "
                  />
                </div>

                {/* =============================================
                    CONTENT
                ============================================== */}
                <div
                  className="
                    relative
                    min-h-[205px]
                    px-[26px]
                    pb-[32px]
                    pt-[36px]

                    sm:px-[30px]

                    lg:min-h-[215px]
                    lg:px-[26px]
                    lg:pb-[30px]
                    lg:pt-[37px]

                    xl:px-[32px]
                  "
                >
                  <div className="flex items-start gap-[20px]">
                    {/* =========================================
                        ICON
                    ========================================== */}
                    <div
                      className="
                        flex
                        h-[52px]
                        w-[52px]
                        shrink-0
                        items-center
                        justify-center

                        rounded-full
                        bg-white

                        shadow-[0_3px_12px_rgba(0,0,0,0.025)]
                      "
                    >
                      <Icon
                        size={29}
                        strokeWidth={1.8}
                        className="text-[#b28a5b]"
                      />
                    </div>

                    {/* =========================================
                        TEXT
                    ========================================== */}
                    <div className="min-w-0">
                      <h3
                        className="
                          font-[var(--font-sf-pro)]
                          text-[22px]
                          font-[650]
                          leading-[1.15]
                          tracking-[-0.3px]
                          text-black

                          sm:text-[24px]

                          lg:text-[22px]

                          xl:text-[25px]

                          2xl:text-[27px]
                        "
                      >
                        {pillar.id}. {pillar.title}
                      </h3>

                      <p
                        className="
                          mt-[12px]
                          max-w-[520px]

                          font-[var(--font-sf-pro)]
                          text-[16px]
                          font-[400]
                          leading-[1.35]
                          tracking-[0.5px]
                          text-[#858585]

                          sm:text-[17px]

                          lg:text-[15px]

                          xl:text-[17px]

                          2xl:text-[18px]
                        "
                      >
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}