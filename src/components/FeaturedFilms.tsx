import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const ParallaxImage = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className="aspect-square overflow-hidden group cursor-pointer">
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-[116%] object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ y }}
        loading="lazy"
      />
    </div>
  );
};

const FeaturedFilms = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="films" ref={ref}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
        {[film1, film2, film3, gallery1, gallery4, gallery6].map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1 * i }}
          >
            <ParallaxImage src={img} alt="Portfolio" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedFilms;
