import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import { Button } from "@/components/ui/button";
import { Award, Film, Heart, Globe } from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { icon: Film, value: "200+", label: "Films Crafted" },
  { icon: Heart, value: "500+", label: "Love Stories" },
  { icon: Globe, value: "15+", label: "Countries" },
  { icon: Award, value: "30+", label: "Awards" },
];

const AboutPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <div className="min-h-screen pt-32 pb-0">
        {/* Hero */}
        <div className="px-6 md:px-16 mb-24 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-body text-xs tracking-[0.5em] text-accent uppercase mb-4"
          >
            Who We Are
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-6"
          >
            About <em>Us</em>
          </motion.h1>
        </div>

        {/* Split section */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden"
          >
            <img src={aboutTeam} alt="Our filmmaker" className="w-full h-full object-cover min-h-[400px]" />
            <div className="absolute inset-0 bg-background/10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center p-10 md:p-20"
          >
            <p className="font-body text-xs tracking-[0.4em] text-accent uppercase mb-6">Our Story</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8 leading-tight">
              We are storytellers <em>of emotion.</em>
            </h2>
            <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
              <p>
                Black & White Films was born from a simple belief: that love deserves to be captured in its purest form. We are a collective of filmmakers, photographers, and dreamers who find beauty in the raw, unscripted moments of life.
              </p>
              <p>
                Our approach is rooted in cinematic storytelling — drawing from the worlds of fine art, editorial fashion, and independent cinema. We don't just document events; we craft visual narratives that resonate with the soul.
              </p>
              <p>
                From intimate elopements to grand celebrations across the globe, every project is treated as a masterpiece in the making. Because your story is worth more than a highlight reel.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="py-24 px-6 md:px-16 border-t border-border">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="text-accent mx-auto mb-4" size={24} strokeWidth={1} />
                <p className="font-display text-3xl md:text-4xl text-foreground mb-2">{stat.value}</p>
                <p className="font-body text-xs tracking-[0.2em] text-muted-foreground uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Philosophy */}
        <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <img src={heroBg} alt="Cinematic backdrop" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
          <div className="relative z-10 text-center px-6 py-24">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="font-display text-3xl md:text-5xl text-primary-foreground mb-8 leading-tight"
            >
              Each frame is crafted with intention.
              <br />
              <em>Each story is told with authenticity.</em>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/#contact">
                <Button variant="hero">Work With Us</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default AboutPage;
