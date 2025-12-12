import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef, MouseEvent, useState, useCallback } from "react";

interface Hover3DButtonProps {
  children: ReactNode;
  className?: string;
  rotateStrength?: number;
  scaleOnHover?: number;
  onClick?: () => void;
  disabled?: boolean;
}

export function Hover3DButton({
  children,
  className = "",
  rotateStrength = 10,
  scaleOnHover = 1.02,
  onClick,
  disabled = false,
}: Hover3DButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || disabled) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    rotateX.set(-y * rotateStrength);
    rotateY.set(x * rotateStrength);
  }, [rotateStrength, disabled]);

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      animate={{
        scale: isHovered ? scaleOnHover : 1,
        y: isHovered ? -2 : 0,
      }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Shadow layer */}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        animate={{
          boxShadow: isHovered 
            ? "0 20px 40px -15px rgba(139, 92, 246, 0.4), 0 10px 20px -10px rgba(0, 0, 0, 0.3)"
            : "0 4px 15px -5px rgba(139, 92, 246, 0.2), 0 2px 8px -4px rgba(0, 0, 0, 0.2)",
        }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </motion.button>
  );
}
