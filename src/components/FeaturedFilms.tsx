import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";

const films = [
  { image: film1, title: "Wedding Films", subtitle: "Timeless ceremonies" },
  { image: film2, title: "Love Stories", subtitle: "Intimate narratives" },
  { image: film3, title: "Cinematic Stories", subtitle: "Emotional journeys" },
];

const FeaturedFilms = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="films" className="py-32 px-6 md:px-16">
      <div ref={ref}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="font-body text-xs tracking-[0.5em] text-accent uppercase text-center mb-4"
        >
          Featured Work
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display text-3xl md:text-5xl text-foreground text-center mb-20"
        >
          Our <em>Films</em>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
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
      </div>
    </motion.div>
  );
};

export default FeaturedFilms;
