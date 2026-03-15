import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const StorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stories" className="py-40 md:py-56 px-6 md:px-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary" />
      <div ref={ref} className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight"
        >
          Every story deserves
          <br />
          <em>to be remembered.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-display text-2xl md:text-3xl text-foreground/50 mt-12 italic"
        >
          Every moment deserves to be felt again.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-body text-sm text-accent tracking-[0.3em] uppercase mt-16"
        >
          We capture emotions, not just images.
        </motion.p>
      </div>
    </section>
  );
};

export default StorySection;
