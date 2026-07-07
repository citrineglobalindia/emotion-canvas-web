import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const PROFILE_URL = "https://www.instagram.com/storiesby_black_and_white";

// Shown until an admin adds photos in Admin → Instagram (falls back to these).
const fallbackImages: FeedItem[] = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6].map(
  (src) => ({ src, href: PROFILE_URL }),
);

type FeedItem = { src: string; href: string };

const InstagramFeed = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [images, setImages] = useState<FeedItem[]>(fallbackImages);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("bw_site_content")
        .select("image_url, cta_href")
        .eq("page_key", "home")
        .eq("section_key", "instagram")
        .eq("published", true)
        .order("sort_order");
      if (!active) return;
      const items = (data ?? [])
        .filter((r) => r.image_url)
        .map((r) => ({ src: r.image_url as string, href: r.cta_href || PROFILE_URL }));
      if (!error && items.length) setImages(items);
    })();
    return () => {
      active = false;
    };
  }, []);

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
            Follow Along
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display text-3xl md:text-5xl text-foreground"
        >
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground transition-colors"
          >
            @storiesby_black_and_white
          </a>
        </motion.h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-0">
        {images.map((item, i) => (
          <motion.a
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.08 * i }}
            className="aspect-square overflow-hidden group relative"
          >
            <img
              src={item.src}
              alt={`Instagram post ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
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
