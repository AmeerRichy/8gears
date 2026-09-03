import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import ReturnPolicyDetail from "@/components/sections/ReturnPolicyDetail";
import ReturnPolicyHero from "@/components/sections/ReturnPolicyHero";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata = createPageMetadata({
  title: "Return Policy",
  description: "Review the 8-Gear return policy, eligibility requirements, return process, exchanges, refunds, and exclusions.",
  path: "/return-policy",
});






export default function ReturnPolicy() {
  return (
    <>
      <main>
        <ReturnPolicyHero/>
        <ReturnPolicyDetail/>
        <ContactSection/>
      </main>
      <Footer />
    </>
  );
}
