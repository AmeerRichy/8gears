import React from "react";
import Link from "next/link";
import {
  Recycle,
  Banknote,
  Bandage,
  MapPin,
  ScrollText,
  LucideIcon,
} from "lucide-react";

type SustainabilityItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const leftItems: SustainabilityItem[] = [
  {
    title: "Recycles Materials",
    description: "Giving fabrics a second life.",
    icon: Recycle,
  },
  {
    title: "Responsible Production",
    description: "Ethical factories. Fair wages.",
    icon: Banknote,
  },
  {
    title: "Durable By Design",
    description: "Built to last. Not to landfill.",
    icon: Bandage,
  },
];

const rightItems: SustainabilityItem[] = [
  {
    title: "Low Impact Dyes",
    description: "Cleaner dyes for a cleaner world.",
    icon: ScrollText,
  },
  {
    title: "Traceability",
    description: "Goes through every aspects.",
    icon: MapPin,
  },
];

export default function SustainabilityThreadSection() {
  return (
    <section className="w-full bg-white">
      <div
        className="
          mx-auto
          w-full
          max-w-[1920px]
          px-5
          py-20

          sm:px-8

          md:px-12
          md:py-24

          lg:px-14

          xl:min-h-[645px]
          xl:px-[62px]
          xl:py-[108px]
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-16

            xl:grid-cols-[0.94fr_1.12fr_1.12fr]
            xl:gap-0
          "
        >
          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}
          <div
            className="
              flex
              flex-col
              items-start

              xl:pr-[75px]
            "
          >
            <h2
              className="
                max-w-[390px]
                text-[40px]
                font-semibold
                leading-[1.17]
                tracking-[-0.035em]
                text-black

                sm:text-[44px]

                md:text-[48px]

                xl:text-[48px]
              "
            >
              Sustainability In
              <br />
              Every Thread
            </h2>

            <p
              className="
                mt-6
                max-w-[355px]
                text-[17px]
                font-normal
                leading-[1.5]
                tracking-[0.005em]
                text-black/85

                sm:text-[18px]

                xl:mt-[24px]
                xl:text-[18px]
              "
            >
              From recycles materials to ethical
              <br className="hidden xl:block" />
              production, we&apos;re committed to
              <br className="hidden xl:block" />
              reducing our impact at every stop.
            </p>

            <Link
              href="/sustainability"
              className="
                mt-10
                inline-flex
                h-[68px]
                min-w-[250px]
                items-center
                justify-center
                rounded-full
                bg-black
                px-8
                text-[17px]
                font-normal
                text-white
                transition-all
                duration-300

                hover:scale-[1.02]
                hover:bg-black/85

                xl:mt-[38px]
              "
            >
              Our Commitment
            </Link>
          </div>

          {/* =====================================================
              CENTER COLUMN
          ====================================================== */}
          <div
            className="
              flex
              flex-col
              gap-10

              md:grid
              md:grid-cols-2

              xl:flex
              xl:gap-[56px]
              xl:border-r
              xl:border-black/30
              xl:px-[34px]
              xl:pr-[58px]
            "
          >
            {leftItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    flex
                    min-h-[76px]
                    items-start
                    gap-7

                    xl:gap-[34px]
                  "
                >
                  {/* ICON */}
                  <div
                    className="
                      flex
                      h-[64px]
                      w-[64px]
                      shrink-0
                      items-center
                      justify-center

                      xl:h-[70px]
                      xl:w-[70px]
                    "
                  >
                    <Icon
                      className="
                        h-[55px]
                        w-[55px]
                        text-black

                        xl:h-[62px]
                        xl:w-[62px]
                      "
                      strokeWidth={2.3}
                    />
                  </div>

                  {/* TEXT */}
                  <div className="pt-[1px]">
                    <h3
                      className="
                        text-[25px]
                        font-semibold
                        leading-[1.15]
                        tracking-[-0.025em]
                        text-black

                        xl:text-[29px]
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        mt-2
                        text-[16px]
                        leading-[1.4]
                        tracking-[0.04em]
                        text-black/50

                        xl:text-[18px]
                      "
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =====================================================
              RIGHT COLUMN
          ====================================================== */}
          <div
            className="
              flex
              flex-col
              gap-10

              md:grid
              md:grid-cols-2

              xl:flex
              xl:gap-[57px]
              xl:pl-[67px]
            "
          >
            {rightItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    flex
                    min-h-[76px]
                    items-start
                    gap-7

                    xl:gap-[34px]
                  "
                >
                  {/* ICON */}
                  <div
                    className="
                      flex
                      h-[64px]
                      w-[64px]
                      shrink-0
                      items-center
                      justify-center

                      xl:h-[70px]
                      xl:w-[70px]
                    "
                  >
                    <Icon
                      className="
                        h-[53px]
                        w-[53px]
                        text-black

                        xl:h-[60px]
                        xl:w-[60px]
                      "
                      strokeWidth={2.1}
                    />
                  </div>

                  {/* TEXT */}
                  <div className="pt-[2px]">
                    <h3
                      className="
                        text-[25px]
                        font-semibold
                        leading-[1.15]
                        tracking-[-0.025em]
                        text-black

                        xl:text-[29px]
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        mt-2
                        text-[16px]
                        leading-[1.4]
                        tracking-[0.04em]
                        text-black/50

                        xl:text-[18px]
                      "
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}