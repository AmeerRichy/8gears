
import Footer from "@/components/footer";
import ContactSection from "@/components/ContactSection";
import SustainabilityHero from "@/components/sections/Sustainabilityhero";
import SustainabilityCommitment from "@/components/sections/SustainabilityCommitment";
import ImpactProgressSection from "@/components/sections/SustainabilityImpactProgressSection";
import BuiltToLastSection from "@/components/sections/BuiltToLastSection";
import SustainabilityThreadSection from "@/components/sections/SustainabilityThreadSection";
import WhyChooseSection from "@/components/sections/WhyChooseSection";


export default function sustainability() {
  return (
    <>
      <SustainabilityHero />
      <SustainabilityCommitment/>
      <ImpactProgressSection/>
      <BuiltToLastSection/>
      <SustainabilityThreadSection/>
      <WhyChooseSection/>
      <ContactSection />
      <Footer />
    </>
  );
}

