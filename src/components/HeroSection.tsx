import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import heroImg2 from "@/assets/hero-2.jpg";
import heroImg3 from "@/assets/hero-3.jpg";

const words = ["love", "moments", "memories"];
const heroImages = [heroBg, heroImg2, heroImg3];

const HeroSection = () => {
  const ref = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={heroImages[currentImage]}
            alt="Wedding couple"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full min-h-screen object-cover object-center grayscale"
          />
        </AnimatePresence>
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
