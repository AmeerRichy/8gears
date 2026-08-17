"use client";

import { useEffect, useState } from "react";

const announcements = [
  "Explore our new AA fleece collection in uppers and bottoms",
  "The new chinos collection is now available in various colors",
  "You can now order our sustainable selvedge denim jeans online",
];

const messagePositions = [
  { x: 0, y: 0 },
  { x: -8, y: 1 },
  { x: 8, y: -1 },
];

const DISPLAY_TIME = 4000;
const FADE_TIME = 400;

export default function AnnouncementTicker() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsHidden(window.scrollY > 24);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  useEffect(() => {
    let fadeTimeout: number | undefined;

    const interval = window.setInterval(() => {
      setIsVisible(false);

      fadeTimeout = window.setTimeout(() => {
        setActiveIndex((current) => (current + 1) % announcements.length);
        setIsVisible(true);
      }, FADE_TIME);
    }, DISPLAY_TIME);

    return () => {
      window.clearInterval(interval);
      if (fadeTimeout) window.clearTimeout(fadeTimeout);
    };
  }, []);

  const position = messagePositions[activeIndex % messagePositions.length];

  return (
    <aside
      aria-label="Store announcements"
      className={`announcement-ticker fixed inset-x-0 top-0 z-[110] flex h-[52px] items-center justify-center bg-white px-4 transition-all duration-300 ease-out sm:h-[60px] sm:px-6 ${
        isHidden
          ? "announcement-ticker--hidden pointer-events-none -translate-y-full opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div className="relative flex h-8 w-full max-w-[680px] items-center justify-center overflow-hidden rounded-full border border-black/[0.035] bg-[#eeeeee] px-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:h-10 sm:max-w-[880px] sm:px-14 lg:max-w-[1040px]">
        <div
          aria-hidden="true"
          className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 sm:left-5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-black/70" />
          <span className="h-1 w-1 rounded-full bg-black/20" />
        </div>

        <p
          aria-live="polite"
          className="absolute inset-x-10 text-center text-[10px] font-medium leading-tight tracking-[0.025em] text-[#292929] transition-[opacity,transform] duration-[400ms] ease-out sm:inset-x-14 sm:text-xs lg:text-[13px]"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translate3d(${position.x}px, ${
              position.y + (isVisible ? 0 : 4)
            }px, 0) scale(${isVisible ? 1 : 0.99})`,
          }}
        >
          {announcements[activeIndex]}
        </p>

        <div
          aria-hidden="true"
          className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 sm:right-5"
        >
          <span className="h-1 w-1 rounded-full bg-black/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-black/70" />
        </div>
      </div>
    </aside>
  );
}
