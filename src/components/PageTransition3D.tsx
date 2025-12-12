import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransition3DProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    rotateY: -15,
    scale: 0.9,
    z: -200,
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    z: 0,
  },
  exit: {
    opacity: 0,
    rotateY: 15,
    scale: 0.9,
    z: -200,
  },
};

export function PageTransition3D({ children }: PageTransition3DProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
      }}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}
