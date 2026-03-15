import { MessageCircle, Phone } from "lucide-react";

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-accent text-accent-foreground flex items-center justify-center hover:scale-110 transition-transform duration-300"
        aria-label="WhatsApp"
      >
        <MessageCircle size={20} />
      </a>
      <a
        href="tel:+919876543210"
        className="w-12 h-12 border border-border text-foreground flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
        aria-label="Call Now"
      >
        <Phone size={20} />
      </a>
    </div>
  );
};

export default FloatingButtons;
