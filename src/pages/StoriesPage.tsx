import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import PageHero from "@/components/PageHero";
import { stories } from "@/data/stories";

const StoriesPage = () => {
  const heroImages = stories.slice(0, 3).map((s) => s.image);

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <PageHero
        eyebrow="Curated Wedding Stories"
        title="Stories"
        tagline="Real couples. Real moments. Each chapter shaped by the people who lived it."
        image={heroImages}
      />
      <main className="min-h-screen bg-background pb-20 md:pb-24">
        <section className="px-4 pt-16 md:px-6 md:pt-24 lg:px-8">
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
