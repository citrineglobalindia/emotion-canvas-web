import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import contactBg from "@/assets/contact-bg.jpg";
import { toast } from "sonner";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll be in touch soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="min-h-screen">
      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="p-10 md:p-20 flex flex-col justify-center"
        >
          <p className="font-body text-xs tracking-[0.5em] text-accent uppercase mb-4">Get In Touch</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Book Your <em>Story</em>
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-12">
            Let's create something unforgettable together.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-transparent border-border text-foreground placeholder:text-muted-foreground font-body h-12"
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-transparent border-border text-foreground placeholder:text-muted-foreground font-body h-12"
              required
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-transparent border-border text-foreground placeholder:text-muted-foreground font-body h-12"
            />
            <Textarea
              placeholder="Tell us about your story..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-transparent border-border text-foreground placeholder:text-muted-foreground font-body min-h-[120px] resize-none"
            />
            <Button variant="accent" type="submit" className="w-full">
              Send Message
            </Button>
          </form>

          <div className="flex flex-col gap-4 mt-12 text-muted-foreground">
            <a href="mailto:hello@bwfilms.com" className="flex items-center gap-3 font-body text-sm hover:text-accent transition-colors">
              <Mail size={16} /> hello@bwfilms.com
            </a>
            <a href="tel:+919876543210" className="flex items-center gap-3 font-body text-sm hover:text-accent transition-colors">
              <Phone size={16} /> +91 98765 43210
            </a>
            <p className="flex items-center gap-3 font-body text-sm">
              <MapPin size={16} /> Mumbai, India
            </p>
          </div>
        </motion.div>

        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:block relative"
        >
          <img src={contactBg} alt="Contact" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/30" />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
