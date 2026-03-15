import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const testimonials = [
  { quote: "They didn't just capture our wedding — they captured our souls. Every frame tells our story with a depth of emotion we didn't think was possible.", name: "Priya & Arjun", event: "Udaipur" },
  { quote: "The most cinematic, breathtaking wedding film we've ever seen. Our families have watched it a hundred times and still cry every time.", name: "Sarah & Michael", event: "Tuscany" },
  { quote: "Working with them felt like working with true artists. They understood our vision and elevated it beyond anything we imagined.", name: "Aisha & Ravi", event: "Jaipur" },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 md:py-36 px-6 md:px-10">
      <div ref={ref} className="max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="font-body text-[11px] tracking-[0.35em] text-muted-foreground uppercase mb-12"
        >
          Kind Words
        </motion.p>

        <div className="min-h-[250px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground italic leading-relaxed mb-10">
                "{testimonials[current].quote}"
              </p>
              <p className="font-body text-sm text-foreground tracking-wide">{testimonials[current].name}</p>
              <p className="font-body text-[11px] tracking-[0.2em] text-muted-foreground uppercase mt-1">{testimonials[current].event}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-3 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-[2px] rounded-full transition-all duration-500 ${i === current ? "w-10 bg-accent" : "w-6 bg-border hover:bg-muted-foreground/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
