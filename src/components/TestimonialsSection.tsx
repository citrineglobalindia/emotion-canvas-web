import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote: "They didn't just capture our wedding — they captured our souls. Every frame tells our story with a depth of emotion we didn't think was possible.",
    name: "Priya & Arjun",
    event: "Destination Wedding, Udaipur",
  },
  {
    quote: "The most cinematic, breathtaking wedding film we've ever seen. Our families have watched it a hundred times and still cry every time.",
    name: "Sarah & Michael",
    event: "Villa Wedding, Tuscany",
  },
  {
    quote: "Working with Black & White Films felt like working with true artists. They understood our vision and elevated it beyond anything we imagined.",
    name: "Aisha & Ravi",
    event: "Royal Wedding, Jaipur",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-32 px-6 md:px-16 bg-secondary">
      <div ref={ref} className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="font-body text-xs tracking-[0.5em] text-accent uppercase mb-16"
        >
          Kind Words
        </motion.p>

        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-display text-2xl md:text-3xl text-foreground italic leading-relaxed mb-10">
            "{testimonials[current].quote}"
          </p>
          <p className="font-body text-sm text-foreground tracking-[0.2em] uppercase">
            {testimonials[current].name}
          </p>
          <p className="font-body text-xs text-muted-foreground tracking-[0.2em] mt-2">
            {testimonials[current].event}
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-12">
          <button onClick={prev} className="text-foreground/50 hover:text-accent transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2 items-center">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`w-8 h-px transition-colors duration-300 ${i === current ? "bg-accent" : "bg-foreground/20"}`}
              />
            ))}
          </div>
          <button onClick={next} className="text-foreground/50 hover:text-accent transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
