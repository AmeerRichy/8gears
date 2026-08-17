"use client";

import React from "react";
import {
  UsersRound,
  ClipboardList,
  Globe2,
} from "lucide-react";

const contactTeams = [
  {
    icon: UsersRound,
    title: "Sales & Marketing",
    email: "oq@8-gear.com",
    phone: "+1-416-272-2864",
  },
  {
    icon: ClipboardList,
    title: "Operations",
    email: "ma@8-gear.com",
    phone: "+92-300-8499729",
  },
  {
    icon: Globe2,
    title: "SCM",
    email: "info@8-gear.com",
    phone: "+1-416-272-2864",
  },
];

export default function ContactFormSection() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <section className="w-full overflow-hidden">
      <div className="grid w-full grid-cols-1 lg:grid-cols-2 lg:items-stretch">
        {/* =====================================================
            LEFT — CONTACT FORM
        ====================================================== */}
        <div className="bg-[#F4F4F4]">
          <div
            className="
              mx-auto
              w-full
              max-w-[920px]

              px-[24px]
              py-[60px]

              sm:px-[40px]
              sm:py-[72px]

              lg:px-[8%]
              lg:pb-[72px]
              lg:pt-[92px]

              xl:px-[12.6%]
            "
          >
            {/* Heading */}
            <div>
              <h2
                className="
                  font-[var(--font-sf-pro)]
                  text-[30px]
                  font-semibold
                  leading-[1.15]
                  tracking-[-0.8px]
                  text-black

                  sm:text-[34px]
                  lg:text-[38px]
                "
              >
                Get in Touch with Us
              </h2>

              <p
                className="
                  mt-[14px]
                  font-[var(--font-sf-pro)]
                  text-[17px]
                  font-normal
                  leading-[1.4]
                  text-[#838383]

                  sm:text-[19px]
                  lg:text-[21px]
                "
              >
                Connect for Inquiries, Support, and More
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-[48px] sm:mt-[54px] lg:mt-[56px]"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="
                    mb-[14px]
                    block
                    font-[var(--font-sf-pro)]
                    text-[15px]
                    font-medium
                    leading-none
                    text-black

                    lg:text-[17px]
                  "
                >
                  Full Name*
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Your Full Name"
                  className="
                    h-[60px]
                    w-full
                    rounded-[7px]
                    border
                    border-[#818181]
                    bg-transparent
                    px-[18px]

                    font-[var(--font-sf-pro)]
                    text-[15px]
                    font-normal
                    text-black

                    outline-none
                    transition-colors

                    placeholder:text-[#7D7D7D]
                    focus:border-black

                    sm:h-[64px]

                    lg:h-[66px]
                    lg:text-[16px]
                  "
                />
              </div>

              {/* Email */}
              <div className="mt-[27px]">
                <label
                  htmlFor="email"
                  className="
                    mb-[14px]
                    block
                    font-[var(--font-sf-pro)]
                    text-[15px]
                    font-medium
                    leading-none
                    text-black

                    lg:text-[17px]
                  "
                >
                  Email*
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  className="
                    h-[60px]
                    w-full
                    rounded-[7px]
                    border
                    border-[#818181]
                    bg-transparent
                    px-[18px]

                    font-[var(--font-sf-pro)]
                    text-[15px]
                    font-normal
                    text-black

                    outline-none
                    transition-colors

                    placeholder:text-[#7D7D7D]
                    focus:border-black

                    sm:h-[64px]

                    lg:h-[66px]
                    lg:text-[16px]
                  "
                />
              </div>

              {/* Subject */}
              <div className="mt-[27px]">
                <label
                  htmlFor="subject"
                  className="
                    mb-[14px]
                    block
                    font-[var(--font-sf-pro)]
                    text-[15px]
                    font-medium
                    leading-none
                    text-black

                    lg:text-[17px]
                  "
                >
                  Subject*
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="Enter Subject"
                  className="
                    h-[60px]
                    w-full
                    rounded-[7px]
                    border
                    border-[#818181]
                    bg-transparent
                    px-[18px]

                    font-[var(--font-sf-pro)]
                    text-[15px]
                    font-normal
                    text-black

                    outline-none
                    transition-colors

                    placeholder:text-[#7D7D7D]
                    focus:border-black

                    sm:h-[64px]

                    lg:h-[66px]
                    lg:text-[16px]
                  "
                />
              </div>

              {/* Message */}
              <div className="mt-[27px]">
                <label
                  htmlFor="message"
                  className="
                    mb-[14px]
                    block
                    font-[var(--font-sf-pro)]
                    text-[15px]
                    font-medium
                    leading-none
                    text-black

                    lg:text-[17px]
                  "
                >
                  Message*
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="What do you want to know about our dealers?"
                  className="
                    h-[130px]
                    w-full
                    resize-none
                    rounded-[7px]
                    border
                    border-[#818181]
                    bg-transparent

                    px-[18px]
                    py-[16px]

                    font-[var(--font-sf-pro)]
                    text-[15px]
                    font-normal
                    leading-[1.45]
                    text-black

                    outline-none
                    transition-colors

                    placeholder:text-[#7D7D7D]
                    focus:border-black

                    lg:h-[140px]
                    lg:text-[16px]
                  "
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="
                  mt-[46px]
                  flex
                  h-[60px]
                  w-full
                  items-center
                  justify-center

                  rounded-full
                  bg-black
                  px-[30px]

                  font-[var(--font-sf-pro)]
                  text-[15px]
                  font-semibold
                  text-white

                  transition-all
                  duration-300

                  hover:bg-[#202020]

                  sm:h-[64px]

                  lg:h-[66px]
                  lg:text-[16px]
                "
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>

        {/* =====================================================
            RIGHT — TEAM DETAILS
        ====================================================== */}
        <div className="flex bg-black">
          <div
            className="
              mx-auto
              flex
              w-full
              max-w-[920px]
              flex-col

              px-[24px]
              py-[60px]

              sm:px-[40px]
              sm:py-[72px]

              lg:px-[8%]
              lg:pb-[72px]
              lg:pt-[96px]

              xl:px-[12.2%]
            "
          >
            {/* Heading */}
            <h2
              className="
                max-w-[590px]
                font-[var(--font-sf-pro)]
                text-[30px]
                font-semibold
                leading-[1.18]
                tracking-[-0.7px]
                text-white

                sm:text-[34px]

                lg:text-[36px]
                lg:leading-[1.22]
              "
            >
              Or Get in Touch with Our Team
              <br className="hidden sm:block" />
              Directly
            </h2>

            {/* Cards */}
            <div
              className="
                mt-[50px]
                flex
                flex-col
                gap-[24px]

                sm:mt-[56px]
                sm:gap-[28px]

                lg:mt-[64px]
                lg:gap-[32px]
              "
            >
              {contactTeams.map((team) => {
                const Icon = team.icon;

                return (
                  <div
                    key={team.title}
                    className="
                      flex
                      w-full
                      items-center

                      rounded-[18px]
                      bg-[#1B1B1B]

                      px-[22px]
                      py-[24px]

                      sm:px-[28px]
                      sm:py-[25px]

                      lg:min-h-[172px]
                      lg:px-[32px]
                      lg:py-[26px]
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

                        rounded-[11px]
                        bg-[#383838]

                        sm:h-[68px]
                        sm:w-[68px]

                        lg:h-[72px]
                        lg:w-[72px]
                      "
                    >
                      <Icon
                        className="text-white"
                        size={35}
                        strokeWidth={2.5}
                      />
                    </div>

                    {/* Content */}
                    <div
                      className="
                        ml-[20px]
                        min-w-0

                        sm:ml-[26px]

                        lg:ml-[30px]
                      "
                    >
                      {/* Title */}
                      <h3
                        className="
                          font-[var(--font-sf-pro)]
                          text-[20px]
                          font-semibold
                          leading-[1.2]
                          tracking-[-0.2px]
                          text-white

                          sm:text-[22px]

                          lg:text-[24px]
                        "
                      >
                        {team.title}
                      </h3>

                      {/* Contact Label */}
                      <p
                        className="
                          mt-[13px]
                          font-[var(--font-sf-pro)]
                          text-[14px]
                          font-medium
                          leading-none
                          text-white

                          sm:text-[15px]

                          lg:mt-[15px]
                          lg:text-[16px]
                        "
                      >
                        Contact at:
                      </p>

                      {/* Email + Phone */}
                      <div
                        className="
                          mt-[12px]
                          flex
                          flex-col
                          gap-[8px]

                          font-[var(--font-sf-pro)]
                          text-[14px]
                          font-normal
                          leading-[1.1]
                          text-[#AAAAAA]

                          sm:text-[15px]

                          lg:text-[16px]
                        "
                      >
                        <a
                          href={`mailto:${team.email}`}
                          className="
                            w-fit
                            transition-colors
                            duration-200
                            hover:text-white
                          "
                        >
                          {team.email}
                        </a>

                        <a
                          href={`tel:${team.phone.replace(
                            /[^+\d]/g,
                            ""
                          )}`}
                          className="
                            w-fit
                            transition-colors
                            duration-200
                            hover:text-white
                          "
                        >
                          {team.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}