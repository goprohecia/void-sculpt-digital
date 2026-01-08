import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// Elegant fade with subtle scale
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
};

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <>
      {/* Exit overlay that slides up */}
      <motion.div
        className="fixed inset-0 bg-background z-[100] pointer-events-none origin-bottom"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />

      {/* Entry overlay that slides up and reveals content */}
      <motion.div
        className="fixed inset-0 bg-background z-[100] pointer-events-none origin-top"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.1,
        }}
      />

      {/* Page content */}
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.3,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}

// Minimal elegant version without overlays
export function PageTransitionMinimal({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
