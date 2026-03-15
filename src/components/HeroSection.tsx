import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const words = ["love", "moments", "memories"];

const HeroSection = () => (
  <section className="relative h-screen w-full overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="Wedding couple" className="w-full h-full object-cover grayscale" />
      <div className="absolute inset-0 bg-black/30" />
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
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
    </div>

    {/* Warm bottom strip like reference */}
    <div className="absolute bottom-0 left-0 right-0 h-2 bg-warm" />
  </section>
);

export default HeroSection;
