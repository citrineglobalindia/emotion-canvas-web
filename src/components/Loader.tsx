import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

const Loader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("hold"), 600);
    const exitTimer = setTimeout(() => setPhase("exit"), 2200);
    const doneTimer = setTimeout(() => onComplete(), 3000);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : null}
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background"
        style={{ pointerEvents: phase === "exit" ? "none" : "all" }}
      >
        {/* Animated rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            className="absolute w-52 h-52 rounded-full border-2 border-accent"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.08 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="absolute w-72 h-72 rounded-full border border-accent"
          />

          {/* Spinning ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 0.25, rotate: 360 }}
            transition={{
              scale: { duration: 0.8, ease: "easeOut" },
              opacity: { duration: 0.8 },
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            }}
            className="absolute w-40 h-40 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 0%, hsl(var(--accent)) 30%, transparent 60%)",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="relative z-10"
          >
            <motion.img
              src={logo}
              alt="Black & White"
              className="w-24 h-24 object-contain dark:invert"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Brand text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 text-center"
        >
          <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-wide">
            Black & White
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="font-body text-xs text-muted-foreground mt-2 uppercase tracking-[0.3em]"
          >
            Cinematic Wedding Films
          </motion.p>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 w-40 h-[2px] bg-border rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.8, delay: 0.4, ease: "easeInOut" }}
            className="h-full bg-accent rounded-full"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;
