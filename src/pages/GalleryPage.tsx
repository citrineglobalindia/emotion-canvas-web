import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Grid3X3 } from "lucide-react";
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
  { src: gallery1, category: "Couple Stories" }, { src: gallery2, category: "Destination" },
  { src: gallery3, category: "Portraits" }, { src: gallery4, category: "Weddings" },
  { src: gallery5, category: "Weddings" }, { src: gallery6, category: "Couple Stories" },
  { src: film1, category: "Destination" }, { src: film2, category: "Portraits" },
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
      <div className="min-h-screen pt-28 pb-20 px-6 md:px-10">
        <div ref={ref} className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
              className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
              <Grid3X3 size={14} />
              <span className="font-body text-xs font-medium uppercase tracking-wider">Portfolio</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-6xl text-foreground mb-4">Our <em className="text-accent">Gallery</em></motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}
              className="font-body text-muted-foreground max-w-xl mx-auto">A curated collection of our most treasured frames — each one a story frozen in time.</motion.p>
          </div>

          <div className="flex justify-center gap-2 mb-12 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className={`font-body text-sm px-5 py-2 rounded-full transition-all duration-300 ${activeFilter === cat ? "bg-accent text-accent-foreground shadow-md" : "bg-secondary text-muted-foreground hover:bg-accent/10"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => (
                <motion.div key={img.src + activeFilter} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="mb-4 break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img src={img.src} alt={img.category} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
                    <span className="bg-primary-foreground/15 backdrop-blur-md text-primary-foreground font-body text-xs px-3 py-1.5 rounded-full border border-primary-foreground/20">{img.category}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default GalleryPage;
