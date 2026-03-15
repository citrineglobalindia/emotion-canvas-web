import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const ParallaxImage = ({ src, alt, className, children }: { src: string; alt: string; className?: string; children?: React.ReactNode }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden relative group ${className || ""}`}>
      <motion.img src={src} alt={alt} className="w-full h-[120%] object-cover transition-transform duration-700 group-hover:scale-105" style={{ y }} loading="lazy" />
      {children}
    </div>
  );
};

const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="gallery" ref={ref}>
      <div className="bg-warm py-24 md:py-36 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.2] mb-10"
          >
            What <em>defines</em> us ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Photographs are more than still frames—they're whispers of time, fragments of joy, love,
            and laughter etched in light. At the heart of what we do is a deep love for storytelling—honest,
            cinematic, soulful. We become part of your journey, part of your family.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-body text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto mt-6"
          >
            Our goal is to create wedding photos and films that feel <em className="font-display text-foreground text-base">Artful, Real and Timeless</em> so that
            when you're sitting together years from now, you'll relive the magic all over again.
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {[
          { img: gallery1, word: "real" },
          { img: gallery2, word: "artful" },
          { img: gallery4, word: "timeless" },
        ].map((item) => (
          <ParallaxImage key={item.word} src={item.img} alt={item.word} className="aspect-[3/4] cursor-pointer">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary-foreground italic">
                {item.word}
              </h3>
            </div>
          </ParallaxImage>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {[gallery3, gallery5].map((img, i) => (
          <ParallaxImage key={i} src={img} alt="Gallery" className="aspect-[4/3] cursor-pointer" />
        ))}
      </div>

      <ParallaxImage src={gallery6} alt="Cinematic wide" className="w-full aspect-[21/9]" />
    </section>
  );
};

export default GallerySection;
