import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import { Button } from "@/components/ui/button";
import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";
import film1 from "@/assets/film-1.jpg";

const stories = [
  {
    image: story1,
    title: "The Palace Affair",
    couple: "Priya & Arjun",
    excerpt: "A royal love story set against the golden corridors of a 16th-century Rajasthani palace. Every glance, every touch — preserved in cinematic glory.",
    location: "Udaipur, Rajasthan",
  },
  {
    image: story2,
    title: "Through the Door",
    couple: "Sarah & Michael",
    excerpt: "Two souls stepping into a new chapter. A Tuscan villa wedding bathed in afternoon light, where time seemed to stand still.",
    location: "Tuscany, Italy",
  },
  {
    image: film1,
    title: "Shores of Forever",
    couple: "Aisha & Ravi",
    excerpt: "The ocean witnessed their vows. A barefoot ceremony on the shores of Goa, where the waves applauded their love.",
    location: "Goa, India",
  },
];

const StoriesPage = () => {
  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <div className="min-h-screen pt-32 pb-20">
        {/* Hero */}
        <div className="px-6 md:px-16 mb-24">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-body text-xs tracking-[0.5em] text-accent uppercase text-center mb-4"
          >
            Love Letters in Motion
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-4xl md:text-6xl text-foreground text-center mb-6"
          >
            Our <em>Stories</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-body text-sm text-muted-foreground text-center max-w-xl mx-auto"
          >
            Behind every film is a love story worth telling. These are some of the journeys we've had the honor to capture.
          </motion.p>
        </div>

        {/* Stories */}
        {stories.map((story, i) => (
          <StoryBlock key={story.title} story={story} index={i} reversed={i % 2 !== 0} />
        ))}

        {/* Cinematic quote */}
        <div className="py-32 md:py-48 px-6 md:px-16 bg-secondary">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="font-display text-4xl md:text-6xl text-foreground leading-tight"
            >
              Every story deserves
              <br />
              <em>to be remembered.</em>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <Link to="/#contact">
                <Button variant="hero">Tell Us Your Story</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

const StoryBlock = ({ story, index, reversed }: { story: typeof stories[0]; index: number; reversed: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={`grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] ${reversed ? "" : ""}`}>
      <motion.div
        initial={{ opacity: 0, x: reversed ? 40 : -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className={`relative overflow-hidden ${reversed ? "lg:order-2" : ""}`}
      >
        <img src={story.image} alt={story.title} className="w-full h-full object-cover min-h-[400px]" />
        <div className="absolute inset-0 bg-background/20" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: reversed ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`flex flex-col justify-center p-10 md:p-20 ${reversed ? "lg:order-1" : ""}`}
      >
        <p className="font-body text-xs tracking-[0.4em] text-accent uppercase mb-6">{story.location}</p>
        <h3 className="font-display text-3xl md:text-4xl text-foreground mb-2">{story.title}</h3>
        <p className="font-display text-lg text-foreground/60 italic mb-8">{story.couple}</p>
        <p className="font-body text-muted-foreground leading-relaxed mb-8">{story.excerpt}</p>
        <div className="w-16 h-px bg-accent" />
      </motion.div>
    </div>
  );
};

export default StoriesPage;
