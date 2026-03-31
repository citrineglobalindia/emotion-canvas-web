import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import logoDark from "@/assets/logo-dark.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery5 from "@/assets/gallery-5.jpg";

const navItems = [
  { label: "STORIES", path: "/stories" },
  { label: "FILMS", path: "/films" },
  { label: "BLOGS", path: "/blog" },
  { label: "CONTACT", path: "/contact" },
];

const headerPhotos = [gallery1, gallery3, gallery5];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const location = useLocation();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhoto((prev) => (prev + 1) % headerPhotos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNav = (path: string) => {
    setIsOpen(false);
    if (path.startsWith("/#")) {
      if (location.pathname !== "/") {
        window.location.href = path;
      } else {
        document.getElementById(path.slice(2))?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-background/95 backdrop-blur-sm" : "bg-transparent"}`}>
      <div className="flex items-center justify-between px-6 md:px-10 py-5 md:py-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logoDark}
            alt="Black & White"
            className={`h-12 md:h-14 w-auto transition-all duration-500 object-contain ${
              scrolled ? "mix-blend-multiply" : "mix-blend-screen invert"
            }`}
          />
        </Link>

        {/* Center: Auto-scrolling photos */}
        <div className="hidden md:flex items-center gap-1.5 relative">
          {headerPhotos.map((photo, i) => (
            <div
              key={i}
              className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-500 ${
                i === activePhoto
                  ? scrolled
                    ? "border-foreground/60 scale-110"
                    : "border-primary-foreground/60 scale-110"
                  : scrolled
                    ? "border-foreground/15 scale-100 opacity-50"
                    : "border-primary-foreground/15 scale-100 opacity-50"
              }`}
            >
              <img
                src={photo}
                alt=""
                className="w-full h-full object-cover"
              />
              {i === activePhoto && (
                <motion.div
                  layoutId="photo-ring"
                  className={`absolute inset-0 rounded-full ring-1 ${
                    scrolled ? "ring-foreground/30" : "ring-primary-foreground/30"
                  }`}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Right nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`font-body text-[12px] tracking-[0.25em] transition-colors duration-300 ${
                scrolled ? "text-foreground/70 hover:text-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"
              } ${location.pathname === item.path ? (scrolled ? "text-foreground" : "text-primary-foreground") : ""}`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/#contact"
            onClick={() => handleNav("/#contact")}
            className={`font-body text-[12px] tracking-[0.25em] px-5 py-2 border transition-all duration-300 ${
              scrolled
                ? "border-foreground/30 text-foreground hover:bg-foreground hover:text-background"
                : "border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-foreground"
            }`}
          >
            BOOK US
          </Link>

          <button
            onClick={toggle}
            className={`w-8 h-8 flex items-center justify-center transition-colors duration-300 ${
              scrolled ? "text-foreground/50 hover:text-foreground" : "text-primary-foreground/50 hover:text-primary-foreground"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden w-9 h-9 flex items-center justify-center transition-colors ${
            scrolled ? "text-foreground" : "text-primary-foreground"
          }`}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/98 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {/* Mobile photo strip */}
              <div className="flex items-center justify-center gap-2 pb-4 mb-3 border-b border-border">
                {headerPhotos.map((photo, i) => (
                  <div
                    key={i}
                    className={`w-16 h-16 rounded-lg overflow-hidden transition-all duration-500 ${
                      i === activePhoto ? "ring-2 ring-foreground/40 scale-105" : "opacity-50"
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 font-body text-[12px] tracking-[0.25em] text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <Link
                  to="/#contact"
                  onClick={() => { handleNav("/#contact"); setIsOpen(false); }}
                  className="block text-center py-3 border border-foreground/30 font-body text-[12px] tracking-[0.25em] text-foreground hover:bg-foreground hover:text-background transition-all"
                >
                  BOOK US
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
