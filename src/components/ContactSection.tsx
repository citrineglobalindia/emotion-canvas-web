import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import contactBg from "@/assets/contact-bg.jpg";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message || null,
      });
      if (error) throw error;
      toast.success("Thank you! We'll be in touch soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen">
      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Form side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-16 lg:p-24 flex flex-col justify-center"
        >
          <p className="font-body text-[11px] tracking-[0.35em] text-muted-foreground uppercase mb-6">Get In Touch</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-3">
            Book Your <em>Story</em>
          </h2>
          <p className="font-body text-muted-foreground mb-12">Let's create something unforgettable together.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-transparent border-0 border-b border-border rounded-none text-foreground placeholder:text-muted-foreground/50 font-body h-12 px-0 focus-visible:ring-0 focus-visible:border-accent transition-colors"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-transparent border-0 border-b border-border rounded-none text-foreground placeholder:text-muted-foreground/50 font-body h-12 px-0 focus-visible:ring-0 focus-visible:border-accent transition-colors"
                required
              />
              <Input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-transparent border-0 border-b border-border rounded-none text-foreground placeholder:text-muted-foreground/50 font-body h-12 px-0 focus-visible:ring-0 focus-visible:border-accent transition-colors"
              />
            </div>
            <Textarea
              placeholder="Tell us about your story..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-transparent border-0 border-b border-border rounded-none text-foreground placeholder:text-muted-foreground/50 font-body min-h-[100px] resize-none px-0 focus-visible:ring-0 focus-visible:border-accent transition-colors"
            />
            <button
              type="submit"
              disabled={submitting}
              className="font-body text-[11px] tracking-[0.3em] uppercase text-foreground border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-all duration-300 mt-4 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {submitting ? <><Loader2 size={12} className="animate-spin" /> Sending...</> : "Send Message"}
            </button>
          </form>

          <div className="flex flex-col gap-4 mt-14 text-muted-foreground">
            <a href="mailto:hello@storiesbybw.com" className="flex items-center gap-3 font-body text-sm hover:text-accent transition-colors">
              <Mail size={14} />
              hello@storiesbybw.com
            </a>
            <a href="tel:+919876543210" className="flex items-center gap-3 font-body text-sm hover:text-accent transition-colors">
              <Phone size={14} />
              +91 98765 43210
            </a>
            <p className="flex items-center gap-3 font-body text-sm">
              <MapPin size={14} />
              Mumbai, India
            </p>
          </div>
        </motion.div>

        {/* Image side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:block relative"
        >
          <img src={contactBg} alt="Contact" className="w-full h-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
