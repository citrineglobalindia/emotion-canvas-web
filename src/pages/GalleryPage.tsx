import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";

const categories = ["All", "Weddings", "Couple Stories", "Portraits", "Destination"];

const images = [
  { src: gallery1, category: "Couple Stories" },
  { src: gallery2, category: "Destination" },
  { src: gallery3, category: "Portraits" },
  { src: gallery4, category: "Weddings" },
  { src: gallery5, category: "Weddings" },
  { src: gallery6, category: "Couple Stories" },
  { src: film1, category: "Destination" },
  { src: film2, category: "Portraits" },
  { src: film3, category: "Couple Stories" },
];

const GalleryPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? images : images.filter((img) => img.category === activeFilter);

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <div className="min-h-screen pt-32 pb-20 px-6 md:px-16">
        <div ref={ref}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-body text-xs tracking-[0.5em] text-accent uppercase text-center mb-4"
          >
            Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl md:text-6xl text-foreground text-center mb-6"
          >
            Our <em>Gallery</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="font-body text-sm text-muted-foreground text-center max-w-xl mx-auto mb-16"
          >
            A curated collection of our most treasured frames — each one a story frozen in time.
          </motion.p>

          <div className="flex justify-center gap-6 mb-16 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300 pb-1 border-b ${
                  activeFilter === cat ? "text-accent border-accent" : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-6xl mx-auto">
            {filtered.map((img, i) => (
              <motion.div
                key={img.src + activeFilter}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.6 }}
                className="mb-4 break-inside-avoid group relative overflow-hidden cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.category}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-500 flex items-end p-6">
                  <p className="font-body text-xs tracking-[0.3em] text-primary-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {img.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default GalleryPage;
