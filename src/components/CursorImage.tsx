import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";

interface CursorImageProps {
  src: string;
  alt: string;
  className?: string;
  label?: string;
  children?: React.ReactNode;
  parallaxStyle?: React.CSSProperties;
}

const CursorImage = ({ src, alt, className, label = "View", children, parallaxStyle }: CursorImageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      className={`overflow-hidden relative group cursor-none ${className || ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-[120%] object-cover transition-transform duration-700 group-hover:scale-105"
        style={parallaxStyle}
        loading="lazy"
      />
      {children}

      {/* Custom cursor dot */}
      <motion.div
        className="pointer-events-none absolute z-30 hidden md:flex items-center justify-center"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: hovered ? 1 : 0,
          opacity: hovered ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-20 h-20 rounded-full bg-primary-foreground/90 backdrop-blur-sm flex items-center justify-center">
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground">
            {label}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default CursorImage;
