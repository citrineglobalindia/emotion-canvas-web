import { useState, useEffect } from "react";
import { Instagram, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logoDark from "@/assets/logo-dark.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery5 from "@/assets/gallery-5.jpg";

const navLinks = [
  { label: "Stories", path: "/stories" },
  { label: "Films", path: "/films" },
  { label: "Blogs", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const services = [
  "Wedding Films",
  "Wedding Photography",
  "Pre-Wedding Shoots",
  "Destination Weddings",
];

const footerPhotos = [gallery1, gallery3, gallery5];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhoto((prev) => (prev + 1) % footerPhotos.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-foreground text-background">
      {/* Auto-scrolling photo strip */}
      <div className="relative w-full h-[280px] md:h-[360px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activePhoto}
            src={footerPhotos[activePhoto]}
            alt="Wedding moment"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground" />
        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {footerPhotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActivePhoto(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                i === activePhoto ? "bg-background w-5" : "bg-background/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" onClick={scrollToTop}>
              <img
                src={logoDark}
                alt="Black & White Films"
                className="h-10 w-auto object-contain invert mix-blend-screen mb-5"
              />
            </Link>
            <p className="font-body text-[12px] leading-relaxed text-background/50 max-w-[260px]">
              Crafting cinematic wedding stories that celebrate love in its most authentic form.
            </p>
            <a
              href="https://www.instagram.com/storiesby_black_and_white"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 font-body text-[11px] tracking-[0.15em] text-background/50 hover:text-background transition-colors uppercase"
            >
              <Instagram size={14} />
              Follow us
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm tracking-[0.15em] uppercase text-background/80 mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="group font-body text-[12px] tracking-[0.1em] text-background/50 hover:text-background transition-colors uppercase inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={10}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm tracking-[0.15em] uppercase text-background/80 mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="font-body text-[12px] tracking-[0.1em] text-background/50 uppercase">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm tracking-[0.15em] uppercase text-background/80 mb-5">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@blackandwhitefilms.com"
                  className="flex items-start gap-2.5 font-body text-[12px] text-background/50 hover:text-background transition-colors"
                >
                  <Mail size={13} className="mt-0.5 shrink-0" />
                  hello@blackandwhitefilms.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-start gap-2.5 font-body text-[12px] text-background/50 hover:text-background transition-colors"
                >
                  <Phone size={13} className="mt-0.5 shrink-0" />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 font-body text-[12px] text-background/50">
                  <MapPin size={13} className="mt-0.5 shrink-0" />
                  <span>Mumbai, India</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-[10px] tracking-[0.15em] text-background/30 uppercase">
            © {new Date().getFullYear()} Black & White Films. All rights reserved.
          </p>
          <p className="font-body text-[10px] tracking-[0.15em] text-background/30 uppercase">
            Designed & Developed by{" "}
            <a
              href="https://stepstones.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/50 hover:text-background transition-colors"
            >
              Stepstones
            </a>
          </p>
          <button
            onClick={scrollToTop}
            className="font-body text-[10px] tracking-[0.15em] text-background/30 hover:text-background/60 transition-colors uppercase"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
