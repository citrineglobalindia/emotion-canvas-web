import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Instagram, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  SITE_EMAIL,
  SITE_EMAIL_HREF,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_LOCATION_LABEL,
  SITE_MAPS_URL,
} from "@/lib/siteContact";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";
import photo5 from "@/assets/photo-5.jpg";
import photo6 from "@/assets/photo-6.jpg";
import photo7 from "@/assets/photo-7.jpg";
import photo8 from "@/assets/photo-8.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import blog5 from "@/assets/blog-5.jpg";
import blog6 from "@/assets/blog-6.jpg";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";
import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import contactBg from "@/assets/contact-bg.jpg";
import aboutTeam from "@/assets/about-team.jpg";

const mosaicPhotos = [
  photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8,
  gallery1, gallery2, gallery3, gallery4, gallery5, gallery6,
  blog1, blog2, blog3, blog4, blog5, blog6,
  film1, film2, film3, story1, story2, heroBg, contactBg, aboutTeam,
  // Repeat to fill ~50
  photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8,
  gallery1, gallery2, gallery3, gallery4, gallery5, gallery6,
  film1, film2, film3, story1, story2, heroBg, contactBg, aboutTeam,
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        service: formData.service || null,
        message: formData.message || null,
      });
      if (error) throw error;
      toast.success("Thank you! We'll get back to you soon. 💕");
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const inputClasses =
    "w-full bg-transparent border-b border-border/40 focus:border-foreground font-body text-sm text-foreground placeholder:text-muted-foreground/40 py-3 px-0 focus:outline-none transition-colors duration-300";

  return (
    <section id="contact">
      {/* Photo Mosaic with Centered Logo */}
      <div className="relative w-full overflow-hidden">
        <div className="grid grid-cols-7 md:grid-cols-10 gap-0">
          {mosaicPhotos.map((photo, i) => (
            <div key={i} className="aspect-square overflow-hidden">
              <img
                src={photo}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        {/* Dark overlay + centered wordmark */}
        <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="text-center" aria-label="Black & White Films">
              <div className="font-display text-[28px] md:text-[36px] font-light tracking-[0.18em] text-background leading-none">
                BLACK<span className="opacity-50 mx-0.5">&amp;</span>WHITE
              </div>
              <div className="mt-2 font-body text-[8px] md:text-[9px] tracking-[0.5em] uppercase text-background/55">
                Films · Photography
              </div>
            </div>
            <p className="mt-2 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-background/60">
              50+ Stories Captured
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div ref={ref} className="bg-warm py-24 md:py-36 px-6 md:px-10">
        <div className="max-w-[1100px] mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              Contact <em>Us</em>
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
              Ready to tell your love story? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-16 md:gap-20">
            {/* Left — Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:col-span-2 space-y-10"
            >
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
                  Get in Touch
                </p>
                <div className="space-y-5">
                  <a href={SITE_EMAIL_HREF} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center group-hover:border-foreground transition-colors">
                      <Mail size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <span className="font-body text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                      {SITE_EMAIL}
                    </span>
                  </a>
                  <a href={SITE_PHONE_HREF} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center group-hover:border-foreground transition-colors">
                      <Phone size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <span className="font-body text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                      {SITE_PHONE_DISPLAY}
                    </span>
                  </a>
                  <a
                    href={SITE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center group-hover:border-foreground transition-colors">
                      <MapPin size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <span className="font-body text-sm text-foreground/70 group-hover:text-foreground transition-colors underline-offset-4 group-hover:underline">
                      {SITE_LOCATION_LABEL}
                    </span>
                  </a>
                </div>
              </div>

              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
                  Follow Us
                </p>
                <a
                  href="https://www.instagram.com/storiesby_black_and_white"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center group-hover:border-foreground transition-colors">
                    <Instagram size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <span className="font-body text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                    @storiesby_black_and_white
                  </span>
                </a>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="pt-4"
              >
                <p className="font-display text-lg text-foreground/80 italic leading-relaxed">
                  "Every love story deserves to be told beautifully."
                </p>
              </motion.div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:col-span-3"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={update("name")}
                    className={inputClasses}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={update("email")}
                    className={inputClasses}
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={update("phone")}
                    className={inputClasses}
                  />
                  <select
                    value={formData.service}
                    onChange={update("service")}
                    className={`${inputClasses} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>Select Service</option>
                    <option value="wedding-photography">Wedding Photography</option>
                    <option value="wedding-film">Wedding Film</option>
                    <option value="pre-wedding">Pre-Wedding Shoot</option>
                    <option value="destination">Destination Wedding</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <textarea
                  placeholder="Tell us about your special day..."
                  value={formData.message}
                  onChange={update("message")}
                  rows={4}
                  className={`${inputClasses} resize-none`}
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-10 py-3.5 bg-foreground text-background font-body text-xs uppercase tracking-[0.25em] hover:opacity-90 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={13} />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
