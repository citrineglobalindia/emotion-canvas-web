import { motion } from "framer-motion";
import Header from "@/components/Header";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <div className="pt-24">
        <ContactSection />
      </div>
      <Footer />
    </motion.div>
  );
};

export default ContactPage;
