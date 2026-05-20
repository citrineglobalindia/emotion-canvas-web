import { motion } from "framer-motion";
import Header from "@/components/Header";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import contactBg from "@/assets/contact-bg.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const ContactPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <PageHero
        eyebrow="Begin Your Story"
        title="Get in Touch"
        tagline="Tell us a little about your day — the date, the place, the people. We'll take it from there."
        image={[contactBg, gallery2, gallery6]}
      />
      <div>
        <ContactSection />
      </div>
      <Footer />
    </motion.div>
  );
};

export default ContactPage;
