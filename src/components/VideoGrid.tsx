import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const videos = [
  { thumb: film1, title: "Priya & Arjun", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { thumb: film2, title: "Sarah & Michael", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { thumb: film3, title: "Aisha & Ravi", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { thumb: gallery1, title: "Meera & Karan", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { thumb: gallery2, title: "Anita & Dev", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { thumb: gallery4, title: "Neha & Rohan", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
];

const VideoGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="bg-background">
      <div className="py-16 md:py-24 text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="font-body text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-4"
        >
          Our Films
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.2]"
        >
          every frame tells a <em>story</em>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
        {videos.map((video, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1 * i }}
            className="relative aspect-video cursor-pointer group overflow-hidden"
            onClick={() => setPlayingIndex(i)}
          >
            {playingIndex === i ? (
              <iframe
                src={`${video.url}?autoplay=1&rel=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            ) : (
              <>
                <img
                  src={video.thumb}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-primary-foreground/60 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground ml-0.5" />
                  </div>
                  <span className="font-display text-sm md:text-base text-primary-foreground italic opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {video.title}
                  </span>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default VideoGrid;
