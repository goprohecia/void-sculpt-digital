import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { LineReveal } from "@/components/animations";

export function HeroPremium() {
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
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Subtle mirror/reflection overlay effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/[0.02] to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_40%,transparent_60%,rgba(255,255,255,0.02)_100%)]" />
        <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 50%, rgba(34,197,94,0.04) 0%, transparent 60%)`,
          }}
        />
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(105deg,transparent_45%,rgba(255,255,255,0.02)_48%,rgba(255,255,255,0.04)_50%,rgba(255,255,255,0.02)_52%,transparent_55%)]"
          animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            {/* Small brand identifier */}
            <motion.div
              className="overflow-hidden mb-10 md:mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.p
                className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                MY BUSINESS ASSISTANT
              </motion.p>
            </motion.div>

            {/* Main headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light mb-10 md:mb-12 tracking-tight leading-[1.15]">
              <LineReveal lines={["Votre CRM. Votre métier."]} delay={0.4} lineClassName="block pb-1" />
              <div className="mt-2 overflow-hidden pb-1">
                <motion.span
                  className="block font-medium text-gradient-neon"
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  Votre assistant.
                </motion.span>
              </div>
            </h1>

            {/* Subtitle */}
            <div className="overflow-hidden mb-10 md:mb-12">
              <motion.p
                className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light px-2 sm:px-0"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              >
                La plateforme de gestion modulaire pour les entreprises de services. Clients, dossiers, facturation — tout en un.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/contact?subject=Demo%20MBA"
                  className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium tracking-wide uppercase overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white rounded-full" />
                  <span className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative text-background group-hover:text-white transition-colors duration-500">
                    Essayer gratuitement
                  </span>
                  <ArrowRight className="relative h-3.5 w-3.5 sm:h-4 sm:w-4 text-background group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </motion.div>

              <Link
                to="/#offres"
                className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 px-4 sm:px-6 py-3 sm:py-4"
              >
                Découvrir les offres
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
