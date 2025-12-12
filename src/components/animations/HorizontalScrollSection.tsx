import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { ReactNode, useRef, useState, useEffect } from "react";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "./index";

interface HorizontalScrollSectionProps {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}

export function HorizontalScrollSection({
  children,
  className = "",
  title,
  subtitle,
  badge,
}: HorizontalScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (scrollRef.current && containerRef.current) {
      setScrollWidth(scrollRef.current.scrollWidth);
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, [children, isMobile]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(scrollWidth - containerWidth + 100)]
  );

  const springX = useSpring(translateX, {
    damping: 30,
    stiffness: 100,
  });

  // Mobile fallback - vertical layout with animations
  if (isMobile) {
    return (
      <section className={`py-16 relative ${className}`}>
        <div className="container mx-auto px-4">
          {/* Header */}
          {(title || badge) && (
            <div className="text-center mb-12">
              {badge && (
                <ScrollReveal variant="fadeInUp">
                  <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
                    <span className="text-sm font-medium text-neon-violet">{badge}</span>
                  </div>
                </ScrollReveal>
              )}
              {title && (
                <ScrollReveal variant="fadeInUp" delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
                </ScrollReveal>
              )}
              {subtitle && (
                <ScrollReveal variant="fadeInUp" delay={0.2}>
                  <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
                </ScrollReveal>
              )}
            </div>
          )}

          {/* Vertical scroll for mobile */}
          <StaggerContainer className="space-y-6" staggerDelay={0.1}>
            {children}
          </StaggerContainer>
        </div>
      </section>
    );
  }

  // Desktop - horizontal scroll
  const scrollableHeight = scrollWidth - containerWidth + window.innerHeight;

  return (
    <section
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: scrollableHeight > 0 ? scrollableHeight : "100vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Header */}
        {(title || badge) && (
          <div className="text-center py-12 flex-shrink-0">
            {badge && (
              <ScrollReveal variant="fadeInUp">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
                  <span className="text-sm font-medium text-neon-violet">{badge}</span>
                </div>
              </ScrollReveal>
            )}
            {title && (
              <ScrollReveal variant="fadeInUp" delay={0.1}>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
              </ScrollReveal>
            )}
            {subtitle && (
              <ScrollReveal variant="fadeInUp" delay={0.2}>
                <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
              </ScrollReveal>
            )}
          </div>
        )}

        {/* Horizontal scroll container */}
        <div className="flex-1 flex items-center overflow-hidden">
          <motion.div
            ref={scrollRef}
            style={{ x: springX }}
            className="flex gap-8 pl-[10vw] pr-[20vw]"
          >
            {children}
          </motion.div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-violet to-purple-500 rounded-full"
            style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
          />
        </div>
      </div>
    </section>
  );
}

interface HorizontalScrollItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function HorizontalScrollItem({
  children,
  className = "",
  index = 0,
}: HorizontalScrollItemProps) {
  return (
    <motion.div
      variants={staggerItemVariants}
      className={`flex-shrink-0 ${className}`}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
