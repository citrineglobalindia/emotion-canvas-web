import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Cinematic wedding silhouette" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/50" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-body text-xs tracking-[0.5em] text-primary-foreground/60 uppercase mb-6"
        >
          Cinematic Storytelling
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground tracking-tight leading-none"
        >
          BLACK & WHITE
          <br />
          <span className="font-normal italic">Films</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="font-body text-sm md:text-base text-primary-foreground/60 tracking-[0.2em] mt-8 max-w-lg"
        >
          Crafting Stories Through Light & Emotion
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="flex gap-6 mt-12"
        >
          <Button variant="hero" onClick={() => document.getElementById("films")?.scrollIntoView({ behavior: "smooth" })}>
            View Films
          </Button>
          <Button variant="accent" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            Book a Shoot
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-16 bg-primary-foreground/30 animate-pulse" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
