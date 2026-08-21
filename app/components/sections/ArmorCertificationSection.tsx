"use client";

import Image from "next/image";

export default function ArmorCertificationSection() {
  return (
    <section
      className="
        w-full
        overflow-hidden
        bg-white
        py-[40px]

        sm:py-[55px]

        lg:py-[70px]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1800px]
          px-0

          sm:px-[0px]

          lg:px-[0px]
        "
      >
        <div className="relative w-full">
          <Image
            src="/assets/images/armor-certification-full.png"
            alt="8 Gear protective hoodie certification and armor feature overview"
            width={1800}
            height={666}
            className="
              h-auto
              w-full
              object-contain
            "
            priority
          />
        </div>
      </div>
    </section>
  );
}