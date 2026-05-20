import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import PageHero from "@/components/PageHero";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const allFilms = [
  { image: film1, title: "Priya & Arjun", subtitle: "Destination Wedding, Udaipur", category: "Wedding Films" },
  { image: film2, title: "Sarah & Michael", subtitle: "Garden Wedding, Tuscany", category: "Love Stories" },
  { image: film3, title: "Aisha & Ravi", subtitle: "Beach Wedding, Goa", category: "Cinematic Stories" },
  { image: gallery1, title: "Neha & Vikram", subtitle: "Royal Ceremony, Coorg", category: "Wedding Films" },
  { image: gallery5, title: "Emma & James", subtitle: "Lavender Fields, Provence", category: "Love Stories" },
  { image: heroBg, title: "Meera & Sahil", subtitle: "Golden Hour, Jaipur", category: "Cinematic Stories" },
];

const categories = ["All", "Wedding Films", "Love Stories", "Cinematic Stories"];

const FilmsPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = activeFilter === "All" ? allFilms : allFilms.filter((f) => f.category === activeFilter);

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <PageHero
        eyebrow="Visual Storytelling"
        title="Films"
        tagline="Every film is a love letter — a cinematic journey through the most meaningful day of your life."
        image={[film1, gallery5, film2]}
      />
      <div className="bg-background pt-16 md:pt-24 pb-20 px-6 md:px-10">
        <div ref={ref} className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-2 mb-12 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className={`font-body text-sm px-5 py-2 rounded-full transition-all duration-300 ${activeFilter === cat ? "bg-accent text-accent-foreground shadow-md" : "bg-secondary text-muted-foreground hover:bg-accent/10 hover:text-accent"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((film, i) => (
              <motion.div key={film.title} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.1 }}
                className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg">
                  <img src={film.image} alt={film.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent text-accent-foreground font-body text-[10px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full">{film.category}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 bg-primary-foreground/20 backdrop-blur-md rounded-full flex items-center justify-center border border-primary-foreground/30">
                      <Play className="text-primary-foreground ml-0.5" size={18} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl text-primary-foreground font-semibold">{film.title}</h3>
                    <p className="font-body text-sm text-primary-foreground/70 mt-1">{film.subtitle}</p>
                  </div>
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

export default FilmsPage;
