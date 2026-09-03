
import Footer from "@/components/footer";
import Hero from "@/components/sections/hero";
import LatestProducts from "@/components/sections/LatestProducts";
import ContactSection from "@/components/ContactSection";
import ProductFeatureBanner from "./components/sections/hm2ndhero";
import DenimFeature from "./components/sections/hmDenimFeature";
import FleeceBanner from "./components/sections/FleeceBanner";
import CafeRacer from "./components/sections/CafeRacer";
import type { Metadata } from "next";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Premium Motorcycle Riding Gear",
    description: "Explore 8-Gear motorcycle riding apparel engineered for rider protection, comfort, performance, and everyday adventure.",
    path: "/",
  }),
  title: { absolute: "Premium Motorcycle Riding Gear | 8-Gear" },
};

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <ProductFeatureBanner/>
        <DenimFeature/>
        <FleeceBanner/>
        <CafeRacer/>
        {/* <Categories /> */}
        <LatestProducts />
        <ContactSection />
        {/* <CustomerCare /> */}
      </main>
      <Footer />
    </>
  );
}
