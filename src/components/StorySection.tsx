import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import storyBg from "@/assets/story-2.jpg";

const StorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section id="stories" ref={ref} className="relative h-[90vh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <img src={storyBg} alt="Cinematic scene" className="w-full h-[130%] object-cover" />
        <div className="absolute inset-0 bg-black/35" />
      </motion.div>
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
        style={{ y: textY }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2 }}
          className="font-display text-4xl md:text-6xl lg:text-8xl text-primary-foreground leading-[1.2]"
        >
          this is where the
          <br />
          <em>Magic</em> happens.
        </motion.h2>
      </motion.div>
    </section>
  );
};

export default StorySection;
