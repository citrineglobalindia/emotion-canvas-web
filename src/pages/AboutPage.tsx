import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Award, Film, Heart, Globe, ArrowRight, type LucideIcon } from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import heroImg2 from "@/assets/hero-2.jpg";
import { useSection, useSectionList } from "@/lib/siteContent";
import { defaultsFor } from "@/lib/contentSchema";
import { RichText, Paragraphs } from "@/components/RichText";

type Stat = { value: string; label: string; icon: string };

const ICONS: Record<string, LucideIcon> = {
  film: Film,
  heart: Heart,
  globe: Globe,
  award: Award,
};

const fallbackStats: Stat[] = [
  { icon: "film", value: "200+", label: "Films Crafted" },
  { icon: "heart", value: "500+", label: "Love Stories" },
  { icon: "globe", value: "15+", label: "Countries" },
  { icon: "award", value: "30+", label: "Awards" },
];

const AboutPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const hero = useSection("about", "hero", defaultsFor("about", "hero"));
  const story = useSection("about", "story", {
    ...defaultsFor("about", "story"),
    image: aboutTeam,
  });
  const cta = useSection("about", "cta", { ...defaultsFor("about", "cta"), image: heroBg });
  const { items: stats } = useSectionList<Stat>("about", "stat", fallbackStats, (block) => ({
    value: block.heading?.trim() || "",
    label: block.subheading?.trim() || "",
    icon: String((block.metadata as Record<string, unknown>)?.icon ?? "award"),
  }));

  const heroImages = hero.image ? [hero.image] : [aboutTeam, heroBg, heroImg2];

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <PageHero
        eyebrow={hero.subheading}
        title={hero.heading ?? "The Studio"}
        tagline={hero.body}
        image={heroImages}
      />
      <div className="min-h-screen pt-16 md:pt-24 pb-0">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}
            className="relative overflow-hidden lg:rounded-r-3xl">
            <img src={story.image} alt="Our filmmaker" className="w-full h-full object-cover min-h-[400px]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center p-10 md:p-16 lg:p-20">
            {story.subheading && (
              <span className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1.5 rounded-full w-fit mb-6">
                <span className="font-body text-[10px] font-medium uppercase tracking-wider">{story.subheading}</span>
              </span>
            )}
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8 leading-tight">
              <RichText text={story.heading} />
            </h2>
            <div className="space-y-5 font-body text-muted-foreground leading-relaxed">
              <Paragraphs text={story.body} />
            </div>
          </motion.div>
        </div>

        {stats.length > 0 && (
          <div className="py-20 px-6 md:px-10 bg-warm">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => {
                const Icon = ICONS[stat.icon.toLowerCase()] ?? Award;
                return (
                  <motion.div key={`${stat.label}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:border-accent/30 transition-all duration-300 group">
                    <Icon className="text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" size={22} strokeWidth={1.5} />
                    <p className="font-display text-3xl md:text-4xl text-foreground font-semibold">{stat.value}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          <img src={cta.image} alt="Cinematic backdrop" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center px-6 py-20">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl text-primary-foreground mb-8 leading-tight">
              <RichText text={cta.heading} />
            </motion.h2>
            {cta.ctaLabel && cta.ctaHref && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                <Link to={cta.ctaHref}><Button variant="accent">{cta.ctaLabel} <ArrowRight size={16} /></Button></Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default AboutPage;
