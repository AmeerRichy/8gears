import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import ShippingPolicyDetail from "@/components/sections/ShippingPolicyDetail";
import ShippingPolicyHero from "@/components/sections/ShippingPolicyHero";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata = createPageMetadata({
  title: "Shipping Policy",
  description: "Learn about 8-Gear order processing, shipping methods, delivery estimates, tracking, and delivery support.",
  path: "/shopping-policy",
});





export default function ShippingPolicy() {
  return (
    <>
      <main>
        <ShippingPolicyHero/>
        <ShippingPolicyDetail/>
        <ContactSection/>
      </main>
      <Footer />
    </>
  );
}
