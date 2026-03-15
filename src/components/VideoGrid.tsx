import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const videos = [
  { thumb: film1, title: "Priya & Arjun", location: "Udaipur", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { thumb: film2, title: "Sarah & Michael", location: "Tuscany", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { thumb: film3, title: "Aisha & Ravi", location: "Jaipur", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { thumb: gallery1, title: "Meera & Karan", location: "Goa", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { thumb: gallery2, title: "Anita & Dev", location: "Delhi", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { thumb: gallery4, title: "Neha & Rohan", location: "Kerala", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
];

const VideoGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

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

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {videos.map((video, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.08 * i }}
            className="relative aspect-[4/5] md:aspect-[3/4] cursor-pointer group overflow-hidden bg-background"
            onClick={() => setActiveVideo(i)}
          >
            <img
              src={video.thumb}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Title revealed on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <p className="font-display text-base md:text-lg text-primary-foreground italic">
                {video.title}
              </p>
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary-foreground/60 mt-1">
                {video.location}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen video modal */}
      {activeVideo !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10"
          onClick={() => setActiveVideo(null)}
        >
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            <X size={24} />
          </button>
          <div
            className="w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`${videos[activeVideo].url}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={videos[activeVideo].title}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default VideoGrid;
