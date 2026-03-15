import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 md:py-48 px-6 md:px-16 lg:px-32">
      <div ref={ref} className="max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="font-body text-xs tracking-[0.5em] text-accent uppercase mb-8"
        >
          Our Philosophy
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display text-3xl md:text-5xl text-foreground leading-tight mb-12"
        >
          We are storytellers <em>of emotion.</em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-6"
        >
          <p className="font-body text-muted-foreground text-base md:text-lg leading-relaxed">
            Through cinematic films and timeless photography, we capture moments that become memories.
          </p>
          <p className="font-body text-muted-foreground text-base md:text-lg leading-relaxed">
            Each frame is crafted with intention. Each story is told with authenticity.
          </p>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-24 h-px bg-accent mx-auto mt-16"
        />
      </div>
    </section>
  );
};

export default AboutSection;
