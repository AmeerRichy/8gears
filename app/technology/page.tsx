
import Footer from "@/components/footer";
import LatestProducts from "@/components/sections/LatestProducts";
import ContactSection from "@/components/ContactSection";
import TechnologyHero from "@/components/sections/TechnologyHero";

import TechnologyKevlarSection from "@/components/sections/TechnologyKbanner";
import TechnologyKFeatures from "@/components/sections/TechnologyKFeatures";
import TechnologyKDiagram from "@/components/sections/TechnologyKDiagram";
import TechnologyDFeature from "@/components/sections/TechnologyDFeature";
import TechnologyDDiagram from "@/components/sections/TechnologyDDiagram";
import TechnologyDynimaSection from "@/components/sections/TechnologyDbanner";
import ArmorCertificationSection from "@/components/sections/ArmorCertificationSection";
import TechnologyCertificationStack from "@/components/sections/TechnologyCertificationStack";
import TechnologyWashCare from "@/components/sections/TechnologyWashCare";
import TechnologyWashSteps from "@/components/sections/TechnologyWashSteps";

export default function Technology() {
  return (
    <>
        <TechnologyHero/>
        <TechnologyKFeatures/>
        <TechnologyKDiagram/>
        <TechnologyKevlarSection/>

        <TechnologyDFeature/>
        <TechnologyDDiagram/>
        <TechnologyDynimaSection/>

        <ArmorCertificationSection/>
        <TechnologyCertificationStack/>
        <TechnologyWashCare/>
        <TechnologyWashSteps/>

      <ContactSection />
      <Footer />
    </>
  );
}

