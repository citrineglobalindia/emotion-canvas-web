import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type Testimonial = {
  name: string;
  role: string | null;
  quote: string;
  image_url: string | null;
};

const FALLBACK: Testimonial[] = [
  { name: "Priya & Arjun", role: "Udaipur", quote: "They didn't just capture our wedding — they captured our souls. Every frame tells our story with a depth of emotion we didn't think was possible.", image_url: null },
  { name: "Sarah & Michael", role: "Tuscany", quote: "The most cinematic, breathtaking wedding film we've ever seen. Our families have watched it a hundred times and still cry every time.", image_url: null },
  { name: "Aisha & Ravi", role: "Jaipur", quote: "Working with them felt like working with true artists. They understood our vision and elevated it beyond anything we imagined.", image_url: null },
  { name: "Meera & Karan", role: "Goa", quote: "Calm, accommodating, and wonderful — it felt like having close friends capture the most important day of our lives.", image_url: null },
  { name: "Anita & Dev", role: "Delhi", quote: "Every minute detail in the frame was perfect. They go the extra mile, and it shows in every photograph.", image_url: null },
  { name: "Zara & Kabir", role: "Kerala", quote: "Beyond breathtaking. They turned fleeting moments into timeless art we will treasure for generations.", image_url: null },
];

const initials = (name: string) =>
  name.split(/[\s&]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const Column = ({ items, duration, className }: { items: Testimonial[]; duration: number; className?: string }) => (
  <div className={className}>
    <motion.div
      animate={{ translateY: "-50%" }}
      transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
      className="flex flex-col gap-6 pb-6"
    >
      {[0, 1].map((dup) => (
        <div key={dup} className="flex flex-col gap-6" aria-hidden={dup === 1}>
          {items.map((t, i) => (
            <div
              key={`${dup}-${i}`}
              className="w-[300px] max-w-full rounded-2xl border border-border/50 bg-background p-8 shadow-sm"
            >
              <p className="font-body text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                {t.image_url ? (
                  <img src={t.image_url} alt={t.name} className="h-10 w-10 rounded-full object-cover grayscale" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground font-display text-xs text-background">
                    {initials(t.name)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-display text-sm text-foreground">{t.name}</span>
                  {t.role && (
                    <span className="mt-0.5 font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {t.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </motion.div>
  </div>
);

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [items, setItems] = useState<Testimonial[]>(FALLBACK);

  useEffect(() => {
    let active = true;
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("bw_testimonials")
        .select("name, role, quote, image_url")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (active && !error && data && data.length) setItems(data as Testimonial[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  const col = (c: number) => {
    const filtered = items.filter((_, i) => i % 3 === c);
    return filtered.length ? filtered : items;
  };

  return (
    <section ref={ref} className="overflow-hidden bg-warm py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-6xl px-6"
      >
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="rounded-full border border-border/60 px-4 py-1 font-body text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Testimonials
          </span>
          <h2 className="mt-6 font-display text-4xl text-foreground md:text-5xl lg:text-6xl">Kind Words</h2>
          <p className="mt-4 max-w-md font-body text-sm text-muted-foreground">
            Every couple, every celebration — here's what they say about their films and frames.
          </p>
        </div>
        <div className="flex max-h-[680px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
          <Column items={col(0)} duration={22} />
          <Column items={col(1)} duration={28} className="hidden md:block" />
          <Column items={col(2)} duration={25} className="hidden lg:block" />
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;
