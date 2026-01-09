import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";

interface ServiceHeroProps {
  title: string;
  subtitle: string;
  image?: string;
  accentColor: "red" | "green" | "blue" | "gold" | "violet";
  badge?: string;
}

const accentGradients = {
  red: "hsl(var(--rose-500) / 0.12)",
  green: "hsl(160 84% 39% / 0.12)",
  blue: "hsl(var(--neon-violet) / 0.12)",
  gold: "hsl(270 70% 60% / 0.12)",
  violet: "hsl(var(--neon-violet) / 0.12)"
};

const titleColors = {
  red: "from-rose-400 to-rose-600",
  green: "from-emerald-400 to-emerald-600",
  blue: "from-violet-400 to-violet-600",
  gold: "from-violet-400 to-purple-600",
  violet: "from-violet-400 to-violet-600"
};

export function ServiceHero({
  title,
  subtitle,
  accentColor,
  badge
}: ServiceHeroProps) {
  // Mouse tracking for subtle gradient shift
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / innerWidth);
      mouseY.set((clientY - innerHeight / 2) / innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const gradientX = useTransform(smoothMouseX, [-0.5, 0.5], ["40%", "60%"]);
  const gradientY = useTransform(smoothMouseY, [-0.5, 0.5], ["40%", "60%"]);

  return (
    <section className="relative min-h-[70svh] flex items-center justify-center overflow-hidden pt-24">
      {/* Subtle ambient gradient that follows mouse */}
      <motion.div
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(ellipse 80% 60% at ${gradientX} ${gradientY}, ${accentGradients[accentColor]}, transparent 70%)`,
        }}
      />

      {/* Minimal accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main content - centered and minimal */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Badge */}
            {badge && (
              <motion.p
                className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {badge}
              </motion.p>
            )}

            {/* Main headline */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-8 tracking-tight leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className={`font-medium bg-gradient-to-r ${titleColors[accentColor]} bg-clip-text text-transparent`}>
                {title}
              </span>
            </motion.h1>

            {/* Refined subtitle */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {subtitle}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
