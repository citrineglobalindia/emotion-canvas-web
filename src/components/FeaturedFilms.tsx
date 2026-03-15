import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";

const films = [
  { image: film1, title: "Wedding Films", subtitle: "Timeless ceremonies captured in cinematic glory", tag: "Most Popular" },
  { image: film2, title: "Love Stories", subtitle: "Intimate pre-wedding narratives in dreamy locations", tag: "Trending" },
  { image: film3, title: "Cinematic Stories", subtitle: "Destination weddings turned into visual poetry", tag: "New" },
];

const FeaturedFilms = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="films" className="py-24 md:py-32 px-6 md:px-10 bg-warm">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
            className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <Play size={14} />
            <span className="font-body text-xs font-medium uppercase tracking-wider">Featured Work</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
            className="font-display text-4xl md:text-5xl text-foreground">
            Our <em className="text-accent">Films</em>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {films.map((film, i) => (
            <FilmCard key={film.title} film={film} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FilmCard = ({ film, index, isInView }: { film: typeof films[0]; index: number; isInView: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg">
        <motion.img src={film.image} alt={film.title} className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.08 : 1 }} transition={{ duration: 0.6 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-4 left-4">
          <span className="bg-accent text-accent-foreground font-body text-[10px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full">{film.tag}</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3 }}
            className="w-14 h-14 bg-primary-foreground/20 backdrop-blur-md rounded-full flex items-center justify-center border border-primary-foreground/30">
            <Play className="text-primary-foreground ml-0.5" size={18} fill="currentColor" />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-2xl text-primary-foreground font-semibold">{film.title}</h3>
          <p className="font-body text-sm text-primary-foreground/70 mt-1 leading-relaxed">{film.subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedFilms;
