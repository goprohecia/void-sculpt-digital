import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type AnimationVariant = 
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "scaleIn"
  | "blurIn"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "rotateIn"
  | "flipIn";

interface ScrollRevealProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const createVariants = (distance: number = 50): Record<AnimationVariant, Variants> => ({
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -distance },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -distance },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: distance },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  slideUp: {
    hidden: { y: distance },
    visible: { y: 0 },
  },
  slideDown: {
    hidden: { y: -distance },
    visible: { y: 0 },
  },
  slideLeft: {
    hidden: { x: distance },
    visible: { x: 0 },
  },
  slideRight: {
    hidden: { x: -distance },
    visible: { x: 0 },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -10, scale: 0.95 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
  flipIn: {
    hidden: { opacity: 0, rotateX: 90 },
    visible: { opacity: 1, rotateX: 0 },
  },
});

export function ScrollReveal({
  children,
  variant = "fadeInUp",
  delay = 0,
  duration = 0.6,
  distance = 50,
  className = "",
  once = true,
  threshold = 0.2,
  ...motionProps
}: ScrollRevealProps) {
  const variants = createVariants(distance)[variant];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth feel
      }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
