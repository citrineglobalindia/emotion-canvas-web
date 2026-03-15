import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, User, MapPin, Camera, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/gallery-2.jpg";

const services = [
  "Wedding Film",
  "Wedding Photography",
  "Pre-Wedding Shoot",
  "Engagement",
  "Reception Coverage",
  "Full Package",
];

const LeadPopup = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    service: "",
    phone: "",
    message: "",
  });
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
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: `${formData.phone}@lead.local`,
        phone: formData.phone || null,
        message: formData.message || null,
        location: formData.location || null,
        service: formData.service || null,
      });
      if (error) throw error;
      toast.success("Thank you! We'll reach out soon. 🎬");
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
          className="fixed inset-0 z-[100] bg-foreground/50 backdrop-blur-md flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl"
          >
            {/* Background image header */}
            <div className="relative h-44 overflow-hidden">
              <img src={heroBg} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
              <button
                onClick={close}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all duration-300"
              >
                <X size={14} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1.5 bg-accent/90 text-accent-foreground px-3 py-1 rounded-full mb-3"
                >
                  <Sparkles size={10} />
                  <span className="font-body text-[9px] font-semibold uppercase tracking-widest">Limited Dates Available</span>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-2xl md:text-3xl text-white leading-tight"
                >
                  Let's Capture Your <em className="text-accent">Story</em>
                </motion.h3>
              </div>
            </div>

            {/* Form body */}
            <div className="bg-background p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name */}
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="bg-card border-border font-body h-11 rounded-xl pl-10 text-sm focus:border-accent focus:ring-accent/20"
                    required
                  />
                </div>

                {/* Location & Service row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Location"
                      value={formData.location}
                      onChange={(e) => update("location", e.target.value)}
                      className="bg-card border-border font-body h-11 rounded-xl pl-10 text-sm focus:border-accent focus:ring-accent/20"
                    />
                  </div>
                  <div className="relative">
                    <Camera size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                    <select
                      value={formData.service}
                      onChange={(e) => update("service", e.target.value)}
                      className="w-full h-11 rounded-xl pl-10 pr-3 bg-card border border-border font-body text-sm text-foreground appearance-none focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all cursor-pointer"
                    >
                      <option value="" className="text-muted-foreground">Select Service</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="bg-card border-border font-body h-11 rounded-xl pl-10 text-sm focus:border-accent focus:ring-accent/20"
                    required
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                  <Textarea
                    placeholder="Tell us about your dream wedding..."
                    value={formData.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="bg-card border-border font-body min-h-[80px] resize-none rounded-xl pl-10 text-sm focus:border-accent focus:ring-accent/20"
                  />
                </div>

                <Button variant="accent" type="submit" className="w-full h-12 text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all" disabled={submitting}>
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin mr-2" /> Sending...</>
                  ) : (
                    <><Sparkles size={14} className="mr-2" /> Reserve My Date</>
                  )}
                </Button>

                <p className="text-center font-body text-[10px] text-muted-foreground mt-2">
                  We'll get back to you within 24 hours ✨
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadPopup;
