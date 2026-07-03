import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const services = [
  "Wedding Film",
  "Wedding Photography",
  "Pre-Wedding Shoot",
  "Engagement",
  "Full Package",
];

const LeadPopup = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", service: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("bw_contact_submissions").insert({
        name: formData.name,
        email: `${formData.phone}@lead.local`,
        phone: formData.phone || null,
        message: formData.message || null,
        service: formData.service || null,
      });
      if (error) throw error;
      toast.success("Thank you! We'll reach out soon.");
      close();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-warm p-8 md:p-10"
          >
            <button onClick={close} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X size={18} />
            </button>

            <div className="text-center mb-8">
              <h3 className="font-display text-3xl text-foreground mb-2">
                Let's Capture Your <em>Story</em>
              </h3>
              <p className="font-body text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                Limited dates available
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Your Name" value={formData.name} onChange={(e) => update("name", e.target.value)}
                className="bg-transparent border-0 border-b border-foreground/20 rounded-none font-body h-11 px-0 focus-visible:ring-0 focus-visible:border-foreground" required />
              <Input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => update("phone", e.target.value)}
                className="bg-transparent border-0 border-b border-foreground/20 rounded-none font-body h-11 px-0 focus-visible:ring-0 focus-visible:border-foreground" required />
              <select value={formData.service} onChange={(e) => update("service", e.target.value)}
                className="w-full h-11 bg-transparent border-0 border-b border-foreground/20 font-body text-sm text-foreground appearance-none px-0 outline-none cursor-pointer">
                <option value="">Select Service</option>
                {services.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <Textarea placeholder="Tell us about your story..." value={formData.message} onChange={(e) => update("message", e.target.value)}
                className="bg-transparent border-0 border-b border-foreground/20 rounded-none font-body min-h-[70px] resize-none px-0 focus-visible:ring-0 focus-visible:border-foreground" />
              <div className="text-center pt-2">
                <button type="submit" disabled={submitting}
                  className="font-body text-[12px] tracking-[0.25em] uppercase text-foreground border border-foreground/30 px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-50 inline-flex items-center gap-2">
                  {submitting ? <><Loader2 size={12} className="animate-spin" /> Sending...</> : "Reserve My Date"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadPopup;
