"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const features = [
  {
    title: "Quality",
    subtitle: "CE Class AA – EN 17092-3:2020",
    description: (
      <>
        Regular Straight Fit with 6-Belt Loop Design for stability.
        <br className="hidden sm:block" />
        YKK® zippered fly on Brushed metal button closure
      </>
    ),
    image: "/assets/images/tkq.png",
    imageClass:
      "w-[250px] sm:w-[290px] lg:w-[330px] xl:w-[360px]",
    initialX: -110,
    initialY: 0,
    rotate: -1.5,
  },

  {
    title: "Safety",
    subtitle: "Level 2 Protectors – CE",
    description: (
      <>
        Impact protection designed for urban and high-speed
        <br className="hidden sm:block" />
        road riding with removable Level 2 Armors CE Certified
      </>
    ),
    image: "/assets/images/tks.png",
    imageClass:
      "w-[250px] sm:w-[300px] lg:w-[330px] xl:w-[350px]",
    initialX: 110,
    initialY: 0,
    rotate: 1.5,
  },

  {
    title: "Material",
    subtitle: "Kevlar® Reinforced Lining",
    description: (
      <>
        Super Stretch Denim for enhanced mobility. Highly
        <br className="hidden sm:block" />
        breathable construction. Moisture-wicking liner
      </>
    ),
    image: "/assets/images/tkm.png",
    imageClass:
      "w-[160px] sm:w-[190px] lg:w-[205px] xl:w-[220px]",
    initialX: 0,
    initialY: 100,
    rotate: -1,
  },

  {
    title: "Construction",
    subtitle: "Flat riveted reinforcement seam",
    description: (
      <>
        Hidden hip armor and knee armor pockets, with Triple-line
        <br className="hidden sm:block" />
        stitched seams and Flat riveted seam reinforcement
      </>
    ),
    image: "/assets/images/tkc.png",
    imageClass:
      "w-[260px] sm:w-[310px] lg:w-[340px] xl:w-[370px]",
    initialX: 0,
    initialY: -100,
    rotate: 1,
  },
];

export default function TechnologyKFeatures() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white
        py-[60px]
        sm:py-[75px]
        lg:py-[90px]
      "
    >
      {/* Heading */}
      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 30,
                filter: "blur(8px)",
              }
        }
        whileInView={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        viewport={{
          once: true,
          amount: 0.4,
        }}
        transition={{
          duration: 0.8,
          ease: EASE,
        }}
        className="
          relative
          z-30
          mx-auto
          w-full
          max-w-[1200px]
          px-[24px]
          text-center
          sm:px-[40px]
        "
      >
        <h2
          className="
            font-[var(--font-sf-pro)]
            text-[34px]
            font-normal
            leading-[1.15]
            tracking-[-1px]
            text-black
            sm:text-[42px]
            md:text-[48px]
            lg:text-[52px]
            lg:tracking-[-1.5px]
          "
        >
          8 Gear Urban Denim Motorcycle Jeans
        </h2>

        <p
          className="
            mx-auto
            mt-[18px]
            max-w-[1000px]
            font-[var(--font-sf-pro)]
            text-[15px]
            font-normal
            leading-[1.5]
            tracking-[0.1px]
            text-black
            sm:text-[16px]
            lg:mt-[20px]
            lg:text-[18px]
          "
        >
          The 8 Gear Protective Motorcycle Jeans feature Kevlar® reinforcement,
          abrasion-resistant construction, and armor-ready protection for
          certified rider safety. Built for durability, flexibility, and
          all-day comfort, they offer the perfect balance of protection and
          classic denim style.
        </p>
      </motion.div>

      {/* Grid */}
      <div
        className="
          relative
          mx-auto
          mt-[70px]
          w-full
          px-[16px]
          sm:px-[24px]
          lg:mt-[90px]
          lg:px-[38px]
        "
      >
        <div
          className="
            relative
            grid
            grid-cols-1
            gap-[8px]
            md:grid-cols-2
          "
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type FeatureCardProps = {
  title: string;
  subtitle: string;
  description: ReactNode;
  image: string;
  imageClass: string;
  initialX: number;
  initialY: number;
  rotate: number;
  index: number;
};

function FeatureCard({
  title,
  subtitle,
  description,
  image,
  imageClass,
  initialX,
  initialY,
  rotate,
  index,
}: FeatureCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const cardZIndex = index < 2 ? 20 : 10;

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              x: initialX,
              y: initialY,
              scale: 0.965,
              rotate,
              filter: "blur(9px)",
            }
      }
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        amount: 0.2,
        margin: "0px 0px -50px 0px",
      }}
      transition={{
        duration: 0.9,
        delay: index * 0.07,
        ease: EASE,
      }}
      style={{
        zIndex: cardZIndex,
      }}
      className="
        relative
        flex
        min-h-[430px]
        w-full
        flex-col
        items-center
        overflow-hidden
        bg-[#F2F2F4]
        px-[20px]
        pt-[28px]
        text-center
        will-change-transform

        sm:min-h-[470px]
        sm:px-[30px]
        sm:pt-[32px]

        lg:min-h-[455px]
        lg:px-[40px]
        lg:pt-[30px]

        xl:min-h-[470px]
      "
    >
      {/* Text */}
      <div className="relative z-30">
        <h3
          className="
            font-[var(--font-sf-pro)]
            text-[24px]
            font-semibold
            leading-[1.15]
            tracking-[-0.4px]
            text-black
            sm:text-[26px]
            lg:text-[28px]
          "
        >
          {title}
        </h3>

        <h4
          className="
            mt-[10px]
            font-[var(--font-sf-pro)]
            text-[17px]
            font-semibold
            leading-[1.3]
            tracking-[0.1px]
            text-black
            sm:text-[18px]
            lg:text-[20px]
          "
        >
          {subtitle}
        </h4>

        <p
          className="
            mx-auto
            mt-[10px]
            max-w-[590px]
            font-[var(--font-sf-pro)]
            text-[14px]
            font-normal
            leading-[1.4]
            tracking-[0.5px]
            text-black/45
            sm:text-[15px]
            lg:text-[16px]
          "
        >
          {description}
        </p>
      </div>

      {/* Image */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          z-20
          flex
          -translate-x-1/2
          items-end
          justify-center
        "
      >
        <div className={`relative ${imageClass}`}>
          <Image
            src={image}
            alt={title}
            width={700}
            height={700}
            className="
              h-auto
              w-full
              object-contain
              object-bottom
            "
          />
        </div>
      </div>
    </motion.div>
  );
}