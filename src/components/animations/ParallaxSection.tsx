import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative = opposite direction
  direction?: "up" | "down";
}

export function ParallaxSection({
  children,
  className = "",
  speed = 0.2,
  direction = "up",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [100 * speed * multiplier, -100 * speed * multiplier]
  );

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
}

export function ParallaxBackground({
  className = "",
  speed = 0.3,
  children,
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50 * speed, 50 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={`absolute inset-0 pointer-events-none ${className}`}
    >
      {children}
    </motion.div>
  );
}
