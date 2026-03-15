import { MessageCircle, Phone, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatBot from "@/components/ChatBot";

const FloatingButtons = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      {/* Chat popup */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] shadow-2xl rounded-lg overflow-hidden border border-border/50"
          >
            {/* Header */}
            <div className="bg-foreground text-background px-4 py-3 flex items-center justify-between">
              <span className="font-display text-sm tracking-wide">Black & White</span>
              <button onClick={() => setChatOpen(false)} className="hover:opacity-70 transition-opacity">
                <X size={16} />
              </button>
            </div>
            <ChatBot />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating buttons */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-3">
        <button
          onClick={() => setChatOpen((v) => !v)}
          className="w-11 h-11 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
          aria-label="Chat with us"
        >
          {chatOpen ? <X size={18} /> : <MessageCircle size={18} />}
        </button>
        <a
          href="tel:+919876543210"
          className="w-11 h-11 bg-background border border-border text-foreground rounded-full flex items-center justify-center shadow-md hover:border-foreground transition-all duration-300"
          aria-label="Call Now"
        >
          <Phone size={18} />
        </a>
      </div>
    </>
  );
};

export default FloatingButtons;
