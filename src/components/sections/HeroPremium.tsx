import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { LineReveal } from "@/components/animations";
export function HeroPremium() {
  // Mouse tracking for subtle gradient shift
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, {
    stiffness: 30,
    damping: 30
  });
  const smoothMouseY = useSpring(mouseY, {
    stiffness: 30,
    damping: 30
  });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const {
        clientX,
        clientY
      } = e;
      const {
        innerWidth,
        innerHeight
      } = window;
      mouseX.set((clientX - innerWidth / 2) / innerWidth);
      mouseY.set((clientY - innerHeight / 2) / innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);
  const gradientX = useTransform(smoothMouseX, [-0.5, 0.5], ["40%", "60%"]);
  const gradientY = useTransform(smoothMouseY, [-0.5, 0.5], ["40%", "60%"]);
  return <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main content - centered and minimal */}
          <div className="text-center">
            {/* Small brand identifier with reveal */}
            <motion.div className="overflow-hidden mb-12" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }}>
              <motion.p className="text-xs uppercase tracking-[0.3em] text-muted-foreground" initial={{
              y: 30,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              duration: 0.7,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1]
            }}>
                IMPARTIAL GAMES
              </motion.p>
            </motion.div>

            {/* Main headline with line reveal */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light mb-6 md:mb-8 tracking-tight leading-[1.15]">
              <LineReveal lines={["Expériences digitales"]} delay={0.4} lineClassName="block pb-1" />
              <div className="mt-2 overflow-hidden pb-1">
                <motion.span className="block font-medium text-gradient-neon" initial={{
                y: "110%",
                opacity: 0
              }} animate={{
                y: 0,
                opacity: 1
              }} transition={{
                duration: 0.7,
                delay: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
              }}>
                  sur-mesure.
                </motion.span>
              </div>
            </h1>

            {/* Refined subtitle with mask reveal */}
            <div className="overflow-hidden mb-10 md:mb-14">
              <motion.p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light px-2 sm:px-0" initial={{
              y: 40,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              duration: 0.7,
              delay: 0.8,
              ease: [0.25, 0.1, 0.25, 1]
            }}>
              Web, mobile & SaaS — design raffiné, performance et animations maîtrisées.
              </motion.p>
            </div>

            {/* Single elegant CTA */}
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 1
          }}>
              <motion.a href="https://calendly.com/yannis-bezriche/impartial-games" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-wide uppercase overflow-hidden" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                {/* Button background */}
                <span className="absolute inset-0 bg-white rounded-full" />
                <span className="absolute inset-0 bg-gradient-to-r from-neon-violet to-violet-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Button content */}
                <span className="relative text-background group-hover:text-white transition-colors duration-500">
                  Planifier un appel
                </span>
                <ArrowRight className="relative h-4 w-4 text-background group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </motion.a>

              <Link to="/#offres" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 px-6 py-4">
                Découvrir nos offres
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>;
}