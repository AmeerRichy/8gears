"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

const exploreLinks = [
  { name: "Collection", href: "/category?cat=all" },
  { name: "Technology", href: "/technology" },
  { name: "Sustainability", href: "/sustainability" },
];

const supportLinks = [
  { name: "Terms & Conditions", href: "/tncs" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "About 8Gear", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Return Policy", href: "/return-policy" },
  { name: "Shopping Policy", href: "/shopping-policy" },
  { name: "Warranty", href: "/warranty" },
];

const otherLinks = [
  { name: "Dealers", href: "/dealers" },
  { name: "Journal", href: "/blog" },
  { name: "Catalog", href: "/category?cat=all" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: Facebook,
  },
  {
    name: "Instagram",
    href: "#",
    icon: Instagram,
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: Linkedin,
  },
  {
    name: "YouTube",
    href: "#",
    icon: Youtube,
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#f4f2ef]">
      <div className="mx-auto w-full max-w-[1920px] px-[24px] py-[60px] sm:px-[40px] sm:py-[70px] lg:px-[60px] xl:px-[100px] 2xl:px-[135px] 2xl:py-[82px]">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-x-[40px] gap-y-[50px] sm:grid-cols-2 lg:grid-cols-[1.45fr_0.8fr_1.15fr_0.7fr] xl:grid-cols-[1.55fr_0.8fr_1.15fr_0.72fr_1.05fr] xl:gap-x-[55px] 2xl:gap-x-[80px]">

          {/* BRAND */}
          <div className="sm:col-span-2 lg:col-span-4 xl:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="8Gear Home"
            >
              <img
                src="/logo.png"
                alt="8Gear"
                draggable={false}
                className="block h-auto w-[135px] object-contain sm:w-[145px] lg:w-[150px]"
              />
            </Link>

            <p className="mt-[42px] max-w-[340px] font-[var(--font-sf-pro)] text-[16px] font-normal leading-[1.45] tracking-[0.1px] text-[#66615d] sm:text-[17px] lg:text-[18px] 2xl:text-[20px]">
              Elevate Every Ride with Premium Performance Gear Designed for
              Protection, Comfort, and Unmatched Confidence.
            </p>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="font-[var(--font-sf-pro)] text-[18px] font-semibold leading-none text-black lg:text-[19px] 2xl:text-[20px]">
              Explore
            </h3>

            <div className="mt-[34px] flex flex-col gap-[20px] 2xl:mt-[40px] 2xl:gap-[23px]">
              {exploreLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="w-fit font-[var(--font-sf-pro)] text-[16px] font-normal leading-[1.15] text-[#68635f] transition-colors duration-200 hover:text-black sm:text-[17px] 2xl:text-[19px]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="font-[var(--font-sf-pro)] text-[18px] font-semibold leading-none text-black lg:text-[19px] 2xl:text-[20px]">
              Support
            </h3>

            <div className="mt-[34px] flex flex-col gap-[20px] 2xl:mt-[40px] 2xl:gap-[23px]">
              {supportLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="w-fit font-[var(--font-sf-pro)] text-[16px] font-normal leading-[1.15] text-[#68635f] transition-colors duration-200 hover:text-black sm:text-[17px] 2xl:text-[19px]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* OTHERS */}
          <div>
            <h3 className="font-[var(--font-sf-pro)] text-[18px] font-semibold leading-none text-black lg:text-[19px] 2xl:text-[20px]">
              Others
            </h3>

            <div className="mt-[34px] flex flex-col gap-[20px] 2xl:mt-[40px] 2xl:gap-[23px]">
              {otherLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="w-fit font-[var(--font-sf-pro)] text-[16px] font-normal leading-[1.15] text-[#68635f] transition-colors duration-200 hover:text-black sm:text-[17px] 2xl:text-[19px]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CONNECT */}
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <h3 className="font-[var(--font-sf-pro)] text-[18px] font-semibold leading-none text-black lg:text-[19px] 2xl:text-[20px]">
              Connect
            </h3>

            <div className="mt-[32px] flex flex-wrap items-center gap-[14px] xl:flex-nowrap 2xl:mt-[38px] 2xl:gap-[16px]">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-label={item.name}
                    className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-[#c8c4bf] text-[#77716d] transition-all duration-300 hover:border-black hover:bg-black hover:text-white 2xl:h-[48px] 2xl:w-[48px]"
                  >
                    <Icon
                      size={21}
                      strokeWidth={1.8}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}