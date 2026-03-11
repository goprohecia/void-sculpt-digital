import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logoMba from "@/assets/logo-mba.png";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ minHeight: '100dvh', height: '100dvh', background: 'hsl(150, 60%, 7%)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(152 60% 30% / 0.2) 0%, transparent 70%)",
          }}
          animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(hsl(152 60% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(152 60% 50%) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* MBA Logo */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={logoMba}
            alt="MBA"
            className="h-80 w-auto object-contain drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]"
            animate={{ 
              filter: [
                'drop-shadow(0 0 20px rgba(34,197,94,0.2))',
                'drop-shadow(0 0 40px rgba(34,197,94,0.4))',
                'drop-shadow(0 0 20px rgba(34,197,94,0.2))',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Brand name */}
        <div className="overflow-hidden">
          <motion.h1
            className="text-2xl md:text-3xl font-light tracking-[0.3em] text-white/90"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            MY BUSINESS
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            className="text-2xl md:text-3xl font-extralight tracking-[0.4em] text-[#22c55e]"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            ASSISTANT
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.p
          className="mt-5 text-[11px] uppercase tracking-[0.5em] text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          Votre gestion simplifiée
        </motion.p>

        {/* Loading bar */}
        <motion.div
          className="mt-10 w-56 h-[2px] bg-white/10 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.2, delay: 1.7, repeat: 1, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* Exit wipe */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'hsl(150, 60%, 7%)', transformOrigin: 'bottom' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 2.8, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </motion.div>
  );
}
