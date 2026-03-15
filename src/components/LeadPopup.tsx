import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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

  const close = () => {
    setShow(false);
    setDismissed(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll reach out soon.");
    close();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border p-10 md:p-14 max-w-md w-full relative"
          >
            <button onClick={close} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>

            <p className="font-body text-xs tracking-[0.5em] text-accent uppercase mb-3">Limited Availability</p>
            <h3 className="font-display text-3xl text-foreground mb-2">Book Your <em>Story</em></h3>
            <p className="font-body text-sm text-muted-foreground mb-8">Reserve your date before it's gone.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Name" className="bg-transparent border-border text-foreground font-body h-11" required />
              <Input type="email" placeholder="Email" className="bg-transparent border-border text-foreground font-body h-11" required />
              <Input type="tel" placeholder="Phone" className="bg-transparent border-border text-foreground font-body h-11" />
              <Button variant="accent" type="submit" className="w-full">Submit</Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadPopup;
