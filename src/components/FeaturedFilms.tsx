import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";

const films = [
  { image: film1, title: "Wedding Films", subtitle: "Timeless ceremonies captured in cinematic glory" },
  { image: film2, title: "Love Stories", subtitle: "Intimate pre-wedding narratives" },
  { image: film3, title: "Cinematic Stories", subtitle: "Destination weddings as visual poetry" },
];

const FeaturedFilms = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="films" className="px-4 md:px-6 pb-4 md:pb-6">
      <div ref={ref} className="max-w-[1600px] mx-auto">
        {/* Section label */}
        <div className="py-16 md:py-20 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-body text-[11px] tracking-[0.35em] text-muted-foreground uppercase mb-5"
          >
            Featured Work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground"
          >
            Our Films
          </motion.h2>
        </div>

        {/* Editorial asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {/* Large left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-7"
          >
            <FilmCard film={films[0]} aspect="aspect-[4/5]" />
          </motion.div>

          {/* Right column - stacked */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <FilmCard film={films[1]} aspect="aspect-[3/2]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <FilmCard film={films[2]} aspect="aspect-[3/2]" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FilmCard = ({ film, aspect }: { film: typeof films[0]; aspect: string }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden cursor-pointer group ${aspect}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.img
        src={film.image}
        alt={film.title}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.8 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Play icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 bg-primary-foreground/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary-foreground/25">
          <Play className="text-primary-foreground ml-0.5" size={20} fill="currentColor" />
        </div>
      </motion.div>

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h3 className="font-display text-2xl md:text-3xl text-primary-foreground">{film.title}</h3>
        <p className="font-body text-[13px] text-primary-foreground/60 mt-2">{film.subtitle}</p>
      </div>
    </div>
  );
};

export default FeaturedFilms;
