import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = ["Films", "Gallery", "Stories", "About", "Contact"];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-6 md:px-16">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-foreground font-display text-lg tracking-[0.2em]">
          B&W FILMS
        </button>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="text-foreground/70 hover:text-accent font-body text-xs tracking-[0.3em] uppercase transition-colors duration-300"
            >
              {item}
            </button>
          ))}
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
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className="block w-full text-left py-4 text-foreground/70 hover:text-accent font-body text-sm tracking-[0.3em] uppercase border-b border-border transition-colors"
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
