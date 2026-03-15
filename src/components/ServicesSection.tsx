import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import story1 from "@/assets/story-1.jpg";

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref}>
      {/* Collection header */}
      <div className="bg-warm py-20 md:py-28 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.2]"
        >
          a collection of <em>Love Stories</em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <div className="w-16 h-px bg-border mx-auto mb-8" />
          <Link
            to="/films"
            className="font-body text-[12px] tracking-[0.25em] uppercase text-foreground/70 hover:text-foreground border-b border-foreground/30 pb-1 transition-all duration-300"
          >
            Explore More
          </Link>
        </motion.div>
      </div>

      {/* Full bleed image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        className="w-full aspect-[16/9] overflow-hidden"
      >
        <img src={story1} alt="Love story" className="w-full h-full object-cover" />
      </motion.div>
    </section>
  );
};

export default ServicesSection;
