import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative h-screen w-full overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="Beautiful wedding couple in golden light" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/25" />
    </div>

    <div className="relative z-10 flex flex-col items-center justify-end h-full text-center px-6 pb-28">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="font-body text-[11px] tracking-[0.35em] text-primary-foreground/60 uppercase mb-5"
      >
        Cinematic Wedding Films & Photography
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.6 }}
        className="font-display text-5xl md:text-7xl lg:text-8xl font-normal text-primary-foreground leading-[1.05] tracking-tight"
      >
        Stories Through
        <br />
        <em className="font-normal">Light & Emotion</em>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="mt-10"
      >
        <button
          onClick={() => document.getElementById("films")?.scrollIntoView({ behavior: "smooth" })}
          className="font-body text-[11px] tracking-[0.3em] text-primary-foreground/70 uppercase border-b border-primary-foreground/30 pb-1 hover:text-primary-foreground hover:border-primary-foreground/60 transition-all duration-500"
        >
          Explore Our Work
        </button>
      </motion.div>
    </div>

    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float"
    >
      <ChevronDown className="text-primary-foreground/40" size={24} />
    </motion.button>
  </section>
);

export default HeroSection;
