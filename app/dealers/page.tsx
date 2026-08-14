
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import DealerHero from "@/components/sections/DealerHero";
import DealerLocator from "@/components/sections/DealerLocator";


export default function Dealers() {
  return (
    <>
      <Navbar />
       <DealerHero/>
       <DealerLocator/>
       <ContactSection/>
      <Footer />
    </>
  );
}