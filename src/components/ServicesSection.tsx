import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const services = [
  { title: "Wedding Films", desc: "Cinematic wedding day coverage with artistic storytelling" },
  { title: "Pre Wedding Films", desc: "Romantic pre-wedding shoots in stunning locations" },
  { title: "Destination Photography", desc: "Luxury destination wedding coverage worldwide" },
  { title: "Commercial Films", desc: "Brand films with cinematic production quality" },
  { title: "Brand Story Films", desc: "Narrative-driven brand storytelling content" },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-24 md:py-32 px-6 md:px-10">
      <div ref={ref} className="max-w-4xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-body text-[11px] tracking-[0.35em] text-muted-foreground uppercase mb-5"
          >
            What We Do
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground"
          >
            Services
          </motion.h2>
        </div>

        <div className="border-t border-border">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="border-b border-border py-7 md:py-8 flex items-center justify-between group cursor-pointer hover:pl-4 transition-all duration-500"
            >
              <div>
                <h3 className="font-display text-xl md:text-2xl text-foreground group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground mt-1">{service.desc}</p>
              </div>
              <ArrowRight
                size={18}
                className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-4"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
