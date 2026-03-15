import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const images = [
  { src: gallery1, span: "md:col-span-4 md:row-span-2" },
  { src: gallery2, span: "md:col-span-4" },
  { src: gallery3, span: "md:col-span-4" },
  { src: gallery4, span: "md:col-span-6" },
  { src: gallery5, span: "md:col-span-6" },
  { src: gallery6, span: "md:col-span-12" },
];

const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="gallery" className="py-20 md:py-28">
      <div ref={ref} className="max-w-[1600px] mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-body text-[11px] tracking-[0.35em] text-muted-foreground uppercase mb-5"
          >
            Portfolio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground"
          >
            Gallery
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.08 * i }}
              className={`${img.span} overflow-hidden group cursor-pointer`}
            >
              <div className="relative w-full h-full min-h-[250px] md:min-h-[300px]">
                <img
                  src={img.src}
                  alt="Gallery"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
