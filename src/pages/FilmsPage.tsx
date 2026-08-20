import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import PageHero from "@/components/PageHero";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import { useDemoContentAllowed, useSection, useSectionList } from "@/lib/siteContent";
import { defaultsFor } from "@/lib/contentSchema";
import SmartImage from "@/components/SmartImage";

const ALL = "All";

type Film = {
  image: string;
  title: string;
  subtitle: string;
  category: string;
  href?: string;
};

/** Shown until an admin adds films in Admin → Site content → Films page. */
const fallbackFilms: Film[] = [
  { image: film1, title: "Priya & Arjun", subtitle: "Destination Wedding, Udaipur", category: "Wedding Films" },
  { image: film2, title: "Sarah & Michael", subtitle: "Garden Wedding, Tuscany", category: "Love Stories" },
  { image: film3, title: "Aisha & Ravi", subtitle: "Beach Wedding, Goa", category: "Cinematic Stories" },
  { image: gallery1, title: "Neha & Vikram", subtitle: "Royal Ceremony, Coorg", category: "Wedding Films" },
  { image: gallery5, title: "Emma & James", subtitle: "Lavender Fields, Provence", category: "Love Stories" },
  { image: heroBg, title: "Meera & Sahil", subtitle: "Golden Hour, Jaipur", category: "Cinematic Stories" },
];

const isSelfHosted = (href: string) => href.startsWith("/") || /\.(mp4|webm|mov)$/i.test(href);

const FilmsPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [playing, setPlaying] = useState<Film | null>(null);
  const hero = useSection("films", "hero", defaultsFor("films", "hero"));

  // Films managed on this page directly…
  const { items: pageFilms } = useSectionList<Film>("films", "film", [], (block) => ({
    image: block.image_url?.trim() || "",
    title: block.heading?.trim() || "",
    subtitle: block.subheading?.trim() || "",
    category: block.cta_label?.trim() || "",
    href: block.cta_href?.trim() || undefined,
  }));

  // …plus the home page films grid, so a film added there appears here too
  // without having to be entered twice.
  const { items: homeFilms } = useSectionList<Film>("home", "film", [], (block) => ({
    image: block.image_url?.trim() || "",
    title: block.heading?.trim() || "",
    subtitle: block.subheading?.trim() || "",
    category: block.cta_label?.trim() || "",
    href: block.cta_href?.trim() || undefined,
  }));

  const demoAllowed = useDemoContentAllowed();

  const allFilms = useMemo(() => {
    // Films-page entries first (they carry categories); then any home film not
    // already present, matched by title + image so the same film entered in
    // both places shows once.
    const seen = new Set(pageFilms.map((f) => `${f.title.toLowerCase()}|${f.image}`));
    const merged = [
      ...pageFilms,
      ...homeFilms.filter((f) => !seen.has(`${f.title.toLowerCase()}|${f.image}`)),
    ].filter((f) => f.image);
    if (merged.length) return merged;
    return demoAllowed ? fallbackFilms : [];
  }, [pageFilms, homeFilms, demoAllowed]);

  const categories = useMemo(() => {
    const set = new Set(allFilms.map((f) => f.category).filter(Boolean));
    return [ALL, ...Array.from(set)];
  }, [allFilms]);

  const filtered = activeFilter === ALL ? allFilms : allFilms.filter((f) => f.category === activeFilter);
  const heroImages = hero.image ? [hero.image] : [film1, gallery5, film2];

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <PageHero
        eyebrow={hero.subheading}
        title={hero.heading ?? "Films"}
        tagline={hero.body}
        image={heroImages}
      />
      <div className="bg-background pt-16 md:pt-24 pb-20 px-6 md:px-10">
        <div ref={ref} className="max-w-7xl mx-auto">
          {categories.length > 1 && (
            <div className="flex justify-center gap-2 mb-12 flex-wrap">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveFilter(cat)}
                  className={`font-body text-sm px-5 py-2 rounded-full transition-all duration-300 ${activeFilter === cat ? "bg-accent text-accent-foreground shadow-md" : "bg-secondary text-muted-foreground hover:bg-accent/10 hover:text-accent"}`}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((film, i) => (
              <motion.div key={`${film.title}-${i}`} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.1 }}
                onClick={() => film.href && setPlaying(film)}
                className={film.href ? "group cursor-pointer" : "group"}>
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg">
                  <SmartImage src={film.image} alt={film.title} width={700} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {film.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-accent-foreground font-body text-[10px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full">{film.category}</span>
                    </div>
                  )}
                  {film.href && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 bg-primary-foreground/20 backdrop-blur-md rounded-full flex items-center justify-center border border-primary-foreground/30">
                        <Play className="text-primary-foreground ml-0.5" size={18} fill="currentColor" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl text-primary-foreground font-semibold">{film.title}</h3>
                    <p className="font-body text-sm text-primary-foreground/70 mt-1">{film.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {!filtered.length && (
            <p className="py-16 text-center font-body text-sm text-muted-foreground">
              No films in this category yet.
            </p>
          )}
        </div>
      </div>

      {playing?.href && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-10"
          onClick={() => setPlaying(null)}
        >
          <button
            onClick={() => setPlaying(null)}
            className="absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            aria-label="Close film"
          >
            <X size={24} />
          </button>
          <div className="aspect-video w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {isSelfHosted(playing.href) ? (
              <video src={playing.href} className="h-full w-full bg-black object-contain" controls autoPlay playsInline />
            ) : (
              <iframe
                src={`${playing.href}?autoplay=1&rel=0`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={playing.title}
              />
            )}
          </div>
        </div>
      )}
      <Footer />
    </PageTransition>
  );
};

export default FilmsPage;
