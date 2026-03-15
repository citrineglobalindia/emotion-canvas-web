import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";
import photo5 from "@/assets/photo-5.jpg";
import photo6 from "@/assets/photo-6.jpg";
import photo7 from "@/assets/photo-7.jpg";
import photo8 from "@/assets/photo-8.jpg";

const photos = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8];

const ParallaxPhoto = ({ src, index }: { src: string; index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.08 * index }}
      className="aspect-[3/4] overflow-hidden group cursor-pointer"
    >
      <motion.img
        src={src}
        alt={`Wedding photo ${index + 1}`}
        className="w-full h-[120%] object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ y }}
        loading="lazy"
      />
    </motion.div>
  );
};

const PhotoGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {photos.map((photo, i) => (
          <ParallaxPhoto key={i} src={photo} index={i} />
        ))}
      </div>
    </section>
  );
};

export default PhotoGrid;
