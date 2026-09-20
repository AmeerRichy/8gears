import { Suspense } from "react";

import Footer from "@/components/footer";

import { createPageMetadata } from "@/app/lib/seo";
import AboutUsHero from "@/components/sections/Abouthero";
import AboutWhoWeAre from "@/components/sections/AboutWhoWeAre";
import AboutPurpose from "@/components/sections/AboutPurpose";
import AboutValuesBar from "@/components/sections/AboutValuesBar";
import AboutStory from "@/components/sections/AboutStory";
import AboutSustainability from "@/components/sections/AboutSustainability";
import ContactSection from "@/components/ContactSection";

export const metadata = createPageMetadata({
  title: "About Us",
  description:
    "Discover 8-Gear — motorcycle gear built for riders who value performance, protection, durability, and the freedom of the ride.",
  path: "/about",
});

export default function About() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black" />
      }
    >
      <main>
        <AboutUsHero />
        <AboutValuesBar/>
        <AboutWhoWeAre/>
        <AboutPurpose/>
        <AboutStory/>
        <AboutSustainability/>
        <ContactSection/>
      </main>

      <Footer />
    </Suspense>
  );
}