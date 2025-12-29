import { FloatingParticles } from "@/components/FloatingParticles";
import { useParallax } from "@/hooks/use-parallax";
import { motion } from "framer-motion";
import logoHero from "@/assets/logo-hero.png";
import TypeWriter from "@/components/TypeWriter";
import { ScrollReveal } from "@/components/animations";
interface ServiceHeroProps {
  title: string;
  subtitle: string;
  image: string;
  accentColor: "red" | "green" | "blue" | "gold" | "violet";
  badge?: string;
}
const accentClasses = {
  red: "from-rose-500/20",
  green: "from-emerald-500/20",
  blue: "from-neon-violet/20",
  gold: "from-violet-500/20",
  violet: "from-neon-violet/20"
};
const borderClasses = {
  red: "border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.4)] group-hover:shadow-[0_0_60px_rgba(244,63,94,0.5)]",
  green: "border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]",
  blue: "border-neon-violet/50 shadow-[0_0_40px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_60px_rgba(139,92,246,0.5)]",
  gold: "border-violet-400/50 shadow-[0_0_40px_rgba(167,139,250,0.4)] group-hover:shadow-[0_0_60px_rgba(167,139,250,0.5)]",
  violet: "border-neon-violet/50 shadow-[0_0_40px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_60px_rgba(139,92,246,0.5)]"
};
const badgeColors = {
  red: "text-rose-400",
  green: "text-emerald-400",
  blue: "text-neon-violet",
  gold: "text-violet-400",
  violet: "text-neon-violet"
};
const titleColors = {
  red: "text-rose-400 drop-shadow-[0_0_30px_rgba(244,63,94,0.6)]",
  green: "text-emerald-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.6)]",
  blue: "text-neon-violet drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]",
  gold: "text-violet-400 drop-shadow-[0_0_30px_rgba(167,139,250,0.6)]",
  violet: "text-neon-violet drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]"
};
export function ServiceHero({
  title,
  subtitle,
  image,
  accentColor,
  badge
}: ServiceHeroProps) {
  const parallaxSlow = useParallax(0.15);
  const parallaxMedium = useParallax(0.25);
  const parallaxFast = useParallax(0.4);
  return <section className="relative pt-32 pb-20 overflow-hidden">
      <FloatingParticles />
      
      {/* Background Effects */}
      <div className={`absolute inset-0 bg-gradient-to-b ${accentClasses[accentColor]} via-transparent to-transparent`} />
      <div className="absolute inset-0 grid-bg" />
      
      {/* Glowing Orbs with Parallax */}
      <div className="absolute top-1/4 left-1/4 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] bg-violet-600/15 rounded-full blur-[80px] md:blur-[120px] lg:blur-[150px] animate-pulse-glow" style={{
      transform: `translateY(${parallaxSlow}px)`
    }} />
      <div className="absolute bottom-1/4 right-1/4 w-[150px] md:w-[250px] lg:w-[300px] h-[150px] md:h-[250px] lg:h-[300px] bg-purple-600/10 rounded-full blur-[60px] md:blur-[100px] lg:blur-[120px] animate-pulse-glow hidden sm:block" style={{
      transform: `translateY(${parallaxMedium}px)`,
      animationDelay: "1s"
    }} />
      <div className="absolute top-1/2 right-1/3 w-[100px] md:w-[150px] lg:w-[200px] h-[100px] md:h-[150px] lg:h-[200px] bg-blue-600/10 rounded-full blur-[50px] md:blur-[80px] lg:blur-[100px] hidden md:block" style={{
      transform: `translateY(${parallaxFast}px)`
    }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Logo */}
        <motion.div className="mb-6 md:mb-10 lg:mb-12 flex justify-center" initial={{
        opacity: 0,
        scale: 0.8,
        rotate: -10
      }} animate={{
        opacity: 1,
        scale: 1,
        rotate: 0
      }} transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }} style={{
        opacity: Math.max(0, 1 - Math.abs(parallaxSlow) * 0.008)
      }}>
          <div className="relative group cursor-pointer transition-transform duration-100" style={{
          transform: `translateY(${parallaxSlow * -0.5}px) scale(${1 - Math.abs(parallaxSlow) * 0.001}) rotate(${parallaxSlow * 0.02}deg)`
        }}>
            <div className="absolute inset-0 bg-neon-violet/60 blur-[40px] md:blur-[60px] lg:blur-[80px] rounded-full scale-150 animate-logo-glow-entrance transition-all duration-500 group-hover:bg-neon-violet/80 group-hover:blur-[100px] group-hover:scale-[1.8]" style={{
            opacity: Math.max(0, 1 - Math.abs(parallaxSlow) * 0.006)
          }} />
            <img src={logoHero} alt="IMPARTIAL" className="relative w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 drop-shadow-[0_0_30px_rgba(139,92,246,0.6)] md:drop-shadow-[0_0_50px_rgba(139,92,246,0.7)] animate-logo-entrance transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_80px_rgba(139,92,246,0.9)] group-hover:rotate-[5deg]" />
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left" style={{
          opacity: Math.max(0, 1 - Math.abs(parallaxSlow) * 0.006)
        }}>
            {/* Badge */}
            {badge && <ScrollReveal variant="fadeInUp">
                <div className="mb-4 md:mb-6 flex justify-center lg:justify-start">
                  <div className={`badge-gradient flex items-center gap-2 text-xs md:text-sm font-medium ${badgeColors[accentColor]}`}>
                    
                    {badge}
                  </div>
                </div>
              </ScrollReveal>}
            
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 md:mb-6 leading-tight min-h-[2.5rem] md:min-h-[3.5rem] lg:min-h-[4rem]" style={{
              transform: `translateY(${parallaxSlow * 0.3}px)`
            }}>
                <span className={titleColors[accentColor]}>
                  <TypeWriter text={title} delay={40} startDelay={300} className="text-5xl" />
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-base sm:text-lg md:text-xl text-foreground max-w-2xl mx-auto lg:mx-0 min-h-[2.5rem] md:min-h-[3rem] px-2 sm:px-0" style={{
              transform: `translateY(${parallaxSlow * 0.4}px)`
            }}>
                <TypeWriter text={subtitle} delay={25} startDelay={1200} />
              </p>
            </ScrollReveal>
          </div>

          {/* Hero Image with Parallax */}
          <ScrollReveal variant="fadeInRight" delay={0.3}>
            <motion.div className={`group flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 animate-float rounded-full overflow-hidden border-2 md:border-4 transition-all duration-500 ${borderClasses[accentColor]}`} style={{
            transform: `translateY(${parallaxSlow * -1}px)`,
            opacity: Math.max(0, 1 - Math.abs(parallaxSlow) * 0.005)
          }} whileHover={{
            scale: 1.05
          }} transition={{
            duration: 0.3
          }}>
              <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>;
}