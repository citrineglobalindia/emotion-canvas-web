import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, MapPin, Sparkles } from "lucide-react";
import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";
import film1 from "@/assets/film-1.jpg";

const stories = [
  { image: story1, title: "The Palace Affair", couple: "Priya & Arjun", excerpt: "A royal love story set against the golden corridors of a Rajasthani palace. Every glance, every touch — preserved in cinematic glory.", location: "Udaipur, Rajasthan" },
  { image: story2, title: "Through the Door", couple: "Sarah & Michael", excerpt: "Two souls stepping into a new chapter. A sunset wedding bathed in golden light, where time seemed to stand still.", location: "Tuscany, Italy" },
  { image: film1, title: "Shores of Forever", couple: "Aisha & Ravi", excerpt: "The traditions witnessed their vows. A colorful ceremony surrounded by love, where families became one.", location: "Kerala, India" },
];

const StoriesPage = () => (
  <PageTransition>
    <FilmGrain />
    <Header />
    <main className="min-h-screen overflow-hidden pt-24">
      <section className="relative px-6 pb-16 md:px-10 md:pb-24 lg:px-16">
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-gradient-to-b from-secondary via-background to-background" />
        <div className="relative mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="pt-10 md:pt-16 lg:pt-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mb-6 inline-flex items-center gap-2 border border-border/80 bg-background/80 px-4 py-2 text-accent backdrop-blur-sm"
            >
              <BookOpen size={14} />
              <span className="font-body text-xs font-medium uppercase tracking-[0.24em]">Love Letters in Motion</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-4xl font-display text-5xl leading-none text-foreground md:text-7xl lg:text-[6.5rem]"
            >
              Our <em className="text-accent">Stories</em>
              <span className="mt-3 block text-2xl font-normal leading-tight text-muted-foreground md:text-3xl lg:max-w-2xl">
                Behind every film is a living archive of glances, vows, movement, and atmosphere.
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8 }}
              className="mt-10 grid max-w-2xl gap-4 border-y border-border/70 py-6 md:grid-cols-3"
            >
              <StoryStat label="Featured stories" value={`${stories.length}`} />
              <StoryStat label="Destinations" value="3 countries" />
              <StoryStat label="Approach" value="Cinematic" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden border border-border/70 bg-card p-3 shadow-sm">
              <img src={story2} alt="Featured wedding story" className="h-full w-full object-cover" />
              <div className="absolute inset-3 bg-gradient-to-t from-primary/65 via-transparent to-transparent" />
              <div className="absolute inset-x-8 bottom-8 text-left text-primary-foreground">
                <p className="font-body text-xs uppercase tracking-[0.24em] text-primary-foreground/80">Featured frame</p>
                <h2 className="mt-3 max-w-sm font-display text-3xl leading-tight md:text-4xl">Stories that feel like stills from a timeless film.</h2>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-0 max-w-xs border border-border bg-background/95 p-5 backdrop-blur-sm md:-left-10">
              <div className="mb-3 inline-flex items-center gap-2 text-accent">
                <Sparkles size={14} />
                <span className="font-body text-[10px] font-medium uppercase tracking-[0.24em]">Editorial note</span>
              </div>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">
                Each chapter is paced with intimacy, texture, and a sense of place so the film feels personal long after the day ends.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-12 md:space-y-20">
          {stories.map((story, i) => (
            <StoryBlock key={story.title} story={story} index={i} reversed={i % 2 !== 0} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border/60 px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-card" />
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-body text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            Your chapter, beautifully held
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-5 font-display text-4xl leading-tight text-foreground md:text-6xl"
          >
            Every story deserves <br className="hidden md:block" />
            <em className="text-accent">to be remembered.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-muted-foreground"
          >
            If you want your wedding captured with atmosphere, elegance, and emotional detail, let’s shape a film that feels unmistakably yours.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="mt-10"
          >
            <Link to="/#contact">
              <Button variant="accent">Tell Us Your Story <ArrowRight size={16} /></Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
    <Footer />
  </PageTransition>
);

const StoryStat = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1 text-left">
    <p className="font-body text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
    <p className="font-display text-2xl text-foreground md:text-3xl">{value}</p>
  </div>
);

const StoryBlock = ({ story, reversed }: { story: typeof stories[0]; index: number; reversed: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <article ref={ref} className="grid grid-cols-1 overflow-hidden border border-border/70 bg-card/40 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, x: reversed ? 30 : -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}
        className={`relative min-h-[24rem] overflow-hidden ${reversed ? "lg:order-2" : ""}`}>
        <img src={story.image} alt={story.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-transparent to-transparent" />
      </motion.div>
      <motion.div initial={{ opacity: 0, x: reversed ? -30 : 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
        className={`flex flex-col justify-center p-8 md:p-12 lg:p-16 ${reversed ? "lg:order-1" : ""}`}>
        <div className="mb-8 flex items-start justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Featured story</p>
            <h3 className="mt-3 font-display text-3xl text-foreground md:text-5xl">{story.title}</h3>
          </div>
          <span className="font-display text-5xl leading-none text-border md:text-6xl">0{stories.findIndex((item) => item.title === story.title) + 1}</span>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2 border border-border/70 bg-background px-3 py-1.5">
            <MapPin size={14} className="text-accent" />
            <span className="font-body text-[11px] uppercase tracking-[0.18em]">{story.location}</span>
          </span>
          <p className="font-display text-xl italic text-accent md:text-2xl">{story.couple}</p>
        </div>

        <p className="max-w-xl font-body text-base leading-relaxed text-muted-foreground md:text-lg">{story.excerpt}</p>
      </motion.div>
    </article>
  );
};

export default StoriesPage;
