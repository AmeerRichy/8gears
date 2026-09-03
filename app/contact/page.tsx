import { Suspense } from "react";

import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import ContactSupportCards from "@/components/sections/ Contactsupportcards";
import ContactFAQ from "@/components/sections/Contactfaq";
import ContactFormSection from "@/components/sections/ContactForm";
import ContactHero from "@/components/sections/ContactHero";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact Us",
  description: "Contact 8-Gear for help with motorcycle riding gear, orders, product information, partnerships, and customer support.",
  path: "/contact",
});

export default function Contact() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white" />
      }
    >
      <main>
        <ContactHero />
        <ContactSupportCards />
        <ContactFormSection />
        <ContactFAQ />
        <ContactSection />
      </main>
      <Footer />
    </Suspense>
  );
}
