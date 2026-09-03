import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import TncDetail from "@/components/sections/TncDetail";
import TncHero from "@/components/sections/Tnchero";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms and Conditions",
  description: "Read the terms and conditions governing use of the 8-Gear website, purchases, accounts, content, and services.",
  path: "/tncs",
});





export default function Tncs() {
  return (
    <>
      <main>
        <TncHero/>
        <TncDetail/>
        <ContactSection/>
      </main>
      <Footer />
    </>
  );
}
