import { useState, useEffect, useMemo } from "react";
import logoHero from "@/assets/logo-hero.png";

interface WelcomeOverlayProps {
  show: boolean;
  onComplete?: () => void;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

const shootingStarColors = [
  { bg: "bg-white", shadow: "rgba(255, 255, 255, 0.8)" },
  { bg: "bg-violet-400", shadow: "rgba(139, 92, 246, 0.8)" },
  { bg: "bg-blue-400", shadow: "rgba(96, 165, 250, 0.8)" },
  { bg: "bg-purple-400", shadow: "rgba(192, 132, 252, 0.8)" },
  { bg: "bg-cyan-400", shadow: "rgba(34, 211, 238, 0.8)" },
];

export function WelcomeOverlay({ show, onComplete }: WelcomeOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Generate stars
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 1,
    }));
  }, []);

  // Generate shooting stars with colors
  const shootingStars = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 0.4 + Math.random() * 0.3,
      startX: 5 + Math.random() * 70,
      startY: Math.random() * 40,
      duration: 0.8 + Math.random() * 0.6,
      color: shootingStarColors[i % shootingStarColors.length],
    }));
  }, []);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Start exit animation after delay
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 1000);
      }, 2500);

      return () => clearTimeout(exitTimer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-black transition-all duration-1000 ${
        isExiting ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
    >
      {/* Starry Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Static Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}

        {/* Shooting Stars */}
        {shootingStars.map((star) => (
          <div
            key={`shooting-${star.id}`}
            className={`absolute w-1 h-1 rounded-full animate-shooting-star ${star.color.bg}`}
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              boxShadow: `0 0 10px 2px ${star.color.shadow}, -30px 0 20px 4px ${star.color.shadow.replace('0.8', '0.4')}, -60px 0 30px 2px ${star.color.shadow.replace('0.8', '0.2')}`,
            }}
          />
        ))}

        {/* Nebula Effects */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-900/20 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-blue-900/15 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/3 w-[200px] h-[200px] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-neon-violet/60 blur-[60px] rounded-full scale-150 animate-pulse-glow" />
            <img
              src={logoHero}
              alt="IMPARTIAL"
              className="relative w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_40px_rgba(139,92,246,0.8)] animate-welcome-logo"
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="overflow-hidden">
          <p 
            className="text-sm md:text-base uppercase tracking-[0.3em] text-violet-400 mb-4 animate-welcome-subtitle"
          >
            Bienvenue chez
          </p>
        </div>
        
        <div className="overflow-hidden">
          <h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-logo-gradient animate-welcome-title drop-shadow-[0_0_60px_rgba(139,92,246,0.5)]"
          >
            IMPARTIAL
          </h1>
        </div>
        
        <div className="overflow-hidden mt-6">
          <p 
            className="text-lg md:text-2xl text-white/90 font-light animate-welcome-tagline"
          >
            Créateurs d'expériences digitales
          </p>
        </div>

        {/* Decorative line */}
        <div className="mt-8 flex justify-center">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-violet to-transparent animate-welcome-line" />
        </div>

        {/* Glowing orb behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-neon-violet/20 rounded-full blur-[100px] -z-10 animate-pulse-glow" />
      </div>
    </div>
  );
}
