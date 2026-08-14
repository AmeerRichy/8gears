"use client";

import { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const categories = ["Denim", "Fleece", "Chino’s", "Cargo’s"];

export default function CafeRacer() {
  const router = useRouter();

  const sectionRef = useRef<HTMLElement | null>(null);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const banner = bannerRef.current;
    const content = contentRef.current;
    const overlay = overlayRef.current;

    if (!section || !banner || !content || !overlay) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1300",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(
            banner,
            {
              width: "100vw",
              height: "100vh",
              borderRadius: 0,
              ease: "none",
              duration: 1,
            },
            0
          )
          .to(
            overlay,
            {
              backgroundColor: "rgba(0, 0, 0, 0.48)",
              ease: "none",
              duration: 1,
            },
            0
          )
          .to(
            content,
            {
              x: 20,
              y: -15,
              ease: "none",
              duration: 1,
            },
            0
          )

          // Keeps the fullscreen state for a little bit
          // before ScrollTrigger releases the section.
          .to({}, { duration: 0.35 });

        return () => {
          timeline.kill();
        };
      });

      /*
       * Mobile:
       * Keep the same visual section without the heavy pin/expand
       * interaction.
       */
      mm.add("(max-width: 767px)", () => {
        gsap.set(banner, {
          clearProps: "all",
        });
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white"
    >
      {/* EXPANDING BANNER */}
      <div
        ref={bannerRef}
        className="relative h-[72vh] min-h-[620px] max-h-[900px] w-[calc(100vw-32px)] overflow-hidden rounded-[34px] sm:w-[calc(100vw-60px)] md:w-[calc(100vw-80px)] lg:w-[calc(100vw-140px)] lg:rounded-[58px]"
      >
        {/* Background */}
        <img
          src="/assets/images/cafe-racer-banner.png"
          alt="8Gears Cafe Racer collection"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Main dark overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black/40"
        />

        {/* Stronger left/bottom readability gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.56)_0%,rgba(0,0,0,0.25)_42%,rgba(0,0,0,0.06)_70%,rgba(0,0,0,0)_100%)]" />

        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* CONTENT */}
        <div
          ref={contentRef}
          className="absolute bottom-[56px] left-[28px] z-10 text-white sm:bottom-[62px] sm:left-[42px] lg:bottom-[70px] lg:left-[72px]"
        >
          {/* Title */}
          <h2 className="font-[var(--font-sf-pro)] text-[34px] font-medium leading-[1.05] tracking-[-1px] text-white sm:text-[40px] lg:text-[48px]">
            Cafe Racer&apos;s
          </h2>

          {/* Description */}
          <p className="mt-[18px] max-w-[740px] font-[var(--font-sf-pro)] text-[15px] font-normal leading-[1.4] text-white/95 sm:text-[17px] lg:text-[20px]">
            Ride in style with our latest Collection in Certified and sustainable
            Apparel
          </p>

          {/* Categories */}
          <div className="mt-[34px] flex max-w-[700px] flex-wrap items-center gap-x-[28px] gap-y-[16px] sm:gap-x-[34px] lg:gap-x-[38px]">
            {categories.map((category) => (
              <div
                key={category}
                className="flex items-center gap-[14px]"
              >
                <span className="h-[3px] w-[24px] rounded-full bg-[#a67547]" />

                <span className="font-[var(--font-sf-pro)] text-[17px] font-semibold text-white sm:text-[19px] lg:text-[21px]">
                  {category}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => router.push("/category?cat=all")}
            className="mt-[42px] flex h-[50px] w-[200px] items-center justify-center gap-[12px] rounded-full bg-white font-[var(--font-sf-pro)] text-[14px] font-medium text-black transition-all duration-300 hover:scale-[1.03] hover:bg-[#f1f1f1] active:scale-[0.98]"
          >
            Learn More
            <span className="text-[17px] leading-none">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}