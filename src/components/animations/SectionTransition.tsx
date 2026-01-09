import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ReactNode, useRef } from "react";

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  parallaxStrength?: number;
  scaleOnScroll?: boolean;
  fadeOnScroll?: boolean;
  blurOnExit?: boolean;
}

export function SectionTransition({
  children,
  className = "",
  parallaxStrength = 0.1,
  scaleOnScroll = false,
  fadeOnScroll = false,
  blurOnExit = false,
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smoother spring-based parallax
  const rawY = useTransform(scrollYProgress, [0, 1], [80 * parallaxStrength, -80 * parallaxStrength]);
  const y = useSpring(rawY, { stiffness: 100, damping: 30, mass: 0.5 });
  
  // Smooth scale with spring
  const rawScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.96, 1, 1, 0.96]);
  const scale = useSpring(rawScale, { stiffness: 100, damping: 20 });
  
  // Smooth opacity
  const rawOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.6, 1, 1, 0.6]);
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 20 });
  
  // Blur on exit
  const blur = useTransform(scrollYProgress, [0.85, 1], [0, 4]);

  return (
    <motion.section
      ref={ref}
      style={{
        y: parallaxStrength > 0 ? y : 0,
        scale: scaleOnScroll ? scale : 1,
        opacity: fadeOnScroll ? opacity : 1,
        filter: blurOnExit ? `blur(${blur}px)` : undefined,
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
