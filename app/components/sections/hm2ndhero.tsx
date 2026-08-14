"use client";

import Image from "next/image";

const ProductFeatureBanner = () => {
  return (
    <section className="w-full bg-[#f4efe7]">
      <div className="mx-auto w-full max-w-[1920px]">
        <Image
          src="/assets/images/2ndechero.png"
          alt="Built to move. Made to protect."
          width={1920}
          height={1008}
          priority={false}
          className="h-auto w-full object-cover"
        />
      </div>
    </section>
  );
};

export default ProductFeatureBanner;