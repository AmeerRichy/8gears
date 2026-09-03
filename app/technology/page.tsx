
import Footer from "@/components/footer";
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
import { createPageMetadata } from "@/app/lib/seo";

export const metadata = createPageMetadata({
  title: "Motorcycle Apparel Technology",
  description: "Explore the protective materials, garment construction, certification classes, and care guidance behind 8-Gear riding apparel.",
  path: "/technology",
  image: "/assets/images/techhero1.png",
});

export default function Technology() {
  return (
    <>
      <main>
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
      </main>
      <Footer />
    </>
  );
}
