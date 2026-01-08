import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useParallax } from "@/hooks/use-parallax";
import logoHero from "@/assets/logo-hero.png";
import { useEffect, useState } from "react";

const proofPills = [
  "Design premium",
  "Performance & SEO",
  "Livraison cadrée",
];

export function HeroPremium() {
  const parallaxSlow = useParallax(0.15);
  const parallaxMedium = useParallax(0.25);
  
  // Mouse tracking for subtle spotlight effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
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

  const spotlightX = useTransform(smoothMouseX, [-0.5, 0.5], [-100, 100]);
  const spotlightY = useTransform(smoothMouseY, [-0.5, 0.5], [-100, 100]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Cursor-following spotlight (very subtle) */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-neon-violet/10 rounded-full blur-[200px] pointer-events-none"
        style={{
          x: spotlightX,
          y: spotlightY,
          left: '50%',
          top: '50%',
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Glowing Orbs with Parallax */}
      <div
        className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[500px] lg:h-[600px] bg-violet-600/20 rounded-full blur-[150px] md:blur-[200px] animate-pulse-glow"
        style={{ transform: `translateY(${parallaxSlow}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[400px] lg:w-[500px] h-[250px] md:h-[400px] lg:h-[500px] bg-blue-600/15 rounded-full blur-[120px] md:blur-[180px] animate-pulse-glow hidden sm:block"
        style={{ transform: `translateY(${parallaxMedium}px)`, animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-[200px] md:w-[300px] lg:w-[350px] h-[200px] md:h-[300px] lg:h-[350px] bg-purple-500/10 rounded-full blur-[100px] md:blur-[150px] hidden md:block"
        style={{ transform: `translateY(${parallaxSlow * 1.5}px)` }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-neon-violet/50 blur-[80px] rounded-full animate-pulse-glow group-hover:bg-neon-violet/70 transition-all duration-500" />
              <div className="absolute inset-0 bg-violet-500/30 blur-[50px] rounded-full" style={{ animationDelay: "0.3s" }} />
              <img
                src={logoHero}
                alt="Impartial Games"
                className="relative h-28 md:h-36 lg:h-44 w-auto drop-shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_80px_rgba(139,92,246,0.8)]"
              />
            </div>
          </motion.div>

          {/* Hero Card with glassmorphism */}
          <motion.div
            className="glass-ultra glass-noise p-8 md:p-12 lg:p-16 rounded-3xl relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Inner gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 via-transparent to-blue-600/5 rounded-[inherit]" />
            
            <div className="relative z-10">
              {/* H1 */}
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Studio de développement premium
                <br />
                <span className="text-gradient-neon">pour expériences digitales immersives.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Web, mobile et SaaS sur-mesure — design raffiné, performance, animations maîtrisées, expérience utilisateur qui convertit.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.a
                  href="https://calendly.com/yannis-bezriche/impartial-games"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto btn-gradient inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl text-base md:text-lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Planifier un appel
                  <ArrowRight className="h-5 w-5" />
                </motion.a>
                <Link
                  to="/#offres"
                  className="w-full sm:w-auto glass-button inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base md:text-lg hover:border-neon-violet/50"
                >
                  Voir nos offres
                </Link>
              </motion.div>

              {/* Proof Pills */}
              <motion.div
                className="flex flex-wrap justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {proofPills.map((pill, index) => (
                  <motion.span
                    key={pill}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-muted-foreground"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    {pill}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
