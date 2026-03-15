import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import contactBg from "@/assets/contact-bg.jpg";
import ChatBot from "@/components/ChatBot";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="contact">
      {/* Full-bleed image */}
      <div className="w-full aspect-[21/9] overflow-hidden">
        <img src={contactBg} alt="Contact" className="w-full h-full object-cover" />
      </div>

      {/* Chatbot */}
      <div ref={ref} className="bg-warm py-24 md:py-36 px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Let's <em>Talk</em>
          </h2>
          <p className="font-body text-sm text-muted-foreground">
            Ask us anything about your dream wedding film.
          </p>
        </motion.div>

        <ChatBot />
      </div>
    </section>
  );
};

export default ContactSection;
