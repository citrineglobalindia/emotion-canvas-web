import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X, Play } from "lucide-react";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

type VideoItem = {
  thumb: string;
  title: string;
  location: string;
  /** Self-hosted file served from /public (takes priority over `url`). */
  file?: string;
  /** YouTube/Vimeo embed URL. */
  url?: string;
  /** Portrait (9:16) reel — shown in a taller modal. */
  portrait?: boolean;
};

const videos: VideoItem[] = [
  {
    thumb: "/films/reel-1.jpg",
    title: "Featured Reel",
    location: "Stories by Black & White",
    file: "/films/reel-1.mp4",
    portrait: true,
  },
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

  const active = activeVideo !== null ? videos[activeVideo] : null;

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
            {/* Play icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-background/25 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                <Play size={18} className="text-white translate-x-[1px]" fill="currentColor" />
              </div>
            </div>
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
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10"
          onClick={() => setActiveVideo(null)}
        >
  