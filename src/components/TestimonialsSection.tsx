import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useDemoContentAllowed, useSection } from "@/lib/siteContent";
import { defaultsFor } from "@/lib/contentSchema";
import { RichText } from "@/components/RichText";
import SmartImage from "@/components/SmartImage";

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

const Column = ({
  items,
  duration,
  className,
  paused,
}: {
  items: Testimonial[];
  duration: number;
  className?: string;
  paused: boolean;
}) => (
  <div className={className}>
    <div
      className={`marquee-track flex flex-col gap-6 pb-6 ${paused ? "marquee-paused" : ""}`}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
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
                  <SmartImage src={t.image_url} alt={t.name} width={80} className="h-10 w-10 rounded-full object-cover grayscale" />
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
    </div>
  </div>
);

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  // Unlike the reveal above, this one keeps updating so the marquee can be
  // paused whenever the section is scrolled out of view.
  const isOnScreen = useInView(ref, { margin: "200px" });
  const demoAllowed = useDemoContentAllowed();
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const intro = useSection("home", "testimonials-intro", defaultsFor("home", "testimonials-intro"));

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("bw_testimonials")
        .select("name, role, quote, image_url")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (active && !error) setItems((data as Testimonial[] | null) ?? []);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Until the query resolves, show nothing rather than flashing the samples.
  const quotes = items === null ? [] : items.length ? items : demoAllowed ? FALLBACK : [];

  const col = (c: number) => {
    const filtered = quotes.filter((_, i) => i % 3 === c);
    return filtered.length ? filtered : quotes;
  };

  // With no quotes to show, the heading alone would look like a mistake.
  if (items !== null && !quotes.length) return null;

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
            {intro.subheading}
          </span>
          <h2 className="mt-6 font-display text-4xl text-foreground md:text-5xl lg:text-6xl">
            <RichText text={intro.heading} />
          </h2>
          <p className="mt-4 max-w-md font-body text-sm text-muted-foreground">{intro.body}</p>
        </div>
        <div className="flex max-h-[680px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
          <Column items={col(0)} duration={22} paused={!isOnScreen} />
          <Column items={col(1)} duration={28} className="hidden md:block" paused={!isOnScreen} />
          <Column items={col(2)} duration={25} className="hidden lg:block" paused={!isOnScreen} />
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;
