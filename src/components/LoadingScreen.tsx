import { useState, useEffect } from "react";
import logoHero from "@/assets/logo-hero.png";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Minimum loading time for effect
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsLoading(false);
        onComplete?.();
      }, 600);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/10 via-transparent to-neon-blue/5" />
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-600/30 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Container */}
        <div className="relative mb-8">
          {/* Glow rings */}
          <div className="absolute inset-0 bg-neon-violet/50 blur-[60px] rounded-full scale-150 animate-loading-glow" />
          <div className="absolute inset-0 bg-violet-500/30 blur-[40px] rounded-full scale-125 animate-loading-glow" style={{ animationDelay: "0.3s" }} />
          
          {/* Spinning ring */}
          <div className="absolute -inset-4 border-2 border-transparent border-t-neon-violet border-r-neon-violet/50 rounded-full animate-spin-slow" />
          <div className="absolute -inset-8 border border-transparent border-t-violet-500/30 rounded-full animate-spin-reverse" />
          
          {/* Logo */}
          <img
            src={logoHero}
            alt="IMPARTIAL"
            className="relative w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_40px_rgba(139,92,246,0.8)] animate-loading-logo"
          />
        </div>
        
        {/* Brand Name */}
        <h1 className="text-2xl md:text-3xl font-black tracking-wider text-logo-gradient animate-loading-text">
          IMPARTIAL
        </h1>
        
        {/* Loading Bar */}
        <div className="mt-6 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-neon-violet via-purple-500 to-neon-violet animate-loading-bar rounded-full" />
        </div>
        
        {/* Loading Text */}
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          Chargement...
        </p>
      </div>
    </div>
  );
}
