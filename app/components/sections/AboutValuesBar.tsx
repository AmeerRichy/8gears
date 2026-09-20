"use client";

import React from "react";

export default function AboutValuesBar() {
  const values = [
    {
      title: "Protection",
      subtitle: "that feels natural",
    },
    {
      title: "Comfort",
      subtitle: "never compromised",
    },
    {
      title: "Style",
      subtitle: "never sacrificed",
    },
    {
      title: "Safety",
      subtitle: "never optional",
    },
  ];

  return (
    <section
      className="
        w-full
        border-b
        border-white/80
        bg-[#111111]
      "
    >
      <div
        className="
          mx-auto
          grid
          min-h-[137px]
          w-full
          max-w-[1920px]
          grid-cols-1

          md:grid-cols-2
          lg:grid-cols-4
        "
      >
        {values.map((item, index) => (
          <div
            key={item.title}
            className="
              relative
              flex
              min-h-[137px]
              items-center

              px-[32px]

              sm:px-[48px]
              md:px-[64px]

              lg:min-h-[137px]
              lg:px-[76px]

              xl:px-[108px]
            "
          >
            {/* ================================================
                CONTENT
            ================================================= */}
            <div
              className="
                font-[var(--font-sf-pro)]
              "
            >
              <h3
                className="
                  text-[27px]
                  font-[650]
                  leading-[1]
                  tracking-[0.2px]
                  text-white

                  lg:text-[28px]
                "
              >
                {item.title}
              </h3>

              <p
                className="
                  mt-[14px]

                  text-[21px]
                  font-[400]
                  leading-[1]
                  tracking-[0.3px]
                  text-white/65

                  lg:text-[22px]
                "
              >
                {item.subtitle}
              </p>
            </div>

            {/* ================================================
                VERTICAL DIVIDER
            ================================================= */}
            {index !== values.length - 1 && (
              <div
                className="
                  absolute
                  right-0
                  top-1/2
                  hidden
                  h-[69px]
                  w-px
                  -translate-y-1/2
                  bg-white/45

                  lg:block
                "
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}