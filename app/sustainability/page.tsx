
import Footer from "@/components/footer";
import ContactSection from "@/components/ContactSection";
import SustainabilityHero from "@/components/sections/Sustainabilityhero";
import SustainabilityCommitment from "@/components/sections/SustainabilityCommitment";
import ImpactProgressSection from "@/components/sections/SustainabilityImpactProgressSection";
import BuiltToLastSection from "@/components/sections/BuiltToLastSection";
import SustainabilityThreadSection from "@/components/sections/SustainabilityThreadSection";
import WhyChooseSection from "@/components/sections/WhyChooseSection";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata = createPageMetadata({
  title: "Durable and Responsible Riding Gear",
  description: "Discover 8-Gear's approach to durable motorcycle apparel, responsible materials, product longevity, and considered manufacturing.",
  path: "/sustainability",
  image: "/assets/images/sustainabilityhero.png",
});


export default function sustainability() {
  return (
    <>
      <main>
        <SustainabilityHero />
        <SustainabilityCommitment/>
        <ImpactProgressSection/>
        <BuiltToLastSection/>
        <SustainabilityThreadSection/>
        <WhyChooseSection/>
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
