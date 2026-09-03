
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import DealerHero from "@/components/sections/DealerHero";
import DealerLocator from "@/components/sections/DealerLocator";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata = createPageMetadata({
  title: "Find an 8-Gear Dealer",
  description: "Use the 8-Gear dealer locator to find motorcycle riding gear and apparel through an authorized dealer near you.",
  path: "/dealers",
});


export default function Dealers() {
  return (
    <>
      <main>
        <DealerHero/>
        <DealerLocator/>
        <ContactSection/>
      </main>
      <Footer />
    </>
  );
}
