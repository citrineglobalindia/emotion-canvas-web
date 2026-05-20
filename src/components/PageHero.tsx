import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  tagline?: string;
  image: string | string[];
  height?: "sm" | "md" | "lg";
  grayscale?: boolean;
  cta?: { label: string; to: string };
  cycleSeconds?: number;
  align?: "center" | "left";
}

const heightClass: Record<NonNullable<PageHeroProps["height"]>, string> = {
  sm: "h-[60vh] min-h-[420px]",
  md: "h-[75vh] min-h-[520px]",
  lg: "h-[90vh] min-h-[620px]",
};

/**
 * Reusable hero for inner pages.
 *
 * Editorial wedding-film treatment: full-bleed image, slow Ken-Burns zoom,
 * thin letterbox bars top + bottom, scroll parallax, eyebrow + display title.
 * Pass a single `image` or an array to cycle between them.
 */
const PageHero = ({
  eyebrow,
  title,
  tagline,
  image,
  height = "md",
  grayscale = true,
  cta,
  cycleSeconds = 7,
  align = "center",
}: PageHeroProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const images = Array.isArray(image) ? image : [image];
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setActive((prev) => (prev + 1) % images.length), cycleSeconds * 1000);
    return () => clearInterval(id);
  }, [images.length, cycleSeconds]);

  const isLeft = align === "left";

  return (
    <section ref={ref} className={`relative w-full overflow-hidden bg-foreground ${heightClass[height]}`}>
      {/* Image layers (Ken-Burns + crossfade) */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {images.map((src, i) => (
          <motion.div
            key={src + i}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === active ? 1 : 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img
              src={src}
              alt=""
              aria-hidden
              className={`absolute inset-0 h-full w-full object-cover ${grayscale ? "grayscale" : ""}`}
              initial={{ scale: 1.08 }}
              animate={{ scale: i === active ? 1.0 : 1.08 }}
              transition={{ duration: cycleSeconds + 2, ease: "linear" }}
            />
          </motion.div>
        ))}

        {/* Editorial gradient overlay */}
        <motion.div className="absolute inset-0" style={{ opacity: overlayOpacity }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/65" />
          {/* Subtle vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: "inset 0 0 180px 40px rgba(0,0,0,0.55)" }}
          />
        </motion.div>
      </motion.div>

      {/* Thin letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-foreground z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-warm z-20" />

      {/* Content */}
      <motion.div
        className={`relative z-10 flex h-full flex-col justify-end pb-16 md:pb-20 px-6 md:px-12 lg:px-20 ${
          isLeft ? "items-start text-left" : "items-center text-center"
        }`}
        style={{ y: textY }}
      >
        <div className={`max-w-4xl ${isLeft ? "" : "mx-auto"}`}>
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={`flex items-center gap-3 mb-5 ${isLeft ? "" : "justify-center"}`}
            >
              <span className="h-px w-8 bg-primary-foreground/50" />
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/75">
                {eyebrow}
              </span>
              <span className="h-px w-8 bg-primary-foreground/50" />
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-light text-primary-foreground text-5xl md:text-7xl lg:text-[88px] leading-[1.05] tracking-tight"
          >
            {title}
          </motion.h1>

          {tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`mt-6 font-body text-sm md:text-base text-primary-foreground/80 leading-relaxed max-w-2xl ${
                isLeft ? "" : "mx-auto"
              }`}
            >
              {tagline}
            </motion.p>
          )}

          {cta && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8"
            >
              <Link
                to={cta.to}
                className="inline-flex items-center font-body text-[11px] tracking-[0.35em] uppercase border border-primary-foreground/40 text-primary-foreground px-7 py-3.5 hover:bg-primary-foreground hover:text-foreground transition-all duration-300"
              >
                {cta.label}
              </Link>
            </motion.div>
          )}
        </div>

        {/* Image counter — only if multiple */}
        {images.length > 1 && (
          <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-2 text-primary-foreground/60 font-body text-[10px] tracking-[0.3em] uppercase">
            <span className="text-primary-foreground">{String(active + 1).padStart(2, "0")}</span>
            <span className="h-px w-8 bg-primary-foreground/30" />
            <span>{String(images.length).padStart(2, "0")}</span>
          </div>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-body text-[9px] tracking-[0.4em] uppercase text-primary-foreground/55">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-primary-foreground/40"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PageHero;
