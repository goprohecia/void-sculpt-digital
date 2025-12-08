interface ServiceHeroProps {
  title: string;
  subtitle: string;
  image: string;
  accentColor: "red" | "green" | "blue" | "gold";
}

const accentClasses = {
  red: "from-neon-red/20",
  green: "from-neon-green/20",
  blue: "from-neon-blue/20",
  gold: "from-tier-custom/20",
};

const borderClasses = {
  red: "border-neon-red shadow-[0_0_30px_rgba(255,51,102,0.6),0_0_60px_rgba(255,51,102,0.3)] animate-pulse-glow-red",
  green: "border-neon-green shadow-[0_0_30px_rgba(0,255,136,0.6),0_0_60px_rgba(0,255,136,0.3)] animate-pulse-glow-green",
  blue: "border-neon-blue shadow-[0_0_30px_rgba(0,170,255,0.6),0_0_60px_rgba(0,170,255,0.3)] animate-pulse-glow-blue",
  gold: "border-tier-custom shadow-[0_0_30px_rgba(255,204,0,0.6),0_0_60px_rgba(255,204,0,0.3)] animate-pulse-glow-gold",
};

export function ServiceHero({ title, subtitle, image, accentColor }: ServiceHeroProps) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${accentClasses[accentColor]} to-transparent opacity-30`}
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up">
              {title}
            </h1>
            <p
              className="text-xl text-muted-foreground max-w-2xl animate-fade-in-up [animation-delay:150ms]"
            >
              {subtitle}
            </p>
          </div>

          {/* Hero Image */}
          <div className={`flex-shrink-0 w-72 h-72 lg:w-96 lg:h-96 animate-float rounded-full overflow-hidden border-4 ${borderClasses[accentColor]}`}>
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
