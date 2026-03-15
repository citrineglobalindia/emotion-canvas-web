import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import storyBg from "@/assets/story-2.jpg";

const StorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stories" className="relative h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <img src={storyBg} alt="Cinematic scene" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div ref={ref} className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="font-body text-[11px] tracking-[0.35em] text-primary-foreground/50 uppercase mb-6"
        >
          Our Promise
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl text-primary-foreground leading-[1.1] max-w-4xl"
        >
          Every story deserves
          <br />
          <em>to be remembered.</em>
        </motion.h2>
      </div>
    </section>
  );
};

export default StorySection;
