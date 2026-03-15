import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const words = ["love", "moments", "memories"];

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <img src={heroBg} alt="Wedding couple" className="w-full h-[130%] object-cover grayscale" />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center"
        style={{ y: textY, opacity }}
      >
        {words.map((word, i) => (
          <motion.h1
            key={word}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.3 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-primary-foreground tracking-[0.3em] md:tracking-[0.4em] lowercase leading-[1.4]"
          >
            {word}
          </motion.h1>
        ))}
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-warm" />
    </section>
  );
};

export default HeroSection;
