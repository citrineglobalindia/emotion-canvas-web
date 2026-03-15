import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import aboutImg from "@/assets/about-team.jpg";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-0">
      {/* Full-bleed image */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 1.5 }}
          className="w-full h-full"
        >
          <img src={aboutImg} alt="Our team at work" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Minimal text block */}
      <div ref={ref} className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="font-body text-[11px] tracking-[0.35em] text-muted-foreground uppercase mb-8"
        >
          Our Philosophy
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.15] mb-8"
        >
          We are storytellers <em>of emotion.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
        >
          Through cinematic films and timeless photography, we capture moments that become memories.
          Every frame is painted with emotion, light, and authenticity. We believe your love story
          deserves to be told with the same passion and artistry as the greatest films ever made.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center gap-16 mt-14"
        >
          {[
            { num: "200+", label: "Films" },
            { num: "500+", label: "Stories" },
            { num: "15+", label: "Countries" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl text-foreground">{stat.num}</p>
              <p className="font-body text-[11px] tracking-[0.2em] text-muted-foreground uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
