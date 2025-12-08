import { useState, useEffect } from "react";

interface WelcomeOverlayProps {
  show: boolean;
  onComplete?: () => void;
}

export function WelcomeOverlay({ show, onComplete }: WelcomeOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Start exit animation after delay
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 800);
      }, 2000);

      return () => clearTimeout(exitTimer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center pointer-events-none transition-opacity duration-700 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center px-6">
        {/* Welcome Text */}
        <div className="overflow-hidden">
          <p 
            className="text-sm md:text-base uppercase tracking-[0.3em] text-neon-violet mb-4 animate-welcome-subtitle"
          >
            Bienvenue chez
          </p>
        </div>
        
        <div className="overflow-hidden">
          <h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-logo-gradient animate-welcome-title"
          >
            IMPARTIAL
          </h1>
        </div>
        
        <div className="overflow-hidden mt-4">
          <p 
            className="text-lg md:text-xl text-foreground/80 animate-welcome-tagline"
          >
            Créateurs d'expériences digitales
          </p>
        </div>

        {/* Decorative line */}
        <div className="mt-8 flex justify-center">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-violet to-transparent animate-welcome-line" />
        </div>
      </div>
    </div>
  );
}
