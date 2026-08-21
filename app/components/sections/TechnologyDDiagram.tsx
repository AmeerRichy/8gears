"use client";

import Image from "next/image";

export default function TechnologyDDiagram() {
  return (
    <section
      className="
        w-full
        overflow-hidden
        bg-white
        py-[50px]

        sm:py-[65px]

        lg:py-[80px]
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1500px]
          items-center
          justify-center
          px-[20px]

          sm:px-[35px]

          lg:px-[60px]
        "
      >
        <div
          className="
            relative
            w-full
            max-w-[1100px]
          "
        >
          <Image
            src="/assets/images/tkdiagram.png"
            alt="8 Gear motorcycle jeans protection technology diagram"
            width={1600}
            height={900}
            priority
            className="
              h-auto
              w-full
              object-contain
            "
          />
        </div>
      </div>
    </section>
  );
}