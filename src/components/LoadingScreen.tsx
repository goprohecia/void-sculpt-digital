import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logoHero from "@/assets/logo-hero.png";
interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, 2800);

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
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
          }}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Decorative lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-1/4 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-1/4 bg-gradient-to-t from-transparent via-primary/20 to-transparent" />

      <div className="relative z-10 flex flex-col items-center">
        {/* MBA monogram */}
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-24 h-24 rounded-2xl border border-primary/30 flex items-center justify-center backdrop-blur-sm bg-primary/5 p-3">
            <motion.img
              src={logoHero}
              alt="My Business Assistant"
              className="w-full h-full object-contain drop-shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />
          </div>
          {/* Corner accents */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-primary/50 rounded-tr-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          />
          <motion.div
            className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-primary/50 rounded-bl-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          />
        </motion.div>

        {/* Brand name */}
        <div className="overflow-hidden">
          <motion.h1
            className="text-2xl md:text-4xl font-bold tracking-[0.15em] text-foreground"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            MY BUSINESS
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            className="text-2xl md:text-4xl font-light tracking-[0.25em] text-primary"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            ASSISTANT
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.p
          className="mt-4 text-xs uppercase tracking-[0.4em] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          Votre gestion simplifiée
        </motion.p>

        {/* Loading bar */}
        <motion.div
          className="mt-10 w-48 h-px bg-muted/30 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, delay: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </motion.div>
      </div>

      {/* Exit wipe */}
      <motion.div
        className="absolute inset-0 bg-background"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 2.4, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformOrigin: "bottom" }}
      />
    </motion.div>
  );
}
