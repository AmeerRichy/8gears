"use client";

import {
  RotateCcw,
  Package,
  CircleCheck,
  Check,
  X,
  Info,
} from "lucide-react";

const returnSteps = [
  {
    number: "01",
    title: "Contact Us",
    content: (
      <>
        Email:{" "}
        <a
          href="mailto:info@8-gear.com"
          className="font-semibold text-black transition-opacity hover:opacity-60"
        >
          info@8-gear.com
        </a>
        <br />
        within 30 days of delivery with your order number and reason for
        return.
      </>
    ),
  },
  {
    number: "02",
    title: "Get Approval",
    content:
      "We'll review and send a return authorisation (RA) number within 1–2 business days.",
  },
  {
    number: "03",
    title: "Ship It Back",
    content:
      "Pack the item securely in original packaging and ship to our returns centre using the provided label.",
  },
  {
    number: "04",
    title: "Refund Processed",
    content:
      "Once received and inspected, your refund is issued within 5–7 business days to the original payment method.",
  },
];

const eligibleItems = [
  "Items in unused, unworn condition",
  "Items in original packaging with all tags attached",
  "Items purchased within the last 30 days",
  "Defective or damaged items (contact us immediately)",
];

const notEligibleItems = [
  "Items that have been used, worn, or washed",
  "Items with removed or damaged tags",
  "Custom or personalised items",
  "Items purchased more than 30 days ago",
  "Clearance or final-sale items",
  "Helmets that have been in an accident",
];

export default function ReturnPolicyDetail() {
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
        {/* =====================================================
            TOP STATS
        ====================================================== */}
        <div
          className="
            grid
            grid-cols-1
            border-b
            border-black/[0.08]
            pb-[60px]

            sm:grid-cols-3

            lg:pb-[75px]
          "
        >
          <ReturnStat
            icon={<RotateCcw size={30} strokeWidth={2} />}
            value="30 DAYS"
            label="Return Window"
          />

          <ReturnStat
            icon={<Package size={30} strokeWidth={2} />}
            value="FREE"
            label="Return Shipping (CA)"
            bordered
          />

          <ReturnStat
            icon={<CircleCheck size={30} strokeWidth={2} />}
            value="5–7 DAYS"
            label="Refund Processing"
          />
        </div>

        {/* =====================================================
            HOW TO RETURN
        ====================================================== */}
        <section
          className="
            border-b
            border-black/[0.08]
            py-[42px]

            sm:py-[48px]

            lg:py-[54px]
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
            How to Return
          </h2>

          <div
            className="
              mt-[32px]
              grid
              grid-cols-1
              gap-[18px]

              md:grid-cols-2

              lg:mt-[38px]
              lg:gap-x-[36px]
              lg:gap-y-[38px]
            "
          >
            {returnSteps.map((step) => (
              <ReturnStepCard key={step.number} {...step} />
            ))}
          </div>
        </section>

        {/* =====================================================
            RETURN ELIGIBILITY
        ====================================================== */}
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
          <PolicyColumn title="Not Eligible for Return">
            {notEligibleItems.map((item) => (
              <PolicyListItem
                key={item}
                icon={
                  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#ff4048]">
                    <X size={14} strokeWidth={2.8} className="text-white" />
                  </span>
                }
              >
                {item}
              </PolicyListItem>
            ))}
          </PolicyColumn>

          <PolicyColumn title="Eligible for Return">
            {eligibleItems.map((item) => (
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

        {/* =====================================================
            EXCHANGES
        ====================================================== */}
        <PolicySection title="Exchanges">
          <p
            className="
              max-w-[1200px]
              font-[var(--font-sf-pro)]
              text-[15px]
              leading-[1.75]
              text-black/50

              sm:text-[16px]

              lg:text-[17px]
              lg:leading-[1.8]
            "
          >
            Want a different size or colour? We treat exchanges as a return +
            new order. Contact us at{" "}
            <a
              href="mailto:returns@8gear.com"
              className="transition-opacity hover:opacity-60"
            >
              returns@8gear.com
            </a>{" "}
            and we&apos;ll help you get the right product.
          </p>
        </PolicySection>

        {/* =====================================================
            INTERNATIONAL RETURNS
        ====================================================== */}
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
              tracking-[-0.5px]
              text-black

              sm:text-[27px]

              lg:text-[29px]
            "
          >
            International Returns
          </h2>

          <div
            className="
              mt-[22px]
              flex
              items-start
              gap-[14px]
              rounded-[14px]
              bg-[#FFF8E9]
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
              className="mt-[2px] shrink-0 text-[#ff8a00]"
            />

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
              International customers are responsible for return shipping
              costs. Please mark your shipment as &quot;Returned Goods&quot; to
              avoid customs duties. We recommend using a trackable shipping
              service.
            </p>
          </div>
        </section>

        {/* =====================================================
            CONTACT
        ====================================================== */}
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
          </div>
        </section>
      </div>
    </section>
  );
}

/* ============================================================
   TOP STAT
============================================================ */

type ReturnStatProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
  bordered?: boolean;
};

function ReturnStat({
  icon,
  value,
  label,
  bordered = false,
}: ReturnStatProps) {
  return (
    <div
      className={`
        flex
        min-h-[145px]
        flex-col
        items-center
        justify-center
        text-center

        sm:min-h-[120px]

        lg:min-h-[130px]

        ${
          bordered
            ? `
                border-y
                border-black/[0.08]

                sm:border-y-0
                sm:border-x
              `
            : ""
        }
      `}
    >
      <div className="text-black">{icon}</div>

      <h3
        className="
          mt-[12px]
          font-[var(--font-sf-pro)]
          text-[25px]
          font-bold
          leading-none
          tracking-[-0.5px]
          text-black

          lg:text-[29px]
        "
      >
        {value}
      </h3>

      <p
        className="
          mt-[10px]
          font-[var(--font-sf-pro)]
          text-[12px]
          font-normal
          text-black/45

          lg:text-[13px]
        "
      >
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   RETURN STEP CARD
============================================================ */

type ReturnStepCardProps = {
  number: string;
  title: string;
  content: React.ReactNode;
};

function ReturnStepCard({
  number,
  title,
  content,
}: ReturnStepCardProps) {
  return (
    <div
      className="
        flex
        min-h-[155px]
        rounded-[14px]
        bg-[#F2F2F2]
        px-[22px]
        py-[25px]

        sm:px-[26px]

        lg:min-h-[160px]
        lg:px-[28px]
        lg:py-[27px]
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
            leading-[1.65]
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

/* ============================================================
   GENERIC POLICY SECTION
============================================================ */

type PolicySectionProps = {
  title: string;
  children: React.ReactNode;
};

function PolicySection({
  title,
  children,
}: PolicySectionProps) {
  return (
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
        {title}
      </h2>

      <div className="mt-[28px] lg:mt-[30px]">{children}</div>
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

/* ============================================================
   LIST ITEM
============================================================ */

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
