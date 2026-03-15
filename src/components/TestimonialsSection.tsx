import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const testimonials = [
  {
    quote: "They didn't just capture our wedding — they captured our souls. Every frame tells our story with a depth of emotion we didn't think was possible. The team made it a point to get to know us, and that's what sets them apart.",
    name: "Priya & Arjun",
    location: "Udaipur",
  },
  {
    quote: "The most cinematic, breathtaking wedding film we've ever seen. Our families have watched it a hundred times and still cry every time. They will go the extra mile to make sure every minute detail in the frame is perfect.",
    name: "Sarah & Michael",
    location: "Tuscany",
  },
  {
    quote: "Working with them felt like working with true artists. They understood our vision and elevated it beyond anything we imagined. It's almost like having friends taking your pictures — calm, accommodating, and wonderful.",
    name: "Aisha & Ravi",
    location: "Jaipur",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-warm" ref={ref}>
      <div className="py-24 md:py-36 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-16"
          >
            Kind Words
          </motion.h2>

          <div className="min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                  "{testimonials[current].quote}"
                </p>
                <p className="font-display text-xl text-foreground">{testimonials[current].name}</p>
                <p className="font-body text-[11px] tracking-[0.2em] text-muted-foreground uppercase mt-2">
                  {testimonials[current].location}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-[1px] rounded-full transition-all duration-500 ${
                  i === current ? "w-12 bg-foreground" : "w-6 bg-border hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
