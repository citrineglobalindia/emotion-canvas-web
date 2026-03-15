import { motion } from "framer-motion";
import { ReactNode } from "react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="enter"
    exit="exit"
  >
    {children}
  </motion.div>
);

export default PageTransition;
