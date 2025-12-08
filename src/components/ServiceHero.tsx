import { FloatingParticles } from "@/components/FloatingParticles";
import { Sparkles } from "lucide-react";
import { useParallax } from "@/hooks/use-parallax";
import logoHero from "@/assets/logo-hero.png";

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
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            {/* Logo - Centered and enlarged */}
            <div className="mb-8 flex justify-center opacity-0 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-neon-violet/50 blur-[60px] rounded-full scale-125 animate-pulse-glow" />
                <img
                  src={logoHero}
                  alt="IMPARTIAL"
                  className="relative w-28 h-28 md:w-32 md:h-32 drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]"
                />
              </div>
            </div>
            
            {/* Badge */}
            {badge && (
              <div className="mb-6 flex justify-center lg:justify-start opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className={`badge-gradient flex items-center gap-2 text-sm font-medium ${badgeColors[accentColor]}`}>
                  <Sparkles className="h-4 w-4" />
                  {badge}
                </div>
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <span className="text-gradient-neon">{title}</span>
            </h1>
            <p
              className="text-xl text-muted-foreground max-w-2xl opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              {subtitle}
            </p>
          </div>

          {/* Hero Image with Parallax */}
          <div 
            className={`group flex-shrink-0 w-72 h-72 lg:w-96 lg:h-96 animate-float rounded-full overflow-hidden border-4 transition-all duration-500 ${borderClasses[accentColor]}`}
            style={{ transform: `translateY(${parallaxSlow * -1}px)` }}
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