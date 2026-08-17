import ContactSection from "@/components/ContactSection";
import Footer from "@/components/footer";
import ContactSupportCards from "@/components/sections/ Contactsupportcards";
import ContactFAQ from "@/components/sections/Contactfaq";
import ContactFormSection from "@/components/sections/ContactForm";
import ContactHero from "@/components/sections/ContactHero";



export default function Contact() {
  return (
    <>
       <ContactHero/>
       <ContactSupportCards/>
       <ContactFormSection/>
       <ContactFAQ/>
       <ContactSection/>
      <Footer />
    </>
  );
}
