"use client";

import Link from "next/link";

export default function TncDetail() {
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
        {/* Intro */}
        <div className="max-w-[1200px]">
          <p
            className="
              font-[var(--font-sf-pro)]
              text-[15px]
              font-normal
              leading-[1.75]
              text-black/50

              sm:text-[16px]

              lg:text-[17px]
              lg:leading-[1.8]
            "
          >
            These Terms &amp; Conditions govern your use of the 8Gear website
            and the purchase of products from 8Gear Inc. By accessing our
            website or placing an order, you agree to be bound by these terms.
          </p>
        </div>

        {/* 1 */}
        <TncSection title="1. Company Information">
          <p>
            8Gear Inc. is a corporation incorporated under the laws of Ontario,
            Canada. Our registered office is located in Toronto, Ontario,
            Canada. Manufacturing operations are based in Lahore, Pakistan.
          </p>

          <p>
            For all legal notices:{" "}
            <a
              href="mailto:info@8-gear.com"
              className="font-semibold text-black transition-opacity hover:opacity-60"
            >
              info@8-gear.com
            </a>
          </p>
        </TncSection>

        {/* 2 */}
        <TncSection title="2. Acceptance of Terms">
          <p>
            By using this website, you confirm that you are at least 18 years
            of age, have the legal capacity to enter into a binding contract,
            and agree to these Terms &amp; Conditions in their entirety.
          </p>

          <p>
            We reserve the right to modify these terms at any time. Changes
            will be effective immediately upon posting. Your continued use of
            the website constitutes acceptance of the revised terms.
          </p>
        </TncSection>

        {/* 3 */}
        <TncSection title="3. Products & Pricing">
          <p>
            All prices are listed in Canadian Dollars (CAD) unless otherwise
            stated. 8Gear reserves the right to change prices at any time
            without prior notice. Product images are for illustrative purposes;
            actual products may vary slightly.
          </p>

          <p>
            We reserve the right to limit quantities, refuse service, or cancel
            orders at our discretion.
          </p>
        </TncSection>

        {/* 4 */}
        <TncSection title="4. Orders & Payment">
          <p>
            When you place an order, you make an offer to purchase products.
            The contract is formed when we send you an order confirmation
            email. We accept all major credit cards, PayPal, and other payment
            methods displayed at checkout.
          </p>

          <p>
            All transactions are processed securely through PCI-DSS compliant
            payment processors. 8Gear does not store full credit card details.
          </p>
        </TncSection>

        {/* 5 */}
        <TncSection title="5. Shipping & Delivery">
          <p>
            Shipping timelines are estimates only and not guaranteed. 8Gear is
            not responsible for delays caused by customs, weather, or carrier
            issues. Risk of loss passes to the buyer upon delivery to the
            carrier.
          </p>

          <p>
            For detailed shipping information, please refer to our{" "}
            <Link
              href="/shipping-policy"
              className="
                font-semibold
                text-black
                underline
                underline-offset-[3px]
                transition-opacity
                hover:opacity-60
              "
            >
              Shipping Policy
            </Link>
            .
          </p>
        </TncSection>

        {/* 6 */}
        <TncSection title="6. Returns & Refunds">
          <p>
            We offer a 30-day return window from the date of delivery. Products
            must be unused, in original packaging, and in original condition.
            For full details, see our{" "}
            <Link
              href="/return-policy"
              className="
                font-semibold
                text-black
                underline
                underline-offset-[3px]
                transition-opacity
                hover:opacity-60
              "
            >
              Return Policy
            </Link>
            .
          </p>
        </TncSection>

        {/* 7 */}
        <TncSection title="7. Intellectual Property">
          <p>
            All content on this website — including text, images, logos,
            videos, and design — is the exclusive property of 8Gear Inc. and is
            protected by applicable intellectual property laws. Unauthorized
            reproduction or use is strictly prohibited.
          </p>
        </TncSection>

        {/* 8 */}
        <TncSection title="8. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, 8Gear&apos;s liability for
            any claim arising from the use of our products or website shall not
            exceed the purchase price paid for the product in question.
          </p>

          <p>
            8Gear is not liable for indirect, incidental, special, or
            consequential damages arising from product use or inability to use
            our website.
          </p>
        </TncSection>

        {/* 9 */}
        <TncSection title="9. Governing Law">
          <p>
            These Terms &amp; Conditions are governed by and construed in
            accordance with the laws of the Province of Ontario, Canada,
            without regard to its conflict of law provisions. Any disputes
            shall be subject to the exclusive jurisdiction of courts in
            Toronto, Ontario.
          </p>
        </TncSection>

        {/* 10 */}
        <div className="pt-[38px] sm:pt-[42px] lg:pt-[46px]">
          <h2
            className="
              font-[var(--font-sf-pro)]
              text-[23px]
              font-semibold
              leading-[1.25]
              tracking-[-0.5px]
              text-black

              sm:text-[25px]

              lg:text-[27px]
              lg:tracking-[-0.7px]
            "
          >
            10. Contact
          </h2>

          <div
            className="
              mt-[20px]
              space-y-[18px]
              font-[var(--font-sf-pro)]
              text-[15px]
              font-normal
              leading-[1.7]
              text-black/50

              sm:text-[16px]

              lg:mt-[22px]
              lg:text-[17px]
            "
          >
            <p>
              For legal enquiries:{" "}
              <a
                href="mailto:info@8-gear.com"
                className="font-semibold text-black transition-opacity hover:opacity-60"
              >
                info@8-gear.com
              </a>
            </p>

            <p>
              <span className="font-semibold text-black">8Gear Inc.</span>,
              Toronto, Ontario, Canada
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type TncSectionProps = {
  title: string;
  children: React.ReactNode;
};

function TncSection({ title, children }: TncSectionProps) {
  return (
    <div
      className="
        border-b
        border-black/[0.08]
        py-[36px]

        sm:py-[40px]

        lg:py-[43px]
      "
    >
      <h2
        className="
          font-[var(--font-sf-pro)]
          text-[23px]
          font-semibold
          leading-[1.25]
          tracking-[-0.5px]
          text-black

          sm:text-[25px]

          lg:text-[27px]
          lg:tracking-[-0.7px]
        "
      >
        {title}
      </h2>

      <div
        className="
          mt-[20px]
          space-y-[22px]
          font-[var(--font-sf-pro)]
          text-[15px]
          font-normal
          leading-[1.75]
          text-black/50

          sm:text-[16px]

          lg:mt-[22px]
          lg:space-y-[24px]
          lg:text-[17px]
          lg:leading-[1.8]
        "
      >
        {children}
      </div>
    </div>
  );
}