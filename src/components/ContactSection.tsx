import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
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
    <section id="contact">
      {/* Full-bleed image */}
      <div className="w-full aspect-[21/9] overflow-hidden">
        <img src={contactBg} alt="Contact" className="w-full h-full object-cover" />
      </div>

      {/* Form */}
      <div ref={ref} className="bg-warm py-24 md:py-36 px-6 md:px-10">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              Let's <em>Connect</em>
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              We'd love to hear your story.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <Input
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-transparent border-0 border-b border-foreground/20 rounded-none text-foreground placeholder:text-muted-foreground/50 font-body h-12 px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-transparent border-0 border-b border-foreground/20 rounded-none text-foreground placeholder:text-muted-foreground/50 font-body h-12 px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                required
              />
              <Input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-transparent border-0 border-b border-foreground/20 rounded-none text-foreground placeholder:text-muted-foreground/50 font-body h-12 px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
              />
            </div>
            <Textarea
              placeholder="Tell us about your story..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-transparent border-0 border-b border-foreground/20 rounded-none text-foreground placeholder:text-muted-foreground/50 font-body min-h-[100px] resize-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
            />
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="font-body text-[12px] tracking-[0.25em] uppercase text-foreground border border-foreground/30 px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {submitting ? <><Loader2 size={12} className="animate-spin" /> Sending...</> : "Send Message"}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
