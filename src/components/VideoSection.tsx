import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play } from "lucide-react";

interface VideoSectionProps {
  /** YouTube or Vimeo embed URL. Replace with your own! */
  videoUrl?: string;
}

const VideoSection = ({ videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ" }: VideoSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [playing, setPlaying] = useState(false);

  return (
    <section ref={ref} className="bg-background">
      {/* Section header */}
      <div className="py-16 md:py-24 text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="font-body text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-4"
        >
          Our Showreel
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

      {/* Video embed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative w-full aspect-video cursor-pointer"
        onClick={() => setPlaying(true)}
      >
        {!playing ? (
          <>
            {/* Thumbnail overlay */}
            <div className="absolute inset-0 bg-foreground/10 z-10" />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary-foreground/80 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-transform duration-300 hover:scale-110">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1" />
              </div>
            </div>
            {/* Use the video thumbnail or a placeholder image */}
            <iframe
              src={videoUrl}
              className="w-full h-full pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video showreel"
              loading="lazy"
            />
          </>
        ) : (
          <iframe
            src={`${videoUrl}?autoplay=1&rel=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video showreel"
          />
        )}
      </motion.div>
    </section>
  );
};

export default VideoSection;
