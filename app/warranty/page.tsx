import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import WarrantyDetail from "@/components/sections/WarrantyDetail";
import WarrantyHero from "@/components/sections/WarrantyHero";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata = createPageMetadata({
  title: "Product Warranty",
  description: "Review 8-Gear motorcycle apparel warranty coverage, eligibility, exclusions, and the warranty claim process.",
  path: "/warranty",
});





export default function Warranty() {
  return (
    <>
      <main>
        <WarrantyHero/>
        <WarrantyDetail/>
        <ContactSection/>
      </main>
      <Footer />
    </>
  );
}
