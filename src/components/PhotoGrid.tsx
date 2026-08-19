import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";
import photo5 from "@/assets/photo-5.jpg";
import photo6 from "@/assets/photo-6.jpg";
import photo7 from "@/assets/photo-7.jpg";
import photo8 from "@/assets/photo-8.jpg";
import { sizedImageUrl } from "@/lib/media";
import { useSectionList } from "@/lib/siteContent";

type Photo = { url: string; alt: string };

/** Shown until an admin adds photographs in Admin → Home page. */
const fallbackPhotos: Photo[] = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8].map(
  (src, i) => ({ url: src, alt: `Wedding photo ${i + 1}` }),
);

const ParallaxPhoto = ({
  src,
  alt,
  index,
  progress,
}: {
  src: string;
  alt: string;
  index: number;
  progress: MotionValue<number>;
}) => {
  // Alternate the direction so neighbouring photos drift apart slightly, which
  // reads the same as before but needs only the one shared scroll subscription.
  const drift = index % 2 === 0 ? ["-8%", "8%"] : ["-5%", "5%"];
  const y = useTransform(progress, [0, 1], drift);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.08 * index }}
      className="aspect-[3/4] overflow-hidden group cursor-pointer"
    >
      <motion.img
        src={sizedImageUrl(src, 700)}
        alt={alt}
        className="w-full h-[120%] object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ y }}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          // Fall back to the original if Supabase declined to transform it.
          const img = e.currentTarget;
          if (img.src !== src) img.src = src;
        }}
      />
    </motion.div>
  );
};

const PhotoGrid = () => {
  const ref = useRef(null);
  // One scroll subscription for the whole strip. Each photo used to open its
  // own, so a single scroll frame triggered eight separate layout
  // measurements — a steady source of stutter on slower machines.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const { items: photos } = useSectionList<Photo>("home", "photo", fallbackPhotos, (block) => ({
    url: block.image_url ?? "",
    alt: block.heading?.trim() || "Wedding photograph",
  }));

  const visible = photos.filter((p) => p.url);
  if (!visible.length) return null;

  return (
    <section ref={ref}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {visible.map((photo, i) => (
          <ParallaxPhoto
            key={photo.url}
            src={photo.url}
            alt={photo.alt}
            index={i}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
};

export default PhotoGrid;
