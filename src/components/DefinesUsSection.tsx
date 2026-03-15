import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const DefinesUsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="bg-warm py-24 md:py-36 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.2] mb-10"
        >
          What <em>defines</em> us ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
        >
          Photographs are more than still frames—they're whispers of time, fragments of joy, love,
          and laughter etched in light. At the heart of what we do is a deep love for storytelling—honest,
          cinematic, soulful. We become part of your journey, part of your family.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-body text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto mt-6"
        >
          Our goal is to create wedding photos and films that feel{" "}
          <em className="font-display text-foreground text-base">Artful, Real and Timeless</em> so that
          when you're sitting together years from now, you'll relive the magic all over again.
        </motion.p>
      </div>
    </section>
  );
};

export default DefinesUsSection;
