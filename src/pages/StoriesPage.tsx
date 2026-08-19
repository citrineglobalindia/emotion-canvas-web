import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import PageHero from "@/components/PageHero";
import { usePublicStories } from "@/lib/stories";
import { useSection } from "@/lib/siteContent";
import { defaultsFor } from "@/lib/contentSchema";
import SmartImage from "@/components/SmartImage";

const StoriesPage = () => {
  const { stories, isLoading } = usePublicStories();
  const hero = useSection("stories", "hero", defaultsFor("stories", "hero"));

  const heroImages = hero.image
    ? [hero.image]
    : stories.slice(0, 3).map((s) => s.image);

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <PageHero
        eyebrow={hero.subheading}
        title={hero.heading ?? "Stories"}
        tagline={hero.body}
        image={heroImages}
      />
      <main className="min-h-screen bg-background pb-20 md:pb-24">
        <section className="px-4 pt-16 md:px-6 md:pt-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {isLoading && !stories.length ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[2/3] bg-secondary" />
                    <div className="mx-auto mt-5 h-6 w-40 bg-secondary" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
                {stories.map((story, index) => (
                  <motion.article
                    key={story.slug}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: index * 0.08 }}
                  >
                    <Link to={`/stories/${story.slug}`} className="group block">
                      <div className="overflow-hidden bg-card">
                        <div className="aspect-[2/3] overflow-hidden">
                          <SmartImage
                            src={story.image}
                            alt={story.title}
                            width={600}
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        </div>
                      </div>
                      <div className="pt-5 text-center">
                        <h2 className="font-display text-2xl text-foreground md:text-3xl">
                          {story.couple}
                        </h2>
                        {story.location && (
                          <p className="mt-2 font-body text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                            {story.location}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default StoriesPage;
