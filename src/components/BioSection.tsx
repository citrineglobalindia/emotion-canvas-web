import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const BioSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-warm py-20 md:py-28 text-center px-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="font-body text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-6"
      >
        About Us
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.3] max-w-4xl mx-auto mb-8"
      >
        a <em>Unique</em> take on
        <br />
        Fine Art Documentary
        <br />
        Wedding Photography & Films
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto"
      >
        At Black & White Films, we believe every love story deserves to be told with depth,
        artistry, and soul. We blend cinematic storytelling with fine art sensibility to create
        timeless visual narratives that you'll treasure for generations.
      </motion.p>
    </section>
  );
};

export default BioSection;
