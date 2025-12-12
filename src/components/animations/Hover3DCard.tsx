import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef, MouseEvent, useState } from "react";

interface Hover3DCardProps {
  children: ReactNode;
  className?: string;
  rotateStrength?: number;
  glareEnabled?: boolean;
}

export function Hover3DCard({
  children,
  className = "",
  rotateStrength = 8,
  glareEnabled = true,
}: Hover3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    rotateX.set(-y * rotateStrength);
    rotateY.set(x * rotateStrength);
    
    // Glare position
    const glareXPos = ((e.clientX - rect.left) / rect.width) * 100;
    const glareYPos = ((e.clientY - rect.top) / rect.height) * 100;
    glareX.set(glareXPos);
    glareY.set(glareYPos);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      animate={{
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative ${className}`}
    >
      {children}
      
      {/* Glare effect */}
      {glareEnabled && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none overflow-hidden"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) => 
                `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
            ),
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
