import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface PageTransition3DProps {
  children: ReactNode;
}

// Elegant slide-and-fade transition
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(5px)",
  },
};

export function PageTransition3D({ children }: PageTransition3DProps) {
  return (
    <>
      {/* Sliding curtain overlay - entry */}
      <motion.div
        className="fixed inset-0 bg-background z-[100] pointer-events-none"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        exit={{ y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.76, 0, 0.24, 1],
        }}
      />

      {/* Content with fade/blur */}
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.2,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
