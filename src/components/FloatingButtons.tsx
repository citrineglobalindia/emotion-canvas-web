import { MessageCircle, Phone, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatBot from "@/components/ChatBot";
import logoDark from "@/assets/logo-dark.jpg";

const FloatingButtons = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      {/* Chat popup */}
      <AnimatePresence>
        {chatOpen && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-[2px] z-40 sm:hidden"
              onClick={() => setChatOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.92 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-20 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[380px] shadow-2xl rounded-2xl overflow-hidden border border-border/30 bg-background"
            >
              {/* Header */}
              <div className="bg-foreground text-background px-4 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center">
                  <img
                    src={logoDark}
                    alt="Black & White"
                    className="w-5 h-5 object-contain invert mix-blend-screen"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm tracking-wide leading-none">Black & White</p>
                  <p className="font-body text-[10px] text-background/50 mt-0.5">Usually replies instantly</p>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-background/10 flex items-center justify-center transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <ChatBot variant="floating" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating buttons */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-3 items-end">
        {/* Chat button with pulse */}
        <div className="relative">
          {!chatOpen && (
            <motion.div
              className="absolute inset-0 rounded-full bg-foreground/30"
              animate={{ scale: [1, 1.4, 1.4], opacity: [0.4, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setChatOpen((v) => !v)}
            className="relative w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
            aria-label="Chat with us"
          >
            <AnimatePresence mode="wait">
              {chatOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={18} />
                </motion.div>
              ) : (
                <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <MessageCircle size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <a
          href="tel:+919876543210"
          className="w-10 h-10 bg-background border border-border text-foreground rounded-full flex items-center justify-center shadow-md hover:border-foreground transition-all duration-300"
          aria-label="Call Now"
        >
          <Phone size={15} />
        </a>
      </div>
    </>
  );
};

export default FloatingButtons;
