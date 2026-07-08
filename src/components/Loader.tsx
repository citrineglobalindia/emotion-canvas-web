import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Loader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("hold"), 400);
    const exitTimer = setTimeout(() => setPhase("exit"), 2800);
    const doneTimer = setTimeout(() => onComplete(), 3500);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  // Smooth progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        const remaining = 100 - p;
        return p + remaining * 0.04;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-foreground overflow-hidden"
        style={{ pointerEvents: phase === "exit" ? "none" : "all" }}
      >
        {/* Ambient light particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-background/5"
            initial={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              scale: 0,
            }}
            animate={{
              x: [Math.random() * 300 - 150, Math.random() * 300 - 150],
              y: [Math.random() * 300 - 150, Math.random() * 300 - 150],
              scale: [0, 1, 0.5],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
            style={{
              width: 80 + i * 40,
              height: 80 + i * 40,
            }}
          />
        ))}

        {/* Center content */}
        <div className="relative flex flex-col items-center">
          {/* Shutter ring animation */}
          <div className="relative flex items-center justify-center mb-8">
            {/* Outer glow ring */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-44 h-44 rounded-full border border-background/20"
            />

            {/* Rotating dashed ring */}
            <motion.div
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 360, opacity: 0.3 }}
              transition={{
                rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                opacity: { duration: 1, delay: 0.3 },
              }}
              className="absolute w-36 h-36 rounded-full"
              style={{
                border: "1px dashed hsla(var(--background) / 0.25)",
              }}
            />

            {/* Inner spinning arc */}
            <svg className="absolute w-32 h-32" viewBox="0 0 100 100">
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsla(var(--background) / 0.4)"
                strokeWidth="0.5"
                strokeDasharray="70 210"
                strokeLinecap="round"
                initial={{ rotate: 0 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "center" }}
              />
            </svg>

            {/* Logo mark with subtle pulse */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-10 flex items-center justify-center px-4"
              aria-label="Black & White Films"
            >
              <motion.img
                src="/logo-white.png"
                alt="Black & White Films"
                animate={{ scale: [1, 1.04, 1], opacity: [0.92, 1, 0.92] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                className="h-16 md:h-20 w-auto object-contain"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 48, opacity: 0.3 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="h-px bg-background my-4"
          />

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 0.5, letterSpacing: "0.35em" }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="font-body text-[10px] text-background uppercase"
          >
            Cinematic Wedding Films
          </motion.p>

          {/* Minimal progress indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <div className="w-32 h-[1px] bg-background/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-background/50"
                style={{ width: `${progress}%` }}
              />
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1.6 }}
              className="font-body text-[9px] text-background tabular-nums tracking-[0.2em]"
            >
              {Math.round(progress)}%
            </motion.span>
          </motion.div>
        </div>

        {/* Film strip lines at edges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-0 left-6 w-px h-full bg-background"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="absolute top-0 right-6 w-px h-full bg-background"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;
