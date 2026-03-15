import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const feedImages = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

const InstagramFeed = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="bg-warm py-20 md:py-28">
      <div className="text-center px-6 mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Instagram size={18} className="text-foreground" />
          <span className="font-body text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
            Follow Along
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display text-3xl md:text-5xl text-foreground"
        >
          <a
            href="https://www.instagram.com/storiesby_black_and_white"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground transition-colors"
          >
            @storiesby_black_and_white
          </a>
        </motion.h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-0">
        {feedImages.map((img, i) => (
          <motion.a
            key={i}
            href="https://www.instagram.com/storiesby_black_and_white"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.08 * i }}
            className="aspect-square overflow-hidden group relative"
          >
            <img
              src={img}
              alt={`Instagram post ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <Instagram
                size={24}
                className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default InstagramFeed;
