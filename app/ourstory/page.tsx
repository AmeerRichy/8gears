
import Footer from "@/components/footer";

import type { Metadata } from "next";
import { createPageMetadata } from "@/app/lib/seo";
import OurStoryHero from "@/components/sections/OurStoryHero";
import OurPromise from "@/components/sections/OurPromise";
import OurOrigin from "@/components/sections/OurOrigin";
import CraftedWithPurpose from "@/components/sections/OurCraftedWithPurpose";
import EngineeredPerformance from "@/components/sections/EngineeredPerformance";
import HeritageStandard from "@/components/sections/Ourheritage";
import RideWithConfidence from "@/components/sections/RideWithConfidence";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "OurStory",
    description: "Explore 8-Gear motorcycle riding apparel engineered for rider protection, comfort, performance, and everyday adventure.",
    path: "/",
  }),
  title: { absolute: "Our Story | 8-Gear" },
};

export default function OurStory() {
  return (
    <>
      <main>
    <OurStoryHero/>
    <OurPromise/>
    <OurOrigin/>
    <CraftedWithPurpose/>
    <EngineeredPerformance/>
    <HeritageStandard/>
    <RideWithConfidence/>
    <ContactSection/>
      </main>
      <Footer />
    </>
  );
}
