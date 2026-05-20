import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Instagram, Mail, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

const navItems = [
  { label: "Stories", path: "/stories" },
  { label: "Films", path: "/films" },
  { label: "Gallery", path: "/gallery" },
  { label: "Journal", path: "/blog" },
  { label: "Studio", path: "/about" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const onLight = scrolled || isOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ${
          onLight
            ? "bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* Main bar — 3-column grid: logo · nav · actions */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 md:px-10 py-4 md:py-5">
          {/* Wordmark */}
          <Link to="/" className="group flex items-center" aria-label="Black &amp; White Films — Home">
            <div className="leading-none">
              <div
                className={`font-display text-[22px] md:text-[26px] font-light tracking-[0.18em] transition-colors duration-500 ${
                  onLight ? "text-foreground" : "text-primary-foreground"
                }`}
              >
                BLACK<span className="opacity-50 mx-0.5">&amp;</span>WHITE
              </div>
              <div
                className={`mt-1 font-body text-[8px] tracking-[0.5em] uppercase transition-colors duration-500 ${
                  onLight ? "text-foreground/45" : "text-primary-foreground/55"
                }`}
              >
                Films · Photography
              </div>
            </div>
          </Link>

          {/* Center nav (desktop) */}
          <nav className="hidden lg:flex items-center justify-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative px-4 py-2 font-body text-[11px] tracking-[0.3em] uppercase transition-colors duration-300 ${
                    onLight
                      ? isActive
                        ? "text-foreground"
                        : "text-foreground/55 hover:text-foreground"
                      : isActive
                      ? "text-primary-foreground"
                      : "text-primary-foreground/65 hover:text-primary-foreground"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className={`absolute left-3 right-3 -bottom-0.5 h-px ${
                        onLight ? "bg-foreground" : "bg-primary-foreground"
                      }`}
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center justify-end gap-2 md:gap-4">
            <Link
              to="/contact"
              className={`hidden md:inline-flex items-center font-body text-[10px] tracking-[0.3em] uppercase border px-5 py-2.5 transition-all duration-300 ${
                onLight
                  ? "border-foreground/25 text-foreground hover:bg-foreground hover:text-background hover:border-foreground"
                  : "border-primary-foreground/35 text-primary-foreground hover:bg-primary-foreground hover:text-foreground hover:border-primary-foreground"
              }`}
            >
              Book a Call
            </Link>

            <button
              onClick={toggle}
              className={`hidden md:flex w-9 h-9 items-center justify-center transition-colors duration-300 ${
                onLight
                  ? "text-foreground/45 hover:text-foreground"
                  : "text-primary-foreground/55 hover:text-primary-foreground"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={14} strokeWidth={1.5} /> : <Sun size={14} strokeWidth={1.5} />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden w-10 h-10 flex items-center justify-center transition-colors duration-300 ${
                onLight ? "text-foreground" : "text-primary-foreground"
              }`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-background lg:hidden"
          >
            <div className="flex h-full flex-col pt-24 pb-8 px-6">
              {/* Nav */}
              <nav className="flex-1 flex flex-col justify-center">
                <ul className="space-y-1">
                  {navItems.map((item, i) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.li
                        key={item.label}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          to={item.path}
                          className={`group flex items-baseline justify-between border-b border-border/50 py-5 ${
                            isActive ? "text-foreground" : "text-foreground/70"
                          }`}
                        >
                          <span className="font-display text-3xl font-light tracking-wide">{item.label}</span>
                          <span className="font-body text-[10px] tracking-[0.35em] text-foreground/30">
                            0{i + 1}
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mt-10"
                >
                  <Link
                    to="/contact"
                    className="block w-full text-center bg-foreground text-background py-4 font-body text-[11px] tracking-[0.35em] uppercase hover:bg-foreground/90 transition-colors"
                  >
                    Book a Call
                  </Link>
                </motion.div>
              </nav>

              {/* Footer of menu — contact + socials */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 pt-6 border-t border-border/40 space-y-4"
              >
                <a
                  href="mailto:hello@blackandwhite.com"
                  className="flex items-center gap-3 text-sm text-foreground/70 hover:text-foreground transition-colors"
                >
                  <Mail size={14} strokeWidth={1.5} />
                  <span className="font-body tracking-wider">hello@blackandwhite.com</span>
                </a>
                <a
                  href="tel:+910000000000"
                  className="flex items-center gap-3 text-sm text-foreground/70 hover:text-foreground transition-colors"
                >
                  <Phone size={14} strokeWidth={1.5} />
                  <span className="font-body tracking-wider">+91 00000 00000</span>
                </a>
                <div className="flex items-center justify-between pt-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={16} strokeWidth={1.5} />
                    <span className="font-body text-[11px] tracking-[0.3em] uppercase">Instagram</span>
                  </a>
                  <button
                    onClick={toggle}
                    className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === "light" ? <Moon size={14} strokeWidth={1.5} /> : <Sun size={14} strokeWidth={1.5} />}
                    <span className="font-body text-[11px] tracking-[0.3em] uppercase">
                      {theme === "light" ? "Dark" : "Light"}
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
