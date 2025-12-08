import { FloatingParticles } from "@/components/FloatingParticles";
import { Sparkles } from "lucide-react";
import { useParallax } from "@/hooks/use-parallax";
import logoHero from "@/assets/logo-hero.png";
import TypeWriter from "@/components/TypeWriter";

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
  violet: "from-neon-violet/20",
};

const borderClasses = {
  red: "border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.4)] group-hover:shadow-[0_0_60px_rgba(244,63,94,0.5)]",
  green: "border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]",
  blue: "border-neon-violet/50 shadow-[0_0_40px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_60px_rgba(139,92,246,0.5)]",
  gold: "border-violet-400/50 shadow-[0_0_40px_rgba(167,139,250,0.4)] group-hover:shadow-[0_0_60px_rgba(167,139,250,0.5)]",
  violet: "border-neon-violet/50 shadow-[0_0_40px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_60px_rgba(139,92,246,0.5)]",
};

const badgeColors = {
  red: "text-rose-400",
  green: "text-emerald-400",
  blue: "text-neon-violet",
  gold: "text-violet-400",
  violet: "text-neon-violet",
};

export function ServiceHero({ title, subtitle, image, accentColor, badge }: ServiceHeroProps) {
  const parallaxSlow = useParallax(0.15);
  const parallaxMedium = useParallax(0.25);
  const parallaxFast = useParallax(0.4);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <FloatingParticles />
      
      {/* Background Effects */}
      <div className={`absolute inset-0 bg-gradient-to-b ${accentClasses[accentColor]} via-transparent to-transparent`} />
      <div className="absolute inset-0 grid-bg" />
      
      {/* Glowing Orbs with Parallax */}
      <div 
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[150px] animate-pulse-glow"
        style={{ transform: `translateY(${parallaxSlow}px)` }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-glow"
        style={{ transform: `translateY(${parallaxMedium}px)`, animationDelay: "1s" }}
      />
      <div 
        className="absolute top-1/2 right-1/3 w-[200px] h-[200px] bg-blue-600/10 rounded-full blur-[100px]"
        style={{ transform: `translateY(${parallaxFast}px)` }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Logo - Fully centered and large */}
        <div 
          className="mb-12 flex justify-center"
          style={{ opacity: Math.max(0, 1 - Math.abs(parallaxSlow) * 0.008) }}
        >
          <div 
            className="relative group cursor-pointer transition-transform duration-100"
            style={{ 
              transform: `translateY(${parallaxSlow * -0.5}px) scale(${1 - Math.abs(parallaxSlow) * 0.001}) rotate(${parallaxSlow * 0.02}deg)` 
            }}
          >
            <div 
              className="absolute inset-0 bg-neon-violet/60 blur-[80px] rounded-full scale-150 animate-logo-glow-entrance transition-all duration-500 group-hover:bg-neon-violet/80 group-hover:blur-[100px] group-hover:scale-[1.8]"
              style={{ opacity: Math.max(0, 1 - Math.abs(parallaxSlow) * 0.006) }}
            />
            <img
              src={logoHero}
              alt="IMPARTIAL"
              className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 drop-shadow-[0_0_50px_rgba(139,92,246,0.7)] animate-logo-entrance transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_80px_rgba(139,92,246,0.9)] group-hover:rotate-[5deg]"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div 
            className="flex-1 text-center lg:text-left"
            style={{ opacity: Math.max(0, 1 - Math.abs(parallaxSlow) * 0.006) }}
          >
            
            {/* Badge */}
            {badge && (
              <div className="mb-6 flex justify-center lg:justify-start opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className={`badge-gradient flex items-center gap-2 text-sm font-medium ${badgeColors[accentColor]}`}>
                  <Sparkles className="h-4 w-4" />
                  {badge}
                </div>
              </div>
            )}
            
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight min-h-[4rem]" 
              style={{ 
                transform: `translateY(${parallaxSlow * 0.3}px)`
              }}
            >
              <span className="text-gradient-neon">
                <TypeWriter text={title} delay={40} startDelay={300} />
              </span>
            </h1>
            <p
              className="text-xl text-foreground max-w-2xl min-h-[3rem]"
              style={{ 
                transform: `translateY(${parallaxSlow * 0.4}px)`
              }}
            >
              <TypeWriter text={subtitle} delay={25} startDelay={1200} />
            </p>
          </div>

          {/* Hero Image with Parallax */}
          <div 
            className={`group flex-shrink-0 w-72 h-72 lg:w-96 lg:h-96 animate-float rounded-full overflow-hidden border-4 transition-all duration-500 ${borderClasses[accentColor]}`}
            style={{ 
              transform: `translateY(${parallaxSlow * -1}px)`,
              opacity: Math.max(0, 1 - Math.abs(parallaxSlow) * 0.005)
            }}
          >
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
}