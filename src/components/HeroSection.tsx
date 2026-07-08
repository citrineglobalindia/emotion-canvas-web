import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";

const words = ["stories", "moments", "frames"];

const HeroSection = () => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-foreground">
      {/* Background video — slow parallax + subtle scale */}
      <motion.div className="absolute inset-0" style={{ y: mediaY }}>
        <motion.video
          className="absolute inset-0 h-full w-full object-contain md:object-cover object-center grayscale"
          src="/films/reel-1.mp4"
          poster="/films/reel-1.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          initial={{ scale: 1.06 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 12, ease: "easeOut" }}
        />

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/35" />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 180px 40px rgba(0,0,0,0.4)" }}
        />
      </motion.div>

      {/* Thin letterbox bar — top */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
        className="absolute top-0 left-0 right-0 h-[3px] bg-primary-foreground/40 z-20"
      />

      {/* Title cluster — centered */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
        style={{ y: textY, opacity }}
      >
        {/* Tiny eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="h-px w-10 bg-primary-foreground/45" />
          <span className="font-body text-[10px] tracking-[0.5em] uppercase text-primary-foreground/75">
            Cinematic Wedding Films
          </span>
          <span className="h-px w-10 bg-primary-foreground/45" />
        </motion.div>

        {/* The triplet — words with overlapping reveal */}
        {words.map((word, i) => (
          <motion.h1
            key={word}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.45 + i * 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-2xl md:text-4xl lg:text-5xl font-light text-primary-foreground tracking-[0.3em] md:tracking-[0.4em] lowercase leading-[1.25]"
          >
            {word}
          </motion.h1>
        ))}

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-body text-[9px] tracking-[0.5em] uppercase text-primary-foreground/55">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={14} className="text-primary-foreground/55" strokeWidth={1.2} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Warm baseline accent (matches site palette) */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-warm z-20" />
    </section>
  );
};

export default HeroSection;
