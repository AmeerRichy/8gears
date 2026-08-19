import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import ShippingPolicyDetail from "@/components/sections/ShippingPolicyDetail";
import ShippingPolicyHero from "@/components/sections/ShippingPolicyHero";
import TncDetail from "@/components/sections/TncDetail";
import TncHero from "@/components/sections/Tnchero";





export default function ShippingPolicy() {
  return (
    <>
    <ShippingPolicyHero/>
       <ShippingPolicyDetail/>
       <ContactSection/>
      <Footer />
    </>
  );
}
