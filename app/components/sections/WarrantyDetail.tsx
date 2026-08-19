"use client";

import { useState } from "react";
import {
  Shield,
  Check,
  X,
  Info,
  ChevronDown,
} from "lucide-react";

const coveredItems = [
  "Manufacturing defects in materials and workmanship",
  "Structural failures in helmet shell or liner",
  "Zipper, buckle, and hardware failure (not caused by misuse)",
  "Seam separation and stitching failure",
  "Delamination of protective layers",
  "Defective visor mechanisms",
];

const notCoveredItems = [
  "Normal wear and tear",
  "Damage caused by accidents, impacts, or crashes",
  "Damage caused by misuse, modification, or improper care",
  "Cosmetic damage (scratches, fading) from normal use",
  "Damage from improper storage or cleaning",
  "Products purchased from unauthorised sellers",
];

const claimSteps = [
  {
    number: "01",
    title: "Document the issue",
    content:
      "Take clear photos of the defect from multiple angles.",
  },
  {
    number: "02",
    title: "Contact us",
    content: (
      <>
        Email{" "}
        <a
          href="mailto:info@8-gear.com"
          className="font-semibold text-black transition-opacity hover:opacity-60"
        >
          info@8-gear.com
        </a>{" "}
        with your order number, photos, and a description of the issue.
      </>
    ),
  },
  {
    number: "03",
    title: "Ship the item",
    content:
      "We'll provide a prepaid return label (domestic orders). International customers may need to cover return shipping.",
  },
  {
    number: "04",
    title: "Resolution",
    content:
      "We'll repair, replace, or issue a refund within 10 business days of receiving the item.",
  },
];

const faqItems = [
  {
    question: "My Jacket was in an accident. Is it covered?",
    answer:
      "No. Any Jacket involved in an impact — even a minor drop — must be replaced. Impact damage may not be visible but compromises structural integrity. We offer a 30% accident replacement discount. Contact us at: info@8-gear.com.",
  },
  {
    question: "My jacket zipper broke after 3 months. What do I do?",
    answer:
      "Please email us at info@8-gear.com with your order number, photos, and a short explanation. If the issue is due to a manufacturing defect, we will review it under warranty.",
  },
  {
    question: "Can I get my gear repaired instead of replaced?",
    answer:
      "Yes, depending on the issue. If the defect is repairable, we may offer a repair instead of a replacement. Our team will assess the product after review.",
  },
  {
    question: "My gloves faded after 6 months. Is this covered?",
    answer:
      "Usually not. Cosmetic wear such as fading, scratches, and normal wear and tear are not covered under warranty.",
  },
  {
    question: "I bought 8Gear from a dealer. Does warranty still apply?",
    answer:
      "Yes, as long as the dealer is an authorised seller and you can provide valid proof of purchase.",
  },
];

export default function WarrantyDetail() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="w-full bg-white">
      <div
        className="
          mx-auto
          w-full
          max-w-[1400px]
          px-[24px]
          pb-[90px]
          pt-[70px]

          sm:px-[40px]
          sm:pt-[80px]

          lg:px-[115px]
          lg:pb-[110px]
          lg:pt-[95px]

          xl:px-[120px]
        "
      >
        {/* TOP WARRANTY CARD */}
        <section className="pb-[44px] sm:pb-[50px] lg:pb-[56px]">
          <div
            className="
              flex
              min-h-[128px]
              flex-col
              items-center
              justify-center
              rounded-[18px]
              bg-[#F2F2F2]
              px-[20px]
              py-[24px]

              sm:min-h-[140px]

              lg:min-h-[150px]
            "
          >
            <Shield size={26} strokeWidth={2} className="text-black" />

            <h2
              className="
                mt-[10px]
                font-[var(--font-sf-pro)]
                text-[28px]
                font-bold
                leading-none
                tracking-[-0.6px]
                text-black

                lg:text-[32px]
              "
            >
              1 YEAR
            </h2>

            <p
              className="
                mt-[10px]
                font-[var(--font-sf-pro)]
                text-[12px]
                text-black/45

                lg:text-[13px]
              "
            >
              Warranty of Each Products
            </p>
          </div>
        </section>

        {/* WARRANTY COVERAGE */}
        <section
          className="
            grid
            grid-cols-1
            gap-[42px]
            border-b
            border-black/[0.08]
            py-[42px]

            sm:py-[48px]

            md:grid-cols-2
            md:gap-[48px]

            lg:gap-[80px]
            lg:py-[50px]
          "
        >
          <PolicyColumn title="What's Not Covered">
            {notCoveredItems.map((item) => (
              <PolicyListItem
                key={item}
                icon={
                  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#FF4B4B]">
                    <X size={14} strokeWidth={2.8} className="text-white" />
                  </span>
                }
              >
                {item}
              </PolicyListItem>
            ))}
          </PolicyColumn>

          <PolicyColumn title="What's Covered">
            {coveredItems.map((item) => (
              <PolicyListItem
                key={item}
                icon={
                  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-black">
                    <Check
                      size={14}
                      strokeWidth={2.8}
                      className="text-white"
                    />
                  </span>
                }
              >
                {item}
              </PolicyListItem>
            ))}
          </PolicyColumn>
        </section>

        {/* HOW TO MAKE A WARRANTY CLAIM */}
        <section
          className="
            border-b
            border-black/[0.08]
            py-[42px]

            sm:py-[48px]

            lg:py-[50px]
          "
        >
          <h2
            className="
              font-[var(--font-sf-pro)]
              text-[25px]
              font-semibold
              leading-tight
              tracking-[-0.5px]
              text-black

              sm:text-[27px]

              lg:text-[29px]
            "
          >
            How to Make a Warranty Claim
          </h2>

          <div
            className="
              mt-[30px]
              grid
              grid-cols-1
              gap-[18px]

              md:grid-cols-2

              lg:mt-[34px]
              lg:gap-x-[36px]
              lg:gap-y-[36px]
            "
          >
            {claimSteps.map((step) => (
              <ClaimStepCard key={step.number} {...step} />
            ))}
          </div>
        </section>

        {/* ACCIDENT REPLACEMENT PROGRAMME */}
        <section
          className="
            border-b
            border-black/[0.08]
            py-[42px]

            sm:py-[48px]

            lg:py-[50px]
          "
        >
          <h2
            className="
              font-[var(--font-sf-pro)]
              text-[25px]
              font-semibold
              leading-tight
              tracking-[-0.5px]
              text-black

              sm:text-[27px]

              lg:text-[29px]
            "
          >
            Accident Replacement Programme
          </h2>

          <div
            className="
              mt-[22px]
              flex
              items-start
              gap-[14px]
              rounded-[16px]
              bg-[#EEF5FF]
              px-[18px]
              py-[20px]

              sm:px-[22px]

              lg:mt-[24px]
              lg:px-[24px]
              lg:py-[22px]
            "
          >
            <Info
              size={21}
              strokeWidth={2}
              className="mt-[2px] shrink-0 text-[#0A84FF]"
            />

            <div>
              <p
                className="
                  font-[var(--font-sf-pro)]
                  text-[16px]
                  font-semibold
                  text-black

                  lg:text-[17px]
                "
              >
                Helmet involved in a crash?
              </p>

              <p
                className="
                  mt-[10px]
                  font-[var(--font-sf-pro)]
                  text-[15px]
                  leading-[1.7]
                  text-black/55

                  sm:text-[16px]

                  lg:text-[17px]
                "
              >
                We offer a 30% discount on a replacement helmet for any rider
                who has been in an accident — whether or not the helmet shows
                visible damage. Proof of incident required.
                <br />
                Email:{" "}
                <a
                  href="mailto:info@8-gear.com"
                  className="font-semibold text-black transition-opacity hover:opacity-60"
                >
                  info@8-gear.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="
            border-b
            border-black/[0.08]
            py-[42px]

            sm:py-[48px]

            lg:py-[50px]
          "
        >
          <h2
            className="
              font-[var(--font-sf-pro)]
              text-[25px]
              font-semibold
              leading-tight
              tracking-[-0.5px]
              text-black

              sm:text-[27px]

              lg:text-[29px]
            "
          >
            Frequently Asked Questions
          </h2>

          <div
            className="
              mx-auto
              mt-[55px]
              flex
              w-full
              max-w-[900px]
              flex-col
              gap-[16px]

              sm:mt-[65px]

              lg:mt-[70px]
              lg:gap-[18px]
            "
          >
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={item.question}
                  className={`
                    overflow-hidden
                    rounded-[14px]
                    border
                    transition-all
                    duration-300
                    ease-out

                    ${
                      isOpen
                        ? "border-[#E2E2E2] bg-white"
                        : "border-transparent bg-[#F2F2F2]"
                    }
                  `}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    className={`
                      flex
                      min-h-[68px]
                      w-full
                      items-center
                      justify-between
                      gap-[20px]
                      px-[20px]
                      py-[18px]
                      text-left

                      transition-colors
                      duration-300

                      sm:min-h-[72px]
                      sm:px-[28px]

                      lg:min-h-[78px]
                      lg:px-[34px]

                      ${
                        isOpen
                          ? "bg-[#F2F2F2]"
                          : "bg-[#F2F2F2] hover:bg-[#ECECEC]"
                      }
                    `}
                  >
                    <span
                      className="
                        pr-[10px]
                        font-[var(--font-sf-pro)]
                        text-[15px]
                        font-semibold
                        leading-[1.35]
                        text-black

                        sm:text-[16px]

                        lg:text-[17px]
                      "
                    >
                      {item.question}
                    </span>

                    <ChevronDown
                      size={22}
                      strokeWidth={1.8}
                      className={`
                        shrink-0
                        text-black
                        transition-transform
                        duration-300
                        ease-out
                        ${isOpen ? "rotate-180" : "rotate-0"}
                      `}
                    />
                  </button>

                  <div
                    className={`
                      grid
                      transition-[grid-template-rows,opacity]
                      duration-[350ms]
                      ease-out

                      ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }
                    `}
                  >
                    <div className="overflow-hidden">
                      <div
                      className="
                        bg-white
                        px-[20px]
                        py-[20px]

                        sm:px-[28px]
                        sm:py-[22px]

                        lg:px-[34px]
                        lg:py-[24px]
                      "
                      >
                        <p
                          className="
                            max-w-[820px]
                            font-[var(--font-sf-pro)]
                            text-[14px]
                            font-medium
                            leading-[1.55]
                            text-[#202020]

                            sm:text-[15px]

                            lg:text-[16px]
                          "
                        >
                          {item.answer.includes("info@8-gear.com") ? (
                            <>
                              {item.answer.split("info@8-gear.com")[0]}
                              <a
                                href="mailto:info@8-gear.com"
                                className="font-semibold text-black transition-opacity hover:opacity-60"
                              >
                                info@8-gear.com
                              </a>
                              {item.answer.split("info@8-gear.com")[1]}
                            </>
                          ) : (
                            item.answer
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CONTACT */}
        <section className="pt-[42px] sm:pt-[48px] lg:pt-[50px]">
          <h2
            className="
              font-[var(--font-sf-pro)]
              text-[25px]
              font-semibold
              tracking-[-0.5px]
              text-black

              sm:text-[27px]

              lg:text-[29px]
            "
          >
            Contact
          </h2>

          <div
            className="
              mt-[20px]
              space-y-[18px]
              font-[var(--font-sf-pro)]
            "
          >
            <a
              href="mailto:info@8-gear.com"
              className="
                inline-block
                text-[15px]
                font-semibold
                text-black
                transition-opacity
                hover:opacity-60

                sm:text-[16px]

                lg:text-[17px]
              "
            >
              info@8-gear.com
            </a>

            <p
              className="
                text-[15px]
                leading-[1.7]
                text-black/50

                sm:text-[16px]

                lg:text-[17px]
              "
            >
              Response within 1–2 business days.
            </p>

            <p
              className="
                text-[15px]
                leading-[1.7]
                text-black/50

                sm:text-[16px]

                lg:text-[17px]
              "
            >
              <span className="font-semibold text-black">8Gear Inc.</span>,
              Toronto, Ontario, Canada
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}

type PolicyColumnProps = {
  title: string;
  children: React.ReactNode;
};

function PolicyColumn({ title, children }: PolicyColumnProps) {
  return (
    <div>
      <h2
        className="
          font-[var(--font-sf-pro)]
          text-[25px]
          font-semibold
          leading-tight
          tracking-[-0.5px]
          text-black

          sm:text-[27px]

          lg:text-[29px]
        "
      >
        {title}
      </h2>

      <div className="mt-[28px] space-y-[18px] lg:mt-[30px]">{children}</div>
    </div>
  );
}

type PolicyListItemProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
};

function PolicyListItem({
  icon,
  children,
}: PolicyListItemProps) {
  return (
    <div className="flex items-start gap-[12px]">
      <div className="mt-[1px] shrink-0">{icon}</div>

      <p
        className="
          font-[var(--font-sf-pro)]
          text-[15px]
          leading-[1.65]
          text-black/50

          sm:text-[16px]

          lg:text-[17px]
        "
      >
        {children}
      </p>
    </div>
  );
}

type ClaimStepCardProps = {
  number: string;
  title: string;
  content: React.ReactNode;
};

function ClaimStepCard({
  number,
  title,
  content,
}: ClaimStepCardProps) {
  return (
    <div
      className="
        flex
        min-h-[155px]
        rounded-[14px]
        bg-[#F2F2F2]
        px-[22px]
        py-[24px]

        sm:px-[26px]

        lg:min-h-[160px]
        lg:px-[28px]
        lg:py-[26px]
      "
    >
      <div
        className="
          shrink-0
          font-[var(--font-sf-pro)]
          text-[38px]
          font-normal
          leading-none
          tracking-[-1.5px]
          text-black/45

          sm:text-[42px]

          lg:text-[44px]
        "
      >
        {number}
      </div>

      <div className="ml-[20px] sm:ml-[24px]">
        <h3
          className="
            font-[var(--font-sf-pro)]
            text-[18px]
            font-semibold
            leading-tight
            text-black

            sm:text-[19px]

            lg:text-[20px]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-[12px]
            font-[var(--font-sf-pro)]
            text-[14px]
            leading-[1.7]
            text-black/50

            sm:text-[15px]

            lg:text-[16px]
          "
        >
          {content}
        </p>
      </div>
    </div>
  );
}
