import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import PrivacyDetail from "@/components/sections/PrivacyDetail";
import PrivacyHero from "@/components/sections/PrivacyHero";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Read how 8-Gear collects, uses, protects, and manages information when you use our website and services.",
  path: "/privacy-policy",
});





export default function PrivacyPolicy() {
  return (
    <>
      <main>
        <PrivacyHero/>
        <PrivacyDetail/>
        <ContactSection/>
      </main>
      <Footer />
    </>
  );
}
