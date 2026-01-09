import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      style={{ minHeight: '100dvh', height: '100dvh' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Subtle ambient gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-neon-violet/20 rounded-full blur-[150px]" />
      </div>

      {/* Minimal accent lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-1/3 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-1/3 bg-gradient-to-t from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Brand text with reveal animation */}
        <div className="overflow-hidden">
          <motion.h1
            className="text-4xl md:text-6xl font-light tracking-[0.3em] text-foreground"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            IMPARTIAL
          </motion.h1>
        </div>

        {/* Subtle tagline */}
        <motion.p
          className="mt-4 text-xs uppercase tracking-[0.4em] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Games
        </motion.p>

        {/* Minimal loading indicator */}
        <motion.div
          className="mt-12 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <motion.div
            className="w-8 h-px bg-gradient-to-r from-transparent via-neon-violet to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-neon-violet"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="w-8 h-px bg-gradient-to-r from-transparent via-neon-violet to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </motion.div>
      </div>

      {/* Exit animation overlay */}
      <motion.div
        className="absolute inset-0 bg-background"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformOrigin: "bottom" }}
      />
    </motion.div>
  );
}
