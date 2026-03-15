import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import CursorImage from "@/components/CursorImage";
import aboutImg from "@/assets/about-team.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery5 from "@/assets/gallery-5.jpg";

const ParallaxCursorImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={className}>
      <CursorImage src={src} alt={alt} className="w-full h-full" parallaxStyle={{ y } as any} />
    </div>
  );
};

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref}>
      <div className="bg-warm py-20 md:py-28 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.3] max-w-4xl mx-auto"
        >
          a <em>Unique</em> take on
          <br />
          Fine Art Documentary
          <br />
          Wedding Photography
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <ParallaxCursorImage src={aboutImg} alt="Wedding photography" className="aspect-[3/4]" />
        <ParallaxCursorImage src={gallery3} alt="Wedding moment" className="aspect-[3/4]" />
      </div>

      <ParallaxCursorImage src={gallery5} alt="Cinematic scene" className="w-full aspect-[21/9]" />
    </section>
  );
};

export default AboutSection;
