import { useInView, UseInViewOptions } from "framer-motion";
import { useRef, RefObject } from "react";

interface ScrollAnimationOptions extends Omit<UseInViewOptions, 'root'> {
  threshold?: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const { threshold = 0.2, ...restOptions } = options;
  
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
    ...restOptions,
  });

  return { ref, isInView };
}

export function useScrollAnimationRef<T extends HTMLElement = HTMLDivElement>(
  existingRef: RefObject<T>,
  options: ScrollAnimationOptions = {}
) {
  const { threshold = 0.2, ...restOptions } = options;
  
  const isInView = useInView(existingRef, {
    once: true,
    amount: threshold,
    ...restOptions,
  });

  return isInView;
}
