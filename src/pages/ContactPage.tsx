import { motion } from "framer-motion";
import Header from "@/components/Header";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import contactBg from "@/assets/contact-bg.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import { useSection } from "@/lib/siteContent";
import { defaultsFor } from "@/lib/contentSchema";

const ContactPage = () => {
  const hero = useSection("contact", "hero", defaultsFor("contact", "hero"));
  const heroImages = hero.image ? [hero.image] : [contactBg, gallery2, gallery6];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <PageHero
        eyebrow={hero.subheading}
        title={hero.heading ?? "Get in Touch"}
        tagline={hero.body}
        image={heroImages}
      />
      <div>
        <ContactSection />
      </div>
      <Footer />
    </motion.div>
  );
};

export default ContactPage;
