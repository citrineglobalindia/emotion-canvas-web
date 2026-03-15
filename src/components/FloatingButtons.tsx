import { MessageCircle, Phone } from "lucide-react";

const FloatingButtons = () => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
      className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
      aria-label="WhatsApp">
      <MessageCircle size={20} />
    </a>
    <a href="tel:+919876543210"
      className="w-12 h-12 bg-card border border-border text-foreground rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:border-accent hover:text-accent transition-all duration-300"
      aria-label="Call Now">
      <Phone size={20} />
    </a>
  </div>
);

export default FloatingButtons;
