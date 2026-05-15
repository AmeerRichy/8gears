"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  const menuItems = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/category?cat=all" },
    { name: "Sustainability", link: "/sustainability" },
    { name: "Policies", link: "/policies" },
    { name: "Order", link: "/orders/track" },
    { name: "Our Dealers", link: "/dealers" },
    { name: "Contact Us", link: "/contact" },
    { name: "News & Events", link: "/news-events" },
    { name: "Blog Posts", link: "/blog" },
  ];

  const socialItems = [
    {
      name: "Facebook",
      link: "#",
      icon: Facebook,
    },
    {
      name: "Instagram",
      link: "#",
      icon: Instagram,
    },
    {
      name: "LinkedIn",
      link: "#",
      icon: Linkedin,
    },
    {
      name: "YouTube",
      link: "#",
      icon: Youtube,
    },
  ];

  return (
    <footer className="w-full bg-[#ffffff]">
      <div className="mx-auto flex min-h-[264px] w-full max-w-[1920px] flex-col items-center justify-start px-6 pb-[28px] pt-[38px]">
        {/* Logo Text */}
        <Link
          href="/"
          className="mb-[35px] text-center text-[41px] font-bold leading-none tracking-[-0.035em] text-[#1c1c1c]"
        >
          8-Gear
        </Link>

        {/* Footer Menu */}
        <nav className="mb-[30px] flex flex-wrap items-center justify-center gap-x-[25px] gap-y-[12px]">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="whitespace-nowrap text-[16px] font-normal leading-none tracking-[0.01em] text-[#5d5d5d] transition-colors hover:text-black"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="mb-[22px] flex items-center justify-center gap-[21px]">
          {socialItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.link}
                aria-label={item.name}
                className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#cfcfcf] text-[#757575] transition-all hover:border-black hover:text-black"
              >
                <Icon size={18} strokeWidth={1.9} />
              </Link>
            );
          })}
        </div>

        {/* Cookie Text */}
        <button
          type="button"
          className="text-[13px] font-normal leading-none tracking-[0.02em] text-[#585858] transition-colors hover:text-black"
        >
          Manage Cookies
        </button>
      </div>
    </footer>
  );
}