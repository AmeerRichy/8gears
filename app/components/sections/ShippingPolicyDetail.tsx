"use client";

import {
  Clock3,
  Truck,
  Globe2,
  CircleCheck,
  Info,
} from "lucide-react";

type ShippingRow = {
  service: string;
  delivery: string;
  cost: string;
};

const canadaRates: ShippingRow[] = [
  {
    service: "Standard Shipping",
    delivery: "5–7 Business Days",
    cost: "Free over $199 / $9.99",
  },
  {
    service: "Expedited Shipping",
    delivery: "2–3 Business Days",
    cost: "$14.99",
  },
  {
    service: "Express Shipping",
    delivery: "1–2 Business Days",
    cost: "$24.99",
  },
];

const usaRates: ShippingRow[] = [
  {
    service: "Standard Shipping",
    delivery: "7–14 Business Days",
    cost: "$19.99",
  },
  {
    service: "Expedited Shipping",
    delivery: "3–5 Business Days",
    cost: "$34.99",
  },
];

const internationalRates: ShippingRow[] = [
  {
    service: "Pakistan",
    delivery: "3–5 Business Days",
    cost: "$19.99",
  },
  {
    service: "Europe",
    delivery: "10–18 Business Days",
    cost: "$29.99",
  },
  {
    service: "Middle East",
    delivery: "8–14 Business Days",
    cost: "$24.99",
  },
  {
    service: "Asia Pacific",
    delivery: "10–20 Business Days",
    cost: "$29.99",
  },
  {
    service: "Rest of World",
    delivery: "14–25 Business Days",
    cost: "$34.99",
  },
];

export default function ShippingPolicyDetail() {
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
            pb-[55px]

            sm:grid-cols-2

            lg:grid-cols-4
            lg:pb-[70px]
          "
        >
          <ShippingStat
            icon={<Clock3 size={29} strokeWidth={2} />}
            value="1–2 DAYS"
            label="Processing Time"
          />

          <ShippingStat
            icon={<Truck size={29} strokeWidth={2} />}
            value="FREE"
            label="CA Shipping $199+"
            bordered
          />

          <ShippingStat
            icon={<Globe2 size={29} strokeWidth={2} />}
            value="20+"
            label="Countries"
            borderedDesktop
          />

          <ShippingStat
            icon={<CircleCheck size={29} strokeWidth={2} />}
            value="TRACKED"
            label="All Orders"
          />
        </div>

        {/* =====================================================
            ORDER PROCESSING
        ====================================================== */}
        <PolicySection title="Order Processing">
          <div
            className="
              space-y-[22px]
              font-[var(--font-sf-pro)]
              text-[15px]
              leading-[1.8]
              text-black/50

              sm:text-[16px]

              lg:text-[17px]
            "
          >
            <p>
              Orders are processed within 1–2 business days (Monday–Friday,
              excluding Canadian public holidays). You&apos;ll receive a
              confirmation email with tracking details once your order ships.
            </p>

            <p>
              Orders placed after 2:00 PM EST on a Friday will be processed the
              following Monday.
            </p>
          </div>
        </PolicySection>

        {/* =====================================================
            CANADA SHIPPING
        ====================================================== */}
        <PolicySection title="Canada Shipping Rates">
          <ShippingTable rows={canadaRates} />
        </PolicySection>

        {/* =====================================================
            USA SHIPPING
        ====================================================== */}
        <PolicySection title="USA Shipping Rates">
          <ShippingTable rows={usaRates} />

          <p
            className="
              mt-[24px]
              font-[var(--font-sf-pro)]
              text-[15px]
              leading-[1.75]
              text-black/50

              sm:text-[16px]

              lg:text-[17px]
            "
          >
            US orders may be subject to customs duties and taxes collected by
            US customs. 8Gear is not responsible for these charges.
          </p>
        </PolicySection>

        {/* =====================================================
            INTERNATIONAL SHIPPING
        ====================================================== */}
        <PolicySection title="International Shipping Rates">
          <ShippingTable rows={internationalRates} />

          <p
            className="
              mt-[24px]
              font-[var(--font-sf-pro)]
              text-[15px]
              leading-[1.75]
              text-black/50

              sm:text-[16px]

              lg:text-[17px]
            "
          >
            International customers are responsible for all customs duties,
            import taxes, and fees. Delivery times are estimates and may vary
            due to customs processing.
          </p>
        </PolicySection>

        {/* =====================================================
            TRACKING
        ====================================================== */}
        <PolicySection title="Tracking Your Order">
          <p
            className="
              font-[var(--font-sf-pro)]
              text-[15px]
              leading-[1.8]
              text-black/50

              sm:text-[16px]

              lg:text-[17px]
            "
          >
            All orders include tracking. You&apos;ll receive a tracking number
            via email once your package ships. Track your order directly on our
            website or through the carrier&apos;s website.
          </p>
        </PolicySection>

        {/* =====================================================
            LOST / DAMAGED
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
              leading-tight
              tracking-[-0.5px]
              text-black

              sm:text-[27px]

              lg:text-[29px]
            "
          >
            Lost or Damaged Shipments
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
              className="
                mt-[2px]
                shrink-0
                text-[#ff8a00]
              "
            />

            <p
              className="
                font-[var(--font-sf-pro)]
                text-[15px]
                leading-[1.7]
                text-black/50

                sm:text-[16px]

                lg:text-[17px]
              "
            >
              If your package is lost or arrives damaged, contact us within 7
              days of the expected delivery date. Email{" "}
              <a
                href="mailto:shipping@8gear.com"
                className="
                  transition-opacity
                  hover:opacity-60
                "
              >
                shipping@8gear.com
              </a>{" "}
              with your order number and photos (for damaged items).
            </p>
          </div>
        </section>

        {/* =====================================================
            CONTACT
        ====================================================== */}
        <section
          className="
            pt-[42px]

            sm:pt-[48px]

            lg:pt-[50px]
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
   TOP SHIPPING STAT
============================================================ */

type ShippingStatProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
  bordered?: boolean;
  borderedDesktop?: boolean;
};

function ShippingStat({
  icon,
  value,
  label,
  bordered = false,
  borderedDesktop = false,
}: ShippingStatProps) {
  return (
    <div
      className={`
        flex
        min-h-[145px]
        flex-col
        items-center
        justify-center
        text-center

        sm:min-h-[130px]

        lg:min-h-[135px]

        ${
          bordered
            ? `
              border-y
              border-black/[0.08]

              sm:border-y-0
              sm:border-l
            `
            : ""
        }

        ${
          borderedDesktop
            ? `
              border-b
              border-black/[0.08]

              sm:border-b-0

              lg:border-l
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
   POLICY SECTION
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

      <div className="mt-[28px] lg:mt-[30px]">
        {children}
      </div>
    </section>
  );
}

/* ============================================================
   SHIPPING TABLE
============================================================ */

type ShippingTableProps = {
  rows: ShippingRow[];
};

function ShippingTable({
  rows,
}: ShippingTableProps) {
  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-[14px]
        border
        border-black/[0.08]
      "
    >
      <div className="w-full overflow-x-auto">
        <table
          className="
            w-full
            min-w-[700px]
            border-collapse
            font-[var(--font-sf-pro)]
          "
        >
          <thead>
            <tr className="bg-[#F2F2F2]">
              <th
                className="
                  w-1/3
                  px-[28px]
                  py-[22px]
                  text-left
                  text-[16px]
                  font-semibold
                  text-black

                  lg:px-[55px]
                  lg:text-[18px]
                "
              >
                Service
              </th>

              <th
                className="
                  w-1/3
                  px-[28px]
                  py-[22px]
                  text-left
                  text-[16px]
                  font-semibold
                  text-black

                  lg:px-[55px]
                  lg:text-[18px]
                "
              >
                Estimated Delivery
              </th>

              <th
                className="
                  w-1/3
                  px-[28px]
                  py-[22px]
                  text-left
                  text-[16px]
                  font-semibold
                  text-black

                  lg:px-[55px]
                  lg:text-[18px]
                "
              >
                Cost
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${row.service}-${row.delivery}`}
                className={
                  index !== rows.length - 1
                    ? "border-b border-black/[0.08]"
                    : ""
                }
              >
                <td
                  className="
                    px-[28px]
                    py-[23px]
                    text-[14px]
                    font-normal
                    text-black/50

                    lg:px-[55px]
                    lg:py-[25px]
                    lg:text-[16px]
                  "
                >
                  {row.service}
                </td>

                <td
                  className="
                    px-[28px]
                    py-[23px]
                    text-[14px]
                    font-normal
                    text-black/50

                    lg:px-[55px]
                    lg:py-[25px]
                    lg:text-[16px]
                  "
                >
                  {row.delivery}
                </td>

                <td
                  className="
                    px-[28px]
                    py-[23px]
                    text-[14px]
                    font-normal
                    text-black/50

                    lg:px-[55px]
                    lg:py-[25px]
                    lg:text-[16px]
                  "
                >
                  {row.cost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}