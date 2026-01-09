import { motion, Variants, HTMLMotionProps, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

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
  | "flipIn"
  | "glowIn"
  | "morphIn"
  | "elasticIn";

interface ScrollRevealProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
  parallax?: boolean;
  parallaxSpeed?: number;
}

const createVariants = (distance: number = 40): Record<AnimationVariant, Variants> => ({
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
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(12px)" },
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
    hidden: { opacity: 0, rotate: -8, scale: 0.95, y: 20 },
    visible: { opacity: 1, rotate: 0, scale: 1, y: 0 },
  },
  flipIn: {
    hidden: { opacity: 0, rotateX: 45, y: 30 },
    visible: { opacity: 1, rotateX: 0, y: 0 },
  },
  glowIn: {
    hidden: { opacity: 0, scale: 0.95, filter: "brightness(1.5) blur(8px)" },
    visible: { opacity: 1, scale: 1, filter: "brightness(1) blur(0px)" },
  },
  morphIn: {
    hidden: { opacity: 0, scale: 0.8, borderRadius: "50%" },
    visible: { opacity: 1, scale: 1, borderRadius: "0%" },
  },
  elasticIn: {
    hidden: { opacity: 0, scale: 0.6, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
    },
  },
});

// Premium easing curves
const easings = {
  smooth: [0.25, 0.1, 0.25, 1] as const,
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
  premium: [0.16, 1, 0.3, 1] as const,
  gentle: [0.4, 0, 0.2, 1] as const,
};

export function ScrollReveal({
  children,
  variant = "fadeInUp",
  delay = 0,
  duration = 0.7,
  distance = 40,
  className = "",
  once = true,
  threshold = 0.15,
  parallax = false,
  parallaxSpeed = 0.1,
  ...motionProps
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const variants = createVariants(distance)[variant];
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [30 * parallaxSpeed, -30 * parallaxSpeed]);

  const getEasing = () => {
    if (variant === "elasticIn") return easings.elastic;
    if (variant === "glowIn" || variant === "morphIn") return easings.premium;
    return easings.smooth;
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: getEasing(),
      }}
      style={parallax ? { y } : undefined}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
