"use client";

import { useRouter } from "next/navigation";

const features = [
  "AAA Certified Single layer ( Made with dyneema )",
  "AA Certified with Kevlar Lining",
  "AA Certified selvedge jeans with Kevlar Lining",
];

const DenimFeature = () => {
  const router = useRouter();

  return (
    <section className="w-full bg-white">
      <div className="mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-[40px] px-[24px] py-[70px] sm:px-[40px] lg:grid-cols-2 lg:items-stretch lg:gap-[76px] lg:px-[70px] lg:py-[110px] xl:px-[72px]">
        {/* LEFT COLUMN */}
        <div className="flex min-w-0 flex-col">
          {/* CONTENT */}
          <div>
            <h2 className="font-[var(--font-sf-pro)] text-[36px] font-medium leading-[1.08] tracking-[-1.2px] text-black sm:text-[42px] lg:text-[48px]">
              Denim Engineered for Every Ride
            </h2>

            <div className="mt-[30px] flex flex-col gap-[13px]">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-[18px]"
                >
                  <span className="mt-[15px] h-[2px] w-[22px] shrink-0 bg-[#aa7447]" />

                  <p className="font-[var(--font-sf-pro)] text-[18px] font-semibold leading-[1.3] text-[#1c1c1c] sm:text-[20px] lg:text-[24px]">
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/category?cat=all")}
              className="mt-[34px] flex h-[50px] w-[200px] items-center justify-center gap-[10px] rounded-full bg-black font-[var(--font-sf-pro)] text-[14px] font-medium text-white transition-colors duration-300 hover:bg-[#222]"
            >
              Learn More
              <span className="text-[17px] leading-none">→</span>
            </button>
          </div>

          {/* FIXED GAP BETWEEN CONTENT + IMAGE */}
          <div className="h-[54px] shrink-0 lg:h-[64px]" />

          {/* LEFT IMAGE */}
          <div className="mt-auto w-full overflow-hidden rounded-[44px]">
            <div className="aspect-[850/793] w-full">
              <img
                src="/assets/images/denim-feature-left.png"
                alt="8Gears rider wearing protective apparel"
                draggable={false}
                className="block h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="min-w-0 lg:h-full">
          <div className="h-full min-h-[700px] w-full overflow-hidden rounded-[44px]">
            <img
              src="/assets/images/denim-feature-right.png"
              alt="8Gears water repellent protective hoodie"
              draggable={false}
              className="block h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DenimFeature;