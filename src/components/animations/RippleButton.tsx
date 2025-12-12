import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useCallback, MouseEvent, useRef } from "react";

interface RippleButtonProps {
  children: ReactNode;
  className?: string;
  rippleColor?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function RippleButton({
  children,
  className = "",
  rippleColor = "rgba(139, 92, 246, 0.4)",
  onClick,
  disabled = false,
  type = "button",
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const newRipple: Ripple = {
      id: rippleId.current++,
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  }, [disabled, onClick]);

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
      
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{
              width: 0,
              height: 0,
              opacity: 0.6,
              x: ripple.x,
              y: ripple.y,
            }}
            animate={{
              width: ripple.size,
              height: ripple.size,
              opacity: 0,
              x: ripple.x - ripple.size / 2,
              y: ripple.y - ripple.size / 2,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ backgroundColor: rippleColor }}
            className="absolute rounded-full pointer-events-none"
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}
