import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import PrivacyDetail from "@/components/sections/PrivacyDetail";
import PrivacyHero from "@/components/sections/PrivacyHero";
import TncDetail from "@/components/sections/TncDetail";
import TncHero from "@/components/sections/Tnchero";





export default function PrivacyPolicy() {
  return (
    <>
       <PrivacyHero/>
       <PrivacyDetail/>
       <ContactSection/>
      <Footer />
    </>
  );
}
