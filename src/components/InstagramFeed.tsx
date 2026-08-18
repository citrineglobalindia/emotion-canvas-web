import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import { useSection, useSectionList } from "@/lib/siteContent";
import { defaultsFor } from "@/lib/contentSchema";
import { useSiteSettings } from "@/lib/siteSettings";
import SmartImage from "@/components/SmartImage";

type FeedItem = { src: string; href: string };

const fallbackImages = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

const InstagramFeed = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const settings = useSiteSettings();
  const intro = useSection("home", "instagram-intro", {
    ...defaultsFor("home", "instagram-intro"),
    heading: settings.instagramHandle,
    ctaHref: settings.instagramUrl,
  });
  const profileUrl = intro.ctaHref ?? settings.instagramUrl;

  // Tiles are managed in Admin → Instagram (rows of home/instagram).
  const { items: images } = useSectionList<FeedItem>(
    "home",
    "instagram",
    fallbackImages.map((src) => ({ src, href: profileUrl })),
    (block) => ({ src: block.image_url ?? "", href: block.cta_href?.trim() || profileUrl }),
  );

  const tiles = images.filter((item) => item.src);

  return (
    <section ref={ref} className="bg-warm py-20 md:py-28">
      <div className="text-center px-6 mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Instagram size={18} className="text-foreground" />
          <span className="font-body text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
            {intro.subheading}
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display text-3xl md:text-5xl text-foreground"
        >
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground transition-colors"
          >
            {intro.heading}
          </a>
        </motion.h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-0">
        {tiles.map((item, i) => (
          <motion.a
            key={`${item.src}-${i}`}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.08 * i }}
            className="aspect-square overflow-hidden group relative"
          >
            <SmartImage
              src={item.src}
              alt={`Instagram post ${i + 1}`}
              width={400}
              sizes="(min-width: 768px) 17vw, 33vw"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <Instagram
                size={24}
                className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default InstagramFeed;
