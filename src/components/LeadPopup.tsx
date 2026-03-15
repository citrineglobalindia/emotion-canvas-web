import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const LeadPopup = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const handler = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.4 && !dismissed) setShow(true);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [dismissed]);

  const close = () => { setShow(false); setDismissed(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll reach out soon.");
    close();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={close}>
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border border-border rounded-3xl p-8 md:p-12 max-w-md w-full relative shadow-2xl">
            <button onClick={close} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} />
            </button>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1.5 rounded-full mb-4">
              <Sparkles size={12} />
              <span className="font-body text-[10px] font-medium uppercase tracking-wider">Limited Dates</span>
            </div>
            <h3 className="font-display text-3xl text-foreground mb-2">Book Your <em className="text-accent">Story</em></h3>
            <p className="font-body text-sm text-muted-foreground mb-8">Reserve your date before it's gone.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input placeholder="Name" className="bg-card border-border font-body h-11 rounded-xl" required />
              <Input type="email" placeholder="Email" className="bg-card border-border font-body h-11 rounded-xl" required />
              <Input type="tel" placeholder="Phone" className="bg-card border-border font-body h-11 rounded-xl" />
              <Button variant="accent" type="submit" className="w-full">Reserve My Date</Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadPopup;
