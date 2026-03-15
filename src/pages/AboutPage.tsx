import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import { Button } from "@/components/ui/button";
import { Award, Film, Heart, Globe, ArrowRight, Users } from "lucide-react";
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
      <div className="min-h-screen pt-28 pb-0">
        <div className="px-6 md:px-10 mb-20 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <Users size={14} />
            <span className="font-body text-xs font-medium uppercase tracking-wider">Who We Are</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="font-display text-4xl md:text-6xl text-foreground">About <em className="text-accent">Us</em></motion.h1>
        </div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}
            className="relative overflow-hidden lg:rounded-r-3xl">
            <img src={aboutTeam} alt="Our filmmaker" className="w-full h-full object-cover min-h-[400px]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center p-10 md:p-16 lg:p-20">
            <span className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1.5 rounded-full w-fit mb-6">
              <span className="font-body text-[10px] font-medium uppercase tracking-wider">Our Story</span>
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8 leading-tight">
              We are storytellers <em className="text-accent">of emotion.</em>
            </h2>
            <div className="space-y-5 font-body text-muted-foreground leading-relaxed">
              <p>Stories by B&W was born from a simple belief: that love deserves to be captured in its most vibrant, authentic form.</p>
              <p>Our approach is rooted in cinematic storytelling — drawing from fine art, editorial fashion, and independent cinema. We craft visual narratives that resonate with the soul.</p>
              <p>From intimate elopements to grand celebrations across the globe, every project is treated as a masterpiece in the making.</p>
            </div>
          </motion.div>
        </div>

        <div className="py-20 px-6 md:px-10 bg-warm">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:border-accent/30 transition-all duration-300 group">
                <stat.icon className="text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" size={22} strokeWidth={1.5} />
                <p className="font-display text-3xl md:text-4xl text-foreground font-semibold">{stat.value}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          <img src={heroBg} alt="Cinematic backdrop" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center px-6 py-20">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl text-primary-foreground mb-8 leading-tight">
              Each frame is crafted with intention.<br /><em className="text-accent">Each story is told with authenticity.</em>
            </motion.h2>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
              <Link to="/#contact"><Button variant="accent">Work With Us <ArrowRight size={16} /></Button></Link>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default AboutPage;
