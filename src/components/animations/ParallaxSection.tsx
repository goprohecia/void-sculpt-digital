import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative = opposite direction
  direction?: "up" | "down";
  smooth?: boolean;
}

export function ParallaxSection({
  children,
  className = "",
  speed = 0.2,
  direction = "up",
  smooth = true,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [120 * speed * multiplier, -120 * speed * multiplier]
  );
  
  const y = smooth ? useSpring(rawY, { stiffness: 80, damping: 25, mass: 0.5 }) : rawY;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

// For background elements with parallax
interface ParallaxBackgroundProps {
  className?: string;
  speed?: number;
  children?: ReactNode;
  rotateOnScroll?: boolean;
}

export function ParallaxBackground({
  className = "",
  speed = 0.3,
  children,
  rotateOnScroll = false,
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-60 * speed, 60 * speed]);
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });
  
  const rawOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 1, 1, 0.3]);
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 20 });
  
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.02, 0.95]);
  const scale = useSpring(rawScale, { stiffness: 60, damping: 15 });
  
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  return (
    <motion.div
      ref={ref}
      style={{ 
        y, 
        opacity, 
        scale,
        rotate: rotateOnScroll ? rotate : 0,
      }}
      className={`absolute inset-0 pointer-events-none ${className}`}
    >
      {children}
    </motion.div>
  );
}
