import { useEffect, useState, useCallback } from "react";

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Check if device is mobile
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    // Disable parallax on mobile or if user prefers reduced motion
    if (prefersReducedMotion() || isMobile()) {
      setOffset(0);
      return;
    }
    
    // Use requestAnimationFrame for smooth performance
    requestAnimationFrame(() => {
      setOffset(window.scrollY * speed);
    });
  }, [speed]);

  useEffect(() => {
    // Skip if reduced motion or mobile
    if (prefersReducedMotion() || isMobile()) {
      setOffset(0);
      return;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return offset;
}

export function useParallaxTransform(speed: number = 0.5) {
  const offset = useParallax(speed);
  return `translateY(${offset}px)`;
}