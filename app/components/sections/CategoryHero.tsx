"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, RotateCcw, Shield, Truck } from "lucide-react";

const benefits = [
  {
    title: "Free Shipping",
    description: "On all orders over $200",
    icon: Truck,
  },
  {
    title: "Free Returns",
    description: "30-day hassle-free returns",
    icon: RotateCcw,
  },
  {
    title: "CE Certified Protection",
    description: "Every product safety tested",
    icon: Shield,
  },
  {
    title: "2-Year Warranty",
    description: "On all gear & apparel",
    icon: Award,
  },
];

export default function CategoryHero() {
  return (
    <section className="relative isolate mt-[80px] min-h-[620px] w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=90&w=2400&auto=format&fit=crop"
          alt="Motorcycle rider wearing protective riding gear"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 -z-10 bg-black/45" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/35 to-black/25" />

      <div className="absolute inset-x-0 bottom-0 -z-10 h-[190px] bg-gradient-to-t from-black/80 to-transparent" />

      {/* Hero Content */}
      <div className="mx-auto flex min-h-[620px] w-full max-w-[1920px] flex-col justify-center px-[24px] py-[56px] sm:px-[40px] lg:flex-row lg:items-center lg:justify-between lg:gap-[60px] lg:px-[70px] lg:py-[54px] xl:px-[72px]">
        {/* Left Content */}
        <div className="w-full max-w-[760px] text-white lg:flex-1">
          <h1 className="font-[var(--font-sf-pro)] text-[46px] font-bold leading-[1.02] tracking-[0.4px] text-white sm:text-[58px] lg:text-[70px] xl:text-[74px]">
            Ride Beyond Limits
          </h1>

          <p className="mt-[28px] max-w-[630px] font-[var(--font-sf-pro)] text-[22px] font-normal leading-[1.28] tracking-[0.2px] text-white sm:text-[27px] lg:text-[35px] lg:leading-[1.23]">
            Discover high-performance
            <br className="hidden sm:block" /> riding gear designed for speed,
            <br className="hidden sm:block" /> protection, and everyday
            <br className="hidden sm:block" /> adventure.
          </p>

          {/* CTA Buttons */}
          <div className="mt-[48px] flex w-full flex-col gap-[16px] sm:mt-[72px] sm:flex-row sm:gap-[38px] lg:mt-[78px]">
            <Link
              href="/category?cat=all"
              className="flex h-[62px] w-full items-center justify-center rounded-full border border-white/20 bg-[#8d898b] px-[34px] font-[var(--font-sf-pro)] text-[17px] font-semibold text-white transition-all duration-300 hover:bg-[#a09c9e] sm:h-[72px] sm:w-[260px] sm:text-[20px]"
            >
              Shop All Gear
            </Link>

            <Link
              href="#products"
              className="flex h-[62px] w-full items-center justify-center rounded-full border border-white/50 bg-black/30 px-[34px] font-[var(--font-sf-pro)] text-[17px] font-semibold text-white backdrop-blur-[7px] transition-all duration-300 hover:bg-black/55 sm:h-[72px] sm:w-[260px] sm:text-[20px]"
            >
              Explore
            </Link>
          </div>
        </div>

        {/* Right Benefits Panel */}
        <div className="mt-[44px] w-full rounded-[19px] border border-white/20 bg-black/50 px-[24px] py-[18px] text-white shadow-[0_20px_55px_rgba(0,0,0,0.30)] backdrop-blur-[15px] sm:px-[34px] sm:py-[20px] lg:mt-0 lg:w-[498px] lg:shrink-0">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className={`flex items-center gap-[22px] py-[18px] sm:py-[20px] ${
                  index !== benefits.length - 1
                    ? "border-b border-white/25"
                    : ""
                }`}
              >
                <div className="flex w-[34px] shrink-0 items-center justify-center">
                  <Icon
                    size={29}
                    strokeWidth={1.7}
                    className="text-white"
                  />
                </div>

                <div>
                  <h2 className="font-[var(--font-sf-pro)] text-[18px] font-semibold leading-tight text-white sm:text-[20px]">
                    {benefit.title}
                  </h2>

                  <p className="mt-[7px] font-[var(--font-sf-pro)] text-[14px] font-normal leading-tight text-white/90 sm:text-[16px]">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}