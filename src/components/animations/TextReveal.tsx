import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface TextRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

const containerVariants: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.015,
      delayChildren: delay,
    },
  }),
};

const lineVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function TextReveal({
  children,
  delay = 0,
  className = "",
  as: Component = "div",
}: TextRevealProps) {
  const text = typeof children === "string" ? children : "";
  const words = text.split(" ");

  return (
    <Component className={className}>
      <motion.span
        className="inline-block"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        custom={delay}
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
            <motion.span
              className="inline-block"
              variants={wordVariants}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
}

// Variant for multi-line text with mask effect
interface TextRevealMaskProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const maskVariants: Variants = {
  hidden: {
    clipPath: "inset(100% 0% 0% 0%)",
    y: 40,
    opacity: 0,
  },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function TextRevealMask({
  children,
  delay = 0,
  className = "",
}: TextRevealMaskProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        variants={maskVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Character by character reveal
interface CharRevealProps {
  text: string;
  delay?: number;
  className?: string;
  staggerDelay?: number;
}

const charContainerVariants: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.02,
      delayChildren: delay,
    },
  }),
};

const charVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function CharReveal({
  text,
  delay = 0,
  className = "",
}: CharRevealProps) {
  const chars = text.split("");

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={charContainerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      style={{ perspective: 500 }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={charVariants}
          style={{ transformOrigin: "bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Line by line reveal with elegant slide
interface LineRevealProps {
  lines: string[];
  delay?: number;
  className?: string;
  lineClassName?: string;
}

const lineContainerVariants: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.15,
      delayChildren: delay,
    },
  }),
};

const singleLineVariants: Variants = {
  hidden: {
    y: "110%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function LineReveal({
  lines,
  delay = 0,
  className = "",
  lineClassName = "",
}: LineRevealProps) {
  return (
    <motion.div
      className={className}
      variants={lineContainerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <motion.div
            className={lineClassName}
            variants={singleLineVariants}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}
