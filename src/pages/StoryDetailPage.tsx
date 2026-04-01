import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clapperboard, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { stories } from "@/data/stories";
import NotFound from "./NotFound";

const StoryDetailPage = () => {
  const { slug } = useParams();
  const story = stories.find((entry) => entry.slug === slug);

  if (!story) {
    return <NotFound />;
  }

  const currentIndex = stories.findIndex((entry) => entry.slug === story.slug);
  const previousStory = stories[(currentIndex - 1 + stories.length) % stories.length];
  const nextStory = stories[(currentIndex + 1) % stories.length];
  const relatedStories = stories.filter((entry) => entry.slug !== story.slug).slice(0, 2);

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <main className="min-h-screen overflow-hidden bg-background pt-24">
        <section className="relative px-6 pb-16 md:px-10 lg:px-16">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background" />
          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16">
            <div className="pt-8 md:pt-14 lg:pt-20">
              <Link to="/stories" className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.24em] text-muted-foreground transition-opacity hover:opacity-70">
                <ArrowLeft size={14} /> Back to stories
              </Link>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 font-body text-xs uppercase tracking-[0.28em] text-accent"
              >
                {story.year} · {story.duration}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="mt-4 font-display text-5xl leading-none text-foreground md:text-7xl"
              >
                {story.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mt-4 font-display text-2xl italic text-accent md:text-3xl"
              >
                {story.couple}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-6 inline-flex items-center gap-2 border border-border/70 bg-card/60 px-4 py-3 text-muted-foreground"
              >
                <MapPin size={14} className="text-accent" />
                <span className="font-body text-xs uppercase tracking-[0.18em]">{story.location}</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground"
              >
                {story.intro}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.9 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden border border-border/70 bg-card p-3 shadow-sm">
                <img src={story.image} alt={story.title} className="h-full w-full object-cover" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-8 md:px-10 md:py-12 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-px bg-border/60 md:grid-cols-2 lg:grid-cols-3">
            {story.gallery.map((image, index) => (
              <div key={`${story.slug}-gallery-${index}`} className="bg-background p-3">
                <div className={`overflow-hidden ${index % 3 === 0 ? "aspect-[4/5]" : "aspect-[5/4]"}`}>
                  <img
                    src={image}
                    alt={`${story.title} gallery image ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-16 md:px-10 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="border-t border-border/70 pt-6">
              <p className="font-body text-xs uppercase tracking-[0.28em] text-muted-foreground">Narrative</p>
              <h2 className="mt-4 font-display text-4xl text-foreground md:text-5xl">A chapter told in atmosphere, detail, and feeling.</h2>
            </div>
            <div className="space-y-10">
              {story.moments.map((moment, index) => (
                <motion.article
                  key={moment.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.75 }}
                  className="border-b border-border/60 pb-8"
                >
                  <p className="font-body text-[10px] uppercase tracking-[0.26em] text-muted-foreground">Sequence 0{index + 1}</p>
                  <h3 className="mt-3 font-display text-3xl text-foreground">{moment.title}</h3>
                  <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-muted-foreground md:text-lg">{moment.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl border border-border/70 bg-card/40 p-4 md:p-6">
            <div className="mb-6 flex items-center gap-3">
              <Clapperboard size={18} className="text-accent" />
              <div>
                <p className="font-body text-xs uppercase tracking-[0.24em] text-muted-foreground">Embedded film</p>
                <h2 className="font-display text-3xl text-foreground md:text-4xl">Watch the full story unfold</h2>
              </div>
            </div>
            <div className="aspect-video overflow-hidden border border-border/70 bg-secondary">
              <iframe
                src={`${story.videoUrl}?rel=0`}
                title={`${story.title} film`}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 px-6 py-20 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 grid gap-6 border-b border-border/60 pb-10 md:grid-cols-2">
              <Link to={`/stories/${previousStory.slug}`} className="group border border-border/70 bg-card/30 p-6 transition-colors hover:bg-card/60">
                <p className="font-body text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Previous story</p>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-3xl text-foreground md:text-4xl">{previousStory.title}</h3>
                    <p className="mt-2 font-display text-lg italic text-accent md:text-xl">{previousStory.couple}</p>
                    <p className="mt-3 font-body text-xs uppercase tracking-[0.18em] text-muted-foreground">{previousStory.location}</p>
                  </div>
                  <ArrowLeft size={18} className="mt-2 text-accent transition-transform duration-300 group-hover:-translate-x-1" />
                </div>
              </Link>

              <Link to={`/stories/${nextStory.slug}`} className="group border border-border/70 bg-card/30 p-6 text-right transition-colors hover:bg-card/60">
                <p className="font-body text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Next story</p>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <ArrowRight size={18} className="mt-2 text-accent transition-transform duration-300 group-hover:translate-x-1 md:order-2" />
                  <div className="md:order-1 md:ml-auto">
                    <h3 className="font-display text-3xl text-foreground md:text-4xl">{nextStory.title}</h3>
                    <p className="mt-2 font-display text-lg italic text-accent md:text-xl">{nextStory.couple}</p>
                    <p className="mt-3 font-body text-xs uppercase tracking-[0.18em] text-muted-foreground">{nextStory.location}</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.28em] text-muted-foreground">Continue exploring</p>
                <h2 className="mt-3 font-display text-4xl text-foreground md:text-5xl">More love stories</h2>
              </div>
              <Link to="/stories" className="hidden font-body text-xs uppercase tracking-[0.24em] text-accent md:inline-flex">
                View all stories
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {relatedStories.map((entry) => (
                <Link key={entry.slug} to={`/stories/${entry.slug}`} className="group border border-border/70 bg-card/30 p-3 transition-colors hover:bg-card/60">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={entry.image} alt={entry.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                  </div>
                  <div className="px-2 py-5">
                    <p className="font-body text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{entry.location}</p>
                    <h3 className="mt-3 font-display text-3xl text-foreground">{entry.title}</h3>
                    <p className="mt-2 font-display text-xl italic text-accent">{entry.couple}</p>
                    <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">{entry.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.24em] text-accent">
                      Read story <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link to="/#contact">
                <Button variant="accent">Tell Us Your Story <ArrowRight size={16} /></Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default StoryDetailPage;