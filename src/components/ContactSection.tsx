import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
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
        <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}
          className="p-8 md:p-16 lg:p-20 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 w-fit">
            <Send size={14} />
            <span className="font-body text-xs font-medium uppercase tracking-wider">Get In Touch</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-3">
            Book Your <em className="text-accent">Story</em>
          </h2>
          <p className="font-body text-muted-foreground mb-10">Let's create something unforgettable together.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-card border-border text-foreground placeholder:text-muted-foreground font-body h-12 rounded-xl" required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground font-body h-12 rounded-xl" required />
              <Input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground font-body h-12 rounded-xl" />
            </div>
            <Textarea placeholder="Tell us about your story..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-card border-border text-foreground placeholder:text-muted-foreground font-body min-h-[120px] resize-none rounded-xl" />
            <Button variant="accent" type="submit" className="w-full">Send Message</Button>
          </form>

          <div className="flex flex-col gap-3 mt-10 text-muted-foreground">
            <a href="mailto:hello@storiesbybw.com" className="flex items-center gap-3 font-body text-sm hover:text-accent transition-colors">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center"><Mail size={14} className="text-accent" /></div>
              hello@storiesbybw.com
            </a>
            <a href="tel:+919876543210" className="flex items-center gap-3 font-body text-sm hover:text-accent transition-colors">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center"><Phone size={14} className="text-accent" /></div>
              +91 98765 43210
            </a>
            <p className="flex items-center gap-3 font-body text-sm">
              <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center"><MapPin size={14} className="text-accent" /></span>
              Mumbai, India
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:block relative rounded-l-3xl overflow-hidden">
          <img src={contactBg} alt="Contact" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
