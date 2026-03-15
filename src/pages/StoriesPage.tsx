import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen pt-28 pb-0">
      <div className="px-6 md:px-10 mb-20 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
          <BookOpen size={14} />
          <span className="font-body text-xs font-medium uppercase tracking-wider">Love Letters in Motion</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="font-display text-4xl md:text-6xl text-foreground mb-4">Our <em className="text-accent">Stories</em></motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="font-body text-muted-foreground max-w-xl mx-auto">Behind every film is a love story worth telling.</motion.p>
      </div>

      {stories.map((story, i) => (
        <StoryBlock key={story.title} story={story} index={i} reversed={i % 2 !== 0} />
      ))}

      <div className="relative py-32 md:py-44 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-accent/5" />
        <div className="relative z-10 text-center px-6">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl text-foreground leading-tight">
            Every story deserves<br /><em className="text-accent">to be remembered.</em>
          </motion.h2>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
            className="mt-10">
            <Link to="/#contact"><Button variant="accent">Tell Us Your Story <ArrowRight size={16} /></Button></Link>
          </motion.div>
        </div>
      </div>
    </div>
    <Footer />
  </PageTransition>
);

const StoryBlock = ({ story, reversed }: { story: typeof stories[0]; index: number; reversed: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={`grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]`}>
      <motion.div initial={{ opacity: 0, x: reversed ? 30 : -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}
        className={`relative overflow-hidden ${reversed ? "lg:order-2" : ""}`}>
        <img src={story.image} alt={story.title} className="w-full h-full object-cover min-h-[400px]" />
      </motion.div>
      <motion.div initial={{ opacity: 0, x: reversed ? -30 : 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
        className={`flex flex-col justify-center p-10 md:p-16 lg:p-20 ${reversed ? "lg:order-1" : ""}`}>
        <span className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1.5 rounded-full w-fit mb-6">
          <span className="font-body text-[10px] font-medium uppercase tracking-wider">{story.location}</span>
        </span>
        <h3 className="font-display text-3xl md:text-4xl text-foreground mb-2">{story.title}</h3>
        <p className="font-display text-lg text-accent italic mb-6">{story.couple}</p>
        <p className="font-body text-muted-foreground leading-relaxed">{story.excerpt}</p>
      </motion.div>
    </div>
  );
};

export default StoriesPage;
