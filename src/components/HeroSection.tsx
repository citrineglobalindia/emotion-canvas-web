import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative h-screen w-full overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="Beautiful wedding couple in golden light" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.3 }}
        className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-5 py-2 mb-8">
        <span className="font-body text-xs tracking-widest text-primary-foreground/80 uppercase">Cinematic Wedding Films & Photography</span>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
        className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-semibold text-primary-foreground leading-[1.1] tracking-tight">
        Crafting Stories
        <br />
        <span className="italic font-normal">Through Light & Emotion</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
        className="font-body text-primary-foreground/70 text-lg md:text-xl mt-6 max-w-xl leading-relaxed">
        We turn your most precious moments into cinematic masterpieces you'll treasure forever.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.4 }}
        className="flex flex-col sm:flex-row gap-4 mt-10">
        <Button variant="accent" onClick={() => document.getElementById("films")?.scrollIntoView({ behavior: "smooth" })}>
          View Our Films
        </Button>
        <Button variant="hero-outline" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
          Book a Consultation
        </Button>
      </motion.div>
    </div>

    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
      onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
      <ChevronDown className="text-primary-foreground/50" size={28} />
    </motion.button>
  </section>
);

export default HeroSection;
