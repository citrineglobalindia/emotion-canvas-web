import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Film, Camera, Plane, Video, BookOpen } from "lucide-react";

const services = [
  { icon: Film, title: "Wedding Films", desc: "Cinematic wedding day coverage with artistic storytelling" },
  { icon: Camera, title: "Pre Wedding Films", desc: "Romantic pre-wedding shoots in stunning locations" },
  { icon: Plane, title: "Destination Photography", desc: "Luxury destination wedding coverage worldwide" },
  { icon: Video, title: "Commercial Films", desc: "Brand films with cinematic production quality" },
  { icon: BookOpen, title: "Brand Story Films", desc: "Narrative-driven brand storytelling content" },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-32 px-6 md:px-16">
      <div ref={ref}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="font-body text-xs tracking-[0.5em] text-accent uppercase text-center mb-4"
        >
          What We Do
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="font-display text-3xl md:text-5xl text-foreground text-center mb-20"
        >
          Our <em>Services</em>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              className="group border border-border p-10 hover:border-accent transition-all duration-500 cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              <service.icon className="text-accent mb-6" size={28} strokeWidth={1} />
              <h3 className="font-display text-xl text-foreground mb-3">{service.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
