import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const allFilms = [
  { image: film1, title: "Priya & Arjun", subtitle: "Destination Wedding, Udaipur", category: "Wedding Films" },
  { image: film2, title: "Sarah & Michael", subtitle: "Villa Wedding, Tuscany", category: "Love Stories" },
  { image: film3, title: "Aisha & Ravi", subtitle: "Royal Wedding, Jaipur", category: "Cinematic Stories" },
  { image: gallery1, title: "Neha & Vikram", subtitle: "Forest Ceremony, Coorg", category: "Wedding Films" },
  { image: gallery5, title: "Emma & James", subtitle: "Ballroom Wedding, London", category: "Love Stories" },
  { image: heroBg, title: "Meera & Sahil", subtitle: "Sunset Ceremony, Goa", category: "Cinematic Stories" },
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
      <div className="min-h-screen pt-32 pb-20 px-6 md:px-16">
        <div ref={ref}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-body text-xs tracking-[0.5em] text-accent uppercase text-center mb-4"
          >
            Our Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl md:text-6xl text-foreground text-center mb-6"
          >
            Our <em>Films</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="font-body text-sm text-muted-foreground text-center max-w-xl mx-auto mb-16"
          >
            Every film is a love letter — a cinematic journey through the most meaningful day of your life.
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {filtered.map((film, i) => (
              <FilmCard key={film.title} film={film} index={i} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

const FilmCard = ({ film, index, isInView }: { film: typeof allFilms[0]; index: number; isInView: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.1 + index * 0.15 }}
      className="relative group cursor-pointer overflow-hidden aspect-[3/4]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.img
        src={film.image}
        alt={film.title}
        className="w-full h-full object-cover"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.6 }}
      />
      <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/60 transition-colors duration-500" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-16 h-16 border border-primary-foreground/50 flex items-center justify-center mb-6"
        >
          <Play className="text-primary-foreground" size={20} />
        </motion.div>
        <h3 className="font-display text-2xl text-primary-foreground">{film.title}</h3>
        <p className="font-body text-xs tracking-[0.3em] text-primary-foreground/60 uppercase mt-2">{film.subtitle}</p>
        <p className="font-body text-[10px] tracking-[0.2em] text-accent uppercase mt-4">{film.category}</p>
      </div>
    </motion.div>
  );
};

export default FilmsPage;
