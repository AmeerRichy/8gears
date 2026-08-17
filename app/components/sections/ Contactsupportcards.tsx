"use client";

import React from "react";
import { Headphones, Package, Handshake } from "lucide-react";

const contactFeatures = [
  {
    icon: Headphones,
    title: "Expert Support",
    description: (
      <>
        Get help from our team of gear enthusiasts
        <br className="hidden xl:block" />
        who understand your needs.
      </>
    ),
  },
  {
    icon: Package,
    title: "Order Assistance",
    description: (
      <>
        Need help with sizing, shipping, or returns?
        <br className="hidden xl:block" />
        We&apos;ve got you covered.
      </>
    ),
  },
  {
    icon: Handshake,
    title: "Partnerships",
    description: (
      <>
        Interested in wholesale, collaborations,
        <br className="hidden xl:block" />
        or media inquiries?{" "}
        <span className="font-semibold text-black">
          Let&apos;s connect.
        </span>
      </>
    ),
  },
];

export default function ContactSupportCards() {
  return (
    <section className="w-full bg-white py-[55px] md:py-[65px] lg:py-[72px]">
      <div className="mx-auto w-full max-w-[1800px] px-[24px] sm:px-[40px] lg:px-[72px]">
        <div className="grid grid-cols-1 gap-[16px] lg:grid-cols-3">
          {contactFeatures.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  flex
                  min-h-[150px]
                  items-center
                  rounded-[20px]
                  bg-[#F7F7F7]
                  px-[22px]
                  py-[24px]

                  sm:px-[26px]
                  lg:min-h-[155px]
                  xl:px-[28px]
                "
              >
                {/* Icon */}
                <div
                  className="
                    flex
                    h-[64px]
                    w-[64px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[13px]
                    bg-[#EEEEEE]

                    xl:h-[68px]
                    xl:w-[68px]
                  "
                >
                  <Icon
                    size={32}
                    strokeWidth={2.1}
                    className="text-black"
                  />
                </div>

                {/* Text */}
                <div className="ml-[18px] min-w-0 xl:ml-[20px]">
                  <h3
                    className="
                      font-[var(--font-sf-pro)]
                      text-[20px]
                      font-semibold
                      leading-[1.15]
                      tracking-[-0.3px]
                      text-black

                      xl:text-[22px]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-[12px]
                      font-[var(--font-sf-pro)]
                      text-[14px]
                      font-normal
                      leading-[1.5]
                      text-[#7D7D7D]

                      xl:text-[15px]
                    "
                  >
                    {item.description}
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