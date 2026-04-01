import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import { stories } from "@/data/stories";

const StoriesPage = () => {
  const featuredStory = stories[0];

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20 md:pb-24">
        <section className="px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1600px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden"
            >
              <div className="aspect-[16/10] md:aspect-[16/8] lg:aspect-[16/5.5]">
                <img
                  src={featuredStory.image}
                  alt="Our Stories portfolio banner"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <div>
                  <p className="font-body text-[11px] uppercase tracking-[0.42em] text-primary-foreground/80">
                    Curated wedding stories
                  </p>
                  <h1 className="mt-4 font-display text-4xl tracking-[0.16em] text-primary-foreground md:text-6xl lg:text-7xl">
                    OUR STORIES
                  </h1>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 pt-10 md:px-6 md:pt-14 lg:px-8 lg:pt-16">
          <div className="mx-auto max-w-6xl">
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
                        <img
                          src={story.image}
                          alt={story.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="pt-5 text-center">
                      <h2 className="font-display text-2xl text-foreground md:text-3xl">
                        {story.couple}
                      </h2>
                      <p className="mt-2 font-body text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                        {story.location}
                      </p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default StoriesPage;
