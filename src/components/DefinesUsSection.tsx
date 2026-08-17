import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSection } from "@/lib/siteContent";
import { defaultsFor } from "@/lib/contentSchema";
import { RichText, Paragraphs } from "@/components/RichText";

const DefinesUsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const content = useSection("home", "defines-us", defaultsFor("home", "defines-us"));

  return (
    <section ref={ref} className="bg-warm py-24 md:py-36 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.2] mb-10"
        >
          <RichText text={content.heading} />
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <Paragraphs
            text={content.body}
            className="font-body text-base md:text-lg text-muted-foreground leading-relaxed"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default DefinesUsSection;
