import { useState } from "react";
import { Instagram, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SITE_EMAIL,
  SITE_EMAIL_HREF,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_LOCATION_LABEL,
  SITE_MAPS_URL,
  SITE_INSTAGRAM_URL,
} from "@/lib/siteContact";

const navLinks = [
  { label: "Stories", path: "/stories" },
  { label: "Films", path: "/films" },
  { label: "Gallery", path: "/gallery" },
  { label: "Journal", path: "/blog" },
  { label: "Studio", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const services = [
  "Wedding Films",
  "Wedding Photography",
  "Pre-Wedding Shoots",
  "Destination Weddings",
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-foreground text-background">
      {/* Main footer */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Brand - full width on mobile */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" onClick={scrollToTop} className="inline-block mb-5" aria-label="Black & White Films — Home">
              {!logoError ? (
                <img
                  src="/logo-white.png"
                  alt="Black & White Films"
                  onError={() => setLogoError(true)}
                  className="h-14 w-auto object-contain"
                />
              ) : (
                <>
                  <div className="font-display text-[24px] font-light tracking-[0.18em] text-background leading-none">
                    BLACK<span className="opacity-50 mx-0.5">&amp;</span>WHITE
                  </div>
                  <div className="mt-1.5 font-body text-[8px] tracking-[0.5em] uppercase text-background/45">
                    Films · Photography
                  </div>
                </>
              )}
            </Link>
            <p className="font-body text-[12px] leading-relaxed text-background/50 max-w-[260px]">
              Crafting cinematic wedding stories that celebrate love in its most authentic form.
            </p>
            <a
              href={SITE_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 font-body text-[11px] tracking-[0.15em] text-background/50 hover:text-background transition-colors uppercase"
            >
              <Instagram size={14} />
              Follow us
            </a>
          </div>

          {/* Explore - side by side with Services on mobile */}
          <div className="col-span-1">
            <h4 className="font-display text-sm tracking-[0.15em] uppercase text-background/80 mb-4 md:mb-5">
              Explore
            </h4>
            <ul className="space-y-2.5 md:space-y-3">
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

          {/* Services - side by side with Explore on mobile */}
          <div className="col-span-1">
            <h4 className="font-display text-sm tracking-[0.15em] uppercase text-background/80 mb-4 md:mb-5">
              Services
            </h4>
            <ul className="space-y-2.5 md:space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="font-body text-[12px] tracking-[0.1em] text-background/50 uppercase">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - full width on mobile */}
          <div className="col-span-2 lg:col-span-1 pt-2 md:pt-0 border-t border-background/10 md:border-0">
            <h4 className="font-display text-sm tracking-[0.15em] uppercase text-background/80 mb-4 md:mb-5 pt-4 md:pt-0">
              Get in Touch
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <a
                  href={SITE_EMAIL_HREF}
                  className="flex items-start gap-2.5 font-body text-[12px] text-background/50 hover:text-background transition-colors break-all"
                >
                  <Mail size={13} className="mt-0.5 shrink-0" />
                  {SITE_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={SITE_PHONE_HREF}
                  className="flex items-start gap-2.5 font-body text-[12px] text-background/50 hover:text-background transition-colors"
                >
                  <Phone size={13} className="mt-0.5 shrink-0" />
                  {SITE_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={SITE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 font-body text-[12px] text-background/50 hover:text-background transition-colors"
                >
                  <MapPin size={13} className="mt-0.5 shrink-0" />
                  <span>{SITE_LOCATION_LABEL}</span>
                </a>
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
