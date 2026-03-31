import { MessageCircle, Phone, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatBot from "@/components/ChatBot";
import logoDark from "@/assets/logo-dark.jpg";

const FloatingButtons = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  // Show teaser bubble after 3s to attract attention
  useEffect(() => {
    const timer = setTimeout(() => setShowTeaser(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleChatToggle = () => {
    setChatOpen((v) => !v);
    setShowTeaser(false);
  };

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
              className="fixed inset-0 bg-foreground/30 backdrop-blur-[3px] z-40 sm:hidden"
              onClick={() => setChatOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.92 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[380px] shadow-2xl rounded-2xl overflow-hidden border border-border/30 bg-background"
            >
              {/* Header */}
              <div className="bg-foreground text-background px-4 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center ring-2 ring-background/20">
                  <img
                    src={logoDark}
                    alt="Black & White"
                    className="w-5 h-5 object-contain invert mix-blend-screen"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm tracking-wide leading-none">Film Concierge</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <p className="font-body text-[10px] text-background/60">Online now · replies instantly</p>
                  </div>
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

      {/* Floating action buttons - horizontal row */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3">
        {/* Call button */}
        <motion.a
          href="tel:+919876543210"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-11 h-11 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/25 hover:bg-green-600 transition-colors duration-300"
          aria-label="Call Now"
        >
          <Phone size={16} />
        </motion.a>

        {/* Chat button with pulse + teaser */}
        <div className="relative">
          {/* Teaser bubble */}
          <AnimatePresence>
            {showTeaser && !chatOpen && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="absolute -top-14 right-0 whitespace-nowrap bg-foreground text-background px-4 py-2 rounded-xl rounded-br-sm shadow-xl"
              >
                <p className="font-body text-[11px] tracking-wide flex items-center gap-1.5">
                  <Sparkles size={11} className="text-yellow-300" />
                  Need help planning? Chat with us!
                </p>
                {/* Arrow */}
                <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-foreground rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse ring */}
          {!chatOpen && (
            <motion.div
              className="absolute inset-0 rounded-full bg-foreground/30"
              animate={{ scale: [1, 1.5, 1.5], opacity: [0.4, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleChatToggle}
            className="relative w-13 h-13 bg-foreground text-background rounded-full flex items-center justify-center shadow-xl transition-all duration-300"
            style={{ width: 52, height: 52 }}
            aria-label="Chat with us"
          >
            <AnimatePresence mode="wait">
              {chatOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <MessageCircle size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default FloatingButtons;
