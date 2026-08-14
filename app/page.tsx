
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Categories from "@/components/sections/categories";
import CustomerCare from "@/components/sections/customercare";
import Hero from "@/components/sections/hero";
import LatestProducts from "@/components/sections/LatestProducts";
import ContactSection from "@/components/ContactSection";
import ProductFeatureBanner from "./components/sections/hm2ndhero";
import DenimFeature from "./components/sections/hmDenimFeature";
import FleeceBanner from "./components/sections/FleeceBanner";
import CafeRacer from "./components/sections/CafeRacer";
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProductFeatureBanner/>
      <DenimFeature/>
      <FleeceBanner/>
      <CafeRacer/>
      {/* <Categories /> */}
      <LatestProducts />
      <ContactSection />
      {/* <CustomerCare /> */}
      <Footer />
    </>
  );
}


