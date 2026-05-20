import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import heroImg2 from "@/assets/hero-2.jpg";
import heroImg3 from "@/assets/hero-3.jpg";

const slides = [
  { src: heroBg, caption: "Udaipur · 2025" },
  { src: heroImg2, caption: "Tuscany · 2025" },
  { src: heroImg3, caption: "Goa · 2024" },
];

const words = ["love", "moments", "memories"];

const SLIDE_DURATION = 6500; // ms each slide is "active"
const CROSSFADE_DURATION = 1.8; // seconds

const HeroSection = () => {
  const ref = useRef(null);
  const [current, setCurrent] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-foreground">
      {/* Image layers — slow Ken-Burns + soft masked crossfade */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        {slides.map((slide, i) => (
          <motion.div
            key={slide.src + i}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: i === current ? 1 : 0,
              // Subtle clip-path reveal from the edges as image becomes active
              clipPath: i === current ? "inset(0% 0% 0% 0%)" : "inset(6% 8% 6% 8%)",
            }}
            transition={{
              opacity: { duration: CROSSFADE_DURATION, ease: [0.22, 1, 0.36, 1] },
              clipPath: { duration: CROSSFADE_DURATION + 0.4, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            {/* Ken-Burns: each image slowly zooms during its active window */}
            <motion.img
              src={slide.src}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover object-center grayscale"
              initial={{ scale: 1.12 }}
              animate={{ scale: i === current ? 1.0 : 1.12 }}
              transition={{ duration: (SLIDE_DURATION + 2000) / 1000, ease: "linear" }}
            />
          </motion.div>
        ))}

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/55" />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 220px 60px rgba(0,0,0,0.6)" }}
        />
        {/* Film-grain feel — already provided by FilmGrain component globally */}
      </motion.div>

      {/* Thin letterbox bars — top and bottom */}
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
            className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-primary-foreground tracking-[0.3em] md:tracking-[0.4em] lowercase leading-[1.25]"
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

      {/* Slide caption + progress — bottom-left */}
      <div className="absolute bottom-8 left-6 md:bottom-10 md:left-12 z-10 flex flex-col items-start gap-3 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/70"
          >
            {slides[current].caption}
          </motion.div>
        </AnimatePresence>
        {/* Progress ticks */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <div key={i} className="relative h-px w-10 overflow-hidden bg-primary-foreground/20">
              {i === current && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                  style={{ transformOrigin: "left" }}
                  className="absolute inset-0 bg-primary-foreground"
                />
              )}
              {i < current && <div className="absolute inset-0 bg-primary-foreground" />}
            </div>
          ))}
        </div>
      </div>

      {/* Slide counter — bottom-right */}
      <div className="absolute bottom-8 right-6 md:bottom-10 md:right-12 z-10 flex items-center gap-2 font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/70 pointer-events-none">
        <span className="text-primary-foreground text-base font-display font-light leading-none">
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="opacity-50">/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>

      {/* Warm baseline accent (matches site palette) */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-warm z-20" />
    </section>
  );
};

export default HeroSection;
