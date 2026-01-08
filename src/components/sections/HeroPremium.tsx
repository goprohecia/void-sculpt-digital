import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

// Text reveal animation component
function AnimatedText({ 
  text, 
  className = "", 
  delay = 0,
  staggerDelay = 0.03 
}: { 
  text: string; 
  className?: string; 
  delay?: number;
  staggerDelay?: number;
}) {
  const letters = text.split("");
  
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={{
            hidden: { 
              opacity: 0, 
              y: 20,
              filter: "blur(10px)",
            },
            visible: { 
              opacity: 1, 
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              },
            },
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function HeroPremium() {
  const [isReady, setIsReady] = useState(false);
  
  // Mouse tracking for subtle gradient shift
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 30 });

  useEffect(() => {
    // Small delay before starting animations
    const timer = setTimeout(() => setIsReady(true), 100);
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / innerWidth);
      mouseY.set((clientY - innerHeight / 2) / innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, [mouseX, mouseY]);

  const gradientX = useTransform(smoothMouseX, [-0.5, 0.5], ["40%", "60%"]);
  const gradientY = useTransform(smoothMouseY, [-0.5, 0.5], ["40%", "60%"]);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Subtle ambient gradient that follows mouse */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 80% 60% at ${gradientX} ${gradientY}, hsl(var(--neon-violet) / 0.15), transparent 70%)`,
        }}
      />

      {/* Minimal accent line */}
      <motion.div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
        initial={{ height: 0 }}
        animate={{ height: 128 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main content - centered and minimal */}
          <div className="text-center">
            {/* Small brand identifier */}
            <motion.p
              className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              IMPARTIAL Studio
            </motion.p>

            {/* Main headline with letter-by-letter reveal */}
            {isReady && (
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-8 tracking-tight leading-[1.1]">
                <span className="block overflow-hidden">
                  <AnimatedText 
                    text="Expériences digitales" 
                    delay={0.3}
                    staggerDelay={0.025}
                  />
                </span>
                <span className="block mt-2 font-medium text-gradient-neon overflow-hidden">
                  <AnimatedText 
                    text="sur-mesure." 
                    delay={0.8}
                    staggerDelay={0.04}
                  />
                </span>
              </h1>
            )}

            {/* Refined subtitle */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-14 leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              Web, mobile & SaaS — design raffiné, 
              <br className="hidden sm:block" />
              performance et animations maîtrisées.
            </motion.p>

            {/* Single elegant CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <motion.a
                href="https://calendly.com/yannis-bezriche/impartial-games"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-wide uppercase overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button background */}
                <span className="absolute inset-0 bg-white rounded-full" />
                <span className="absolute inset-0 bg-gradient-to-r from-neon-violet to-violet-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Button content */}
                <span className="relative text-background group-hover:text-white transition-colors duration-500">
                  Planifier un appel
                </span>
                <ArrowRight className="relative h-4 w-4 text-background group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </motion.a>

              <Link
                to="/#offres"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 px-6 py-4"
              >
                Découvrir nos offres
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom fade accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Scroll hint - very subtle */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <motion.div
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-1.5 rounded-full bg-white/40"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
