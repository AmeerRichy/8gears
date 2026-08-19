"use client";

export default function PrivacyDetail() {
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
            8Gear Inc. is committed to protecting your privacy. This policy
            explains what personal information we collect, how we use it, and
            your rights regarding your data.
          </p>
        </div>

        {/* 1 */}
        <PrivacySection title="1. Information We Collect">
          <p>
            <strong>Information you provide:</strong> Name, email address,
            shipping address, phone number, and payment information when you
            place an order or create an account.
          </p>

          <p>
            <strong>Automatically collected:</strong> IP address, browser type,
            pages visited, time spent, cookies, and device information when you
            use our website.
          </p>

          <p>
            <strong>From third parties:</strong> Payment processors, shipping
            partners, and analytics providers may share data with us as
            described in their own privacy policies.
          </p>
        </PrivacySection>

        {/* 2 */}
        <PrivacySection title="2. How We Use Your Information">
          <p>
            We use your information to: process and fulfil orders; communicate
            about your order; send promotional emails (with your consent);
            improve our website and products; comply with legal obligations;
            and prevent fraud.
          </p>
        </PrivacySection>

        {/* 3 */}
        <PrivacySection title="3. Data Sharing">
          <p>
            We do not sell your personal information. We share data only with:
            shipping carriers (to deliver your order); payment processors (to
            process transactions); analytics providers (to improve our
            website); and law enforcement when legally required.
          </p>
        </PrivacySection>

        {/* 4 */}
        <PrivacySection title="4. Cookies">
          <p>
            We use cookies to maintain session information, remember your
            preferences, and analyse site traffic. You may disable cookies in
            your browser settings, but this may affect functionality. We use
            analytics cookies (e.g., Google Analytics) and may use marketing
            cookies with your consent.
          </p>
        </PrivacySection>

        {/* 5 */}
        <PrivacySection title="5. Data Retention">
          <p>
            We retain personal data for as long as necessary to fulfil the
            purposes described in this policy, comply with legal obligations,
            and resolve disputes. Order data is retained for a minimum of 7
            years for accounting purposes.
          </p>
        </PrivacySection>

        {/* 6 */}
        <PrivacySection title="6. Your Rights (PIPEDA / GDPR)">
          <p>
            Depending on your location, you may have the right to: access your
            personal data; correct inaccurate data; request deletion of your
            data; withdraw consent; object to processing; and data portability.
          </p>

          <p>
            To exercise these rights, Contact:{" "}
            <a
              href="mailto:info@8-gear.com"
              className="
                font-semibold
                text-black
                transition-opacity
                hover:opacity-60
              "
            >
              info@8-gear.com
            </a>
          </p>
        </PrivacySection>

        {/* 7 */}
        <PrivacySection title="7. International Transfers">
          <p>
            Your data may be transferred to and processed in Canada, Pakistan,
            and other countries where our service providers operate. We ensure
            appropriate safeguards are in place for all international data
            transfers.
          </p>
        </PrivacySection>

        {/* 8 */}
        <PrivacySection title="8. Security">
          <p>
            We implement industry-standard security measures including SSL
            encryption, access controls, and regular security audits. However,
            no internet transmission is 100% secure.
          </p>
        </PrivacySection>

        {/* 9 */}
        <div
          className="
            pt-[36px]

            sm:pt-[40px]

            lg:pt-[43px]
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
            9. Contact
          </h2>

          <div
            className="
              mt-[20px]
              space-y-[18px]
              font-[var(--font-sf-pro)]
              text-[15px]
              font-normal
              leading-[1.75]
              text-black/50

              sm:text-[16px]

              lg:mt-[22px]
              lg:text-[17px]
              lg:leading-[1.8]
            "
          >
            <p>
              For privacy enquiries or to exercise your rights:{" "}
              <a
                href="mailto:info@8-gear.com"
                className="
                  font-semibold
                  text-black
                  transition-opacity
                  hover:opacity-60
                "
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

type PrivacySectionProps = {
  title: string;
  children: React.ReactNode;
};

function PrivacySection({
  title,
  children,
}: PrivacySectionProps) {
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

          [&_strong]:font-semibold
          [&_strong]:text-black
        "
      >
        {children}
      </div>
    </div>
  );
}