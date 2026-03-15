import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import aboutImg from "@/assets/about-team.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery5 from "@/assets/gallery-5.jpg";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref}>
      {/* "a Unique take" tagline */}
      <div className="bg-warm py-20 md:py-28 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.3] max-w-4xl mx-auto"
        >
          a <em>Unique</em> take on
          <br />
          Fine Art Documentary
          <br />
          Wedding Photography
        </motion.h2>
      </div>

      {/* Image grid - two stacked images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="aspect-[3/4] overflow-hidden"
        >
          <img src={aboutImg} alt="Wedding photography" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="aspect-[3/4] overflow-hidden"
        >
          <img src={gallery3} alt="Wedding moment" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Full bleed image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full aspect-[21/9] overflow-hidden"
      >
        <img src={gallery5} alt="Cinematic scene" className="w-full h-full object-cover" />
      </motion.div>
    </section>
  );
};

export default AboutSection;
