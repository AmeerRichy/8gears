import { Suspense } from "react";

import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import ContactSupportCards from "@/components/sections/ Contactsupportcards";
import ContactFAQ from "@/components/sections/Contactfaq";
import ContactFormSection from "@/components/sections/ContactForm";
import ContactHero from "@/components/sections/ContactHero";

export default function Contact() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white" />
      }
    >
      <ContactHero />
      <ContactSupportCards />
      <ContactFormSection />
      <ContactFAQ />
      <ContactSection />
      <Footer />
    </Suspense>
  );
}