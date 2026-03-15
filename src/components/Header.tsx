import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Films", path: "/films" },
  { label: "Gallery", path: "/gallery" },
  { label: "Stories", path: "/stories" },
  { label: "Blog", path: "/blog" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/#contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold text-foreground">Stories</span>
          <span className="font-display text-2xl italic text-accent">by B&W</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
            item.path.startsWith("/#") ? (
              <button key={item.label} onClick={() => handleNav(item.path)}
                className="font-body text-sm text-foreground/70 hover:text-accent transition-colors duration-300 relative group">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full rounded-full" />
              </button>
            ) : (
              <Link key={item.label} to={item.path}
                className={`font-body text-sm transition-colors duration-300 relative group ${location.pathname === item.path ? "text-accent" : "text-foreground/70 hover:text-accent"}`}>
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 rounded-full ${location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={toggle} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground/70 hover:text-accent hover:bg-accent/10 transition-all duration-300" aria-label="Toggle theme">
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <Link to="/#contact" className="hidden md:inline-flex font-body text-sm bg-accent text-accent-foreground px-5 py-2.5 rounded-full hover:bg-accent/90 transition-all duration-300 shadow-md hover:shadow-lg">
            Book Now
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground">
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/98 backdrop-blur-xl border-t border-border overflow-hidden">
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) =>
                item.path.startsWith("/#") ? (
                  <button key={item.label} onClick={() => handleNav(item.path)}
                    className="block w-full text-left py-3 text-foreground/80 hover:text-accent font-body text-base transition-colors">
                    {item.label}
                  </button>
                ) : (
                  <Link key={item.label} to={item.path} onClick={() => setIsOpen(false)}
                    className="block w-full text-left py-3 text-foreground/80 hover:text-accent font-body text-base transition-colors">
                    {item.label}
                  </Link>
                )
              )}
              <div className="pt-3 border-t border-border">
                <Link to="/#contact" onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 bg-accent text-accent-foreground rounded-lg font-body text-sm">
                  Book Now
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
