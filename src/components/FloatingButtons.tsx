import { MessageCircle, Phone } from "lucide-react";

const FloatingButtons = () => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
      className="w-11 h-11 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
      aria-label="WhatsApp">
      <MessageCircle size={18} />
    </a>
    <a href="tel:+919876543210"
      className="w-11 h-11 bg-background border border-border text-foreground rounded-full flex items-center justify-center shadow-md hover:border-foreground transition-all duration-300"
      aria-label="Call Now">
      <Phone size={18} />
    </a>
  </div>
);

export default FloatingButtons;
