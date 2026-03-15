import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import heroBg from "@/assets/story-2.jpg";

const StorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stories" className="relative py-32 md:py-44 overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Cinematic sunset" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      </div>
      <div ref={ref} className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight">
          Every story deserves
          <br />
          <em className="text-accent">to be remembered.</em>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.4 }}
          className="font-body text-lg text-primary-foreground/60 mt-8 max-w-xl mx-auto leading-relaxed">
          Every moment deserves to be felt again. We capture emotions, not just images — turning fleeting seconds into forever.
        </motion.p>
      </div>
    </section>
  );
};

export default StorySection;
