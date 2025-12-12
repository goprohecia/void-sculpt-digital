import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  parallaxStrength?: number;
  scaleOnScroll?: boolean;
  fadeOnScroll?: boolean;
}

export function SectionTransition({
  children,
  className = "",
  parallaxStrength = 0.1,
  scaleOnScroll = false,
  fadeOnScroll = false,
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50 * parallaxStrength, -50 * parallaxStrength]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.98, 1, 1, 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.section
      ref={ref}
      style={{
        y: parallaxStrength > 0 ? y : 0,
        scale: scaleOnScroll ? scale : 1,
        opacity: fadeOnScroll ? opacity : 1,
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
