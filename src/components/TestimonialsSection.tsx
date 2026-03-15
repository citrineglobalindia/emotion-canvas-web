import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  { quote: "They didn't just capture our wedding — they captured our souls. Every frame tells our story with a depth of emotion we didn't think was possible.", name: "Priya & Arjun", event: "Destination Wedding, Udaipur" },
  { quote: "The most cinematic, breathtaking wedding film we've ever seen. Our families have watched it a hundred times and still cry every time.", name: "Sarah & Michael", event: "Villa Wedding, Tuscany" },
  { quote: "Working with them felt like working with true artists. They understood our vision and elevated it beyond anything we imagined.", name: "Aisha & Ravi", event: "Royal Wedding, Jaipur" },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 md:py-32 px-6 md:px-10">
      <div ref={ref} className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
            className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <Quote size={14} />
            <span className="font-body text-xs font-medium uppercase tracking-wider">Kind Words</span>
          </motion.div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 md:p-14 relative">
          <Quote className="text-accent/20 absolute top-6 left-8" size={48} />
          <motion.div key={current} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-center relative z-10">
            <p className="font-display text-2xl md:text-3xl text-foreground italic leading-relaxed mb-8">
              "{testimonials[current].quote}"
            </p>
            <p className="font-body text-sm text-foreground font-medium">{testimonials[current].name}</p>
            <p className="font-body text-xs text-accent mt-1">{testimonials[current].event}</p>
          </motion.div>

          <div className="flex justify-center items-center gap-4 mt-10">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-secondary hover:bg-accent/10 flex items-center justify-center text-muted-foreground hover:text-accent transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-accent" : "w-2 bg-border hover:bg-accent/30"}`} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full bg-secondary hover:bg-accent/10 flex items-center justify-center text-muted-foreground hover:text-accent transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
