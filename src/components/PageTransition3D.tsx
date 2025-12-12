import { motion, Transition } from "framer-motion";
import { ReactNode } from "react";

interface PageTransition3DProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    rotateY: -5,
    z: -100,
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    z: 0,
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    rotateY: 5,
    z: 100,
  },
};

const pageTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 0.5,
};

export function PageTransition3D({ children }: PageTransition3DProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      style={{ 
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}
