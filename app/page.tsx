
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Categories from "@/components/sections/categories";
import CustomerCare from "@/components/sections/customercare";
import Hero from "@/components/sections/hero";
import LatestProducts from "@/components/sections/LatestProducts";
import ContactSection from "@/components/ContactSection";
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <LatestProducts />
      <ContactSection />
      <CustomerCare />
      <Footer />
    </>
  );
}


