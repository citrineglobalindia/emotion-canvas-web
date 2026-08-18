import { motion, useInView, AnimatePresence } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import PageHero from "@/components/PageHero";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";
import { categoriesOf, useTaggedMedia, type MediaItem } from "@/lib/media";
import SmartImage from "@/components/SmartImage";
import { useSection } from "@/lib/siteContent";
import { defaultsFor } from "@/lib/contentSchema";

const ALL = "All";

/** Shown until an admin tags images `gallery` in Admin → Media. */
const fallbackImages: MediaItem[] = [
  { src: gallery1, category: "Couple Stories" },
  { src: gallery2, category: "Destination" },
  { src: gallery3, category: "Portraits" },
  { src: gallery4, category: "Weddings" },
  { src: gallery5, category: "Weddings" },
  { src: gallery6, category: "Couple Stories" },
  { src: film1, category: "Destination" },
  { src: film2, category: "Portraits" },
  { src: film3, category: "Couple Stories" },
].map(({ src, category }, i) => ({
  id: `fallback-${i}`,
  url: src,
  alt: category,
  caption: category,
  tags: ["gallery", category],
}));

const GalleryPage = () => {
  const ref = useRef(null);
  useInView(ref, { once: true, margin: "-50px" });
  const [activeFilter, setActiveFilter] = useState(ALL);
  const hero = useSection("gallery", "hero", defaultsFor("gallery", "hero"));

  // Admin → Media: tag an image `gallery` to publish it here; any further tag
  // becomes a filter category.
  const { items, managed } = useTaggedMedia("gallery");
  const images = managed ? items : fallbackImages;

  const categories = useMemo(() => [ALL, ...categoriesOf(images)], [images]);
  const filtered =
    activeFilter === ALL
      ? images
      : images.filter((img) => img.tags.some((t) => t === activeFilter));

  const heroImages = hero.image ? [hero.image] : images.slice(0, 3).map((i) => i.url);

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <PageHero
        eyebrow={hero.subheading}
        title={hero.heading ?? "Gallery"}
        tagline={hero.body}
        image={heroImages}
      />
      <div className="bg-background pt-16 md:pt-24 pb-20 px-6 md:px-10">
        <div ref={ref} className="max-w-6xl mx-auto">
          {categories.length > 1 && (
            <div className="flex justify-center gap-2 mb-12 flex-wrap">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveFilter(cat)}
                  className={`font-body text-sm px-5 py-2 rounded-full transition-all duration-300 ${activeFilter === cat ? "bg-accent text-accent-foreground shadow-md" : "bg-secondary text-muted-foreground hover:bg-accent/10"}`}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => (
                <motion.div key={img.id + activeFilter} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="mb-4 break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300">
                  <SmartImage
                    src={img.url}
                    alt={img.alt}
                    width={800}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {img.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
                      <span className="bg-primary-foreground/15 backdrop-blur-md text-primary-foreground font-body text-xs px-3 py-1.5 rounded-full border border-primary-foreground/20">{img.caption}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!filtered.length && (
            <p className="py-16 text-center font-body text-sm text-muted-foreground">
              No photographs in this category yet.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default GalleryPage;
