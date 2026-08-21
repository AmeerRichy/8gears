"use client";

import Image from "next/image";

export default function TechnologyWashCare() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#7f7f7f]

        min-h-[680px]

        sm:min-h-[720px]

        lg:min-h-0
        lg:aspect-[1820/828]
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}
      <Image
        src="/assets/images/technology-wash-care.png"
        alt="8 Gear motorcycle jeans wash and care"
        fill
        sizes="100vw"
        className="
          object-cover
          object-[68%_center]

          sm:object-[65%_center]

          lg:object-center
        "
      />

      {/* =====================================================
          OVERLAYS
      ====================================================== */}

      {/* Overall subtle darkening */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/10
        "
      />

      {/* Left readability gradient */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(90deg,rgba(0,0,0,0.30)_0%,rgba(0,0,0,0.18)_32%,rgba(0,0,0,0.04)_55%,rgba(0,0,0,0)_75%)]
        "
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          h-full
          min-h-[680px]
          w-full
          max-w-[1920px]
          items-center

          px-[24px]

          sm:min-h-[720px]
          sm:px-[40px]

          lg:min-h-0
          lg:px-[68px]

          xl:px-[72px]
        "
      >
        <div
          className="
            w-full
            max-w-[820px]
            text-white

            lg:max-w-[790px]
          "
        >
          {/* =================================================
              TITLE
          ================================================= */}
          <h2
            className="
              font-[var(--font-sf-pro)]
              text-[42px]
              font-normal
              leading-[1.12]
              tracking-[-1px]
              text-white

              sm:text-[52px]

              md:text-[58px]

              lg:text-[62px]
              lg:leading-[1.15]
              lg:tracking-[-1.5px]

              xl:text-[66px]
            "
          >
            How to wash
            <br />
            motorcycle jeans?
          </h2>

          {/* =================================================
              INTRO
          ================================================= */}
          <p
            className="
              mt-[44px]
              max-w-[720px]
              font-[var(--font-sf-pro)]
              text-[17px]
              font-normal
              leading-[1.35]
              text-white/95

              sm:text-[19px]

              lg:mt-[50px]
              lg:text-[21px]

              xl:text-[22px]
            "
          >
            Because our motorcycle jeans are not your average denim, the
            technical materials require specialized care instructions.
          </p>

          {/* =================================================
              CARE LIST
          ================================================= */}
          <ul
            className="
              mt-[30px]
              space-y-[5px]
              pl-[22px]
              font-[var(--font-sf-pro)]
              text-[16px]
              font-normal
              leading-[1.35]
              text-white/95

              sm:text-[18px]

              lg:mt-[32px]
              lg:text-[20px]

              xl:text-[21px]
            "
          >
            <li className="list-disc">
              Avoid bleach and harsh chemical cleaners.
            </li>

            <li className="list-disc">
              Always follow the washing and care label.
            </li>

            <li className="list-disc">
              Wash inside out only when needed to maintain color and durability.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}