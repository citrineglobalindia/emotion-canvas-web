import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Film, Camera, Plane, Video, BookOpen } from "lucide-react";

const services = [
  { icon: Film, title: "Wedding Films", desc: "Cinematic wedding day coverage with artistic storytelling", color: "from-rose-500/10 to-orange-500/10" },
  { icon: Camera, title: "Pre Wedding Films", desc: "Romantic pre-wedding shoots in stunning locations", color: "from-amber-500/10 to-yellow-500/10" },
  { icon: Plane, title: "Destination Photography", desc: "Luxury destination wedding coverage worldwide", color: "from-blue-500/10 to-cyan-500/10" },
  { icon: Video, title: "Commercial Films", desc: "Brand films with cinematic production quality", color: "from-violet-500/10 to-purple-500/10" },
  { icon: BookOpen, title: "Brand Story Films", desc: "Narrative-driven brand storytelling content", color: "from-emerald-500/10 to-teal-500/10" },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-warm">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
            className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <Camera size={14} />
            <span className="font-body text-xs font-medium uppercase tracking-wider">What We Do</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
            className="font-display text-4xl md:text-5xl text-foreground">
            Our <em className="text-accent">Services</em>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              className={`group bg-gradient-to-br ${service.color} bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-accent/30 hover:-translate-y-1 transition-all duration-400 cursor-pointer`}>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                <service.icon className="text-accent" size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl text-foreground font-semibold mb-2">{service.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
