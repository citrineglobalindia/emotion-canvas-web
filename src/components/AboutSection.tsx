import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Camera, Heart, Sparkles } from "lucide-react";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-10">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
              <Sparkles size={14} />
              <span className="font-body text-xs font-medium uppercase tracking-wider">Our Philosophy</span>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-8">
              We are storytellers <em className="text-accent">of emotion.</em>
            </motion.h2>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-5">
              <p className="font-body text-muted-foreground text-base leading-relaxed">
                Through cinematic films and timeless photography, we capture moments that become memories. Every frame is painted with emotion, light, and authenticity.
              </p>
              <p className="font-body text-muted-foreground text-base leading-relaxed">
                We believe your love story deserves to be told with the same passion and artistry as the greatest films ever made.
              </p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-4">
            {[
              { icon: Camera, label: "200+", desc: "Films Crafted" },
              { icon: Heart, label: "500+", desc: "Love Stories" },
              { icon: Sparkles, label: "15+", desc: "Countries" },
              { icon: Camera, label: "30+", desc: "Awards" },
            ].map((stat, i) => (
              <div key={stat.desc} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:border-accent/30 transition-all duration-300 group">
                <stat.icon className="text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" size={22} strokeWidth={1.5} />
                <p className="font-display text-3xl text-foreground font-semibold">{stat.label}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{stat.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
