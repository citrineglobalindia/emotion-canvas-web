import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSection } from "@/lib/siteContent";
import { defaultsFor } from "@/lib/contentSchema";
import { RichText, Paragraphs } from "@/components/RichText";

const BioSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const content = useSection("home", "bio", defaultsFor("home", "bio"));

  return (
    <section ref={ref} className="bg-warm py-20 md:py-28 text-center px-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="font-body text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-6"
      >
        {content.subheading}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.3] max-w-4xl mx-auto mb-8"
      >
        <RichText text={content.heading} />
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="max-w-2xl mx-auto space-y-4"
      >
        <Paragraphs
          text={content.body}
          className="font-body text-sm md:text-base text-muted-foreground leading-relaxed"
        />
      </motion.div>
    </section>
  );
};

export default BioSection;
