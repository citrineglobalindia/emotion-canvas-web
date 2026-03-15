import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

const navItems = [
  { label: "Films", path: "/films" },
  { label: "Gallery", path: "/gallery" },
  { label: "Stories", path: "/stories" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/#contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggle } = useTheme();

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-8 py-6 md:px-16">
        <Link to="/" className="text-foreground font-display text-lg tracking-[0.2em]">
          B&W FILMS
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) =>
            item.path.startsWith("/#") ? (
              <button
                key={item.label}
                onClick={() => handleNav(item.path)}
                className={`font-body text-xs tracking-[0.3em] uppercase transition-colors duration-300 text-foreground/70 hover:text-accent`}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                to={item.path}
                className={`font-body text-xs tracking-[0.3em] uppercase transition-colors duration-300 ${
                  location.pathname === item.path ? "text-accent" : "text-foreground/70 hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-background/95 backdrop-blur-md px-8 pb-8"
          >
            {navItems.map((item) =>
              item.path.startsWith("/#") ? (
                <button
                  key={item.label}
                  onClick={() => handleNav(item.path)}
                  className="block w-full text-left py-4 text-foreground/70 hover:text-accent font-body text-sm tracking-[0.3em] uppercase border-b border-border transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left py-4 text-foreground/70 hover:text-accent font-body text-sm tracking-[0.3em] uppercase border-b border-border transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
