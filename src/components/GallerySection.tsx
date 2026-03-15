import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="gallery" ref={ref}>
      {/* "What defines us?" section */}
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

      {/* Three word hero images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {[
          { img: gallery1, word: "real" },
          { img: gallery2, word: "artful" },
          { img: gallery4, word: "timeless" },
        ].map((item, i) => (
          <motion.div
            key={item.word}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 * i }}
            className="relative aspect-[3/4] overflow-hidden group"
          >
            <img src={item.img} alt={item.word} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary-foreground italic">
                {item.word}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* More gallery images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {[gallery3, gallery5].map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 * i }}
            className="aspect-[4/3] overflow-hidden group cursor-pointer"
          >
            <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          </motion.div>
        ))}
      </div>

      {/* Full-width image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="w-full aspect-[21/9] overflow-hidden"
      >
        <img src={gallery6} alt="Cinematic wide" className="w-full h-full object-cover" loading="lazy" />
      </motion.div>
    </section>
  );
};

export default GallerySection;
