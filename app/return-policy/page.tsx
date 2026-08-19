import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import ReturnPolicyDetail from "@/components/sections/ReturnPolicyDetail";
import ReturnPolicyHero from "@/components/sections/ReturnPolicyHero";






export default function ReturnPolicy() {
  return (
    <>
    <ReturnPolicyHero/>
       <ReturnPolicyDetail/>
       <ContactSection/>
      <Footer />
    </>
  );
}
