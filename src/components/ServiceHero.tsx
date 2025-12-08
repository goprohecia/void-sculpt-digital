import { ReactNode } from "react";

interface ServiceHeroProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  accentColor: "red" | "green" | "blue" | "gold";
}

const accentClasses = {
  red: "from-neon-red/20 to-transparent text-neon-red",
  green: "from-neon-green/20 to-transparent text-neon-green",
  blue: "from-neon-blue/20 to-transparent text-neon-blue",
  gold: "from-tier-custom/20 to-transparent text-tier-custom",
};

export function ServiceHero({ title, subtitle, icon, accentColor }: ServiceHeroProps) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${accentClasses[accentColor].split(" ")[0]} opacity-30`}
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight opacity-0 animate-fade-in-up">
              {title}
            </h1>
            <p
              className="text-xl text-muted-foreground max-w-2xl opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.15s" }}
            >
              {subtitle}
            </p>
          </div>

          {/* Icon/Illustration */}
          <div
            className={`flex-shrink-0 w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center rounded-3xl bg-gradient-to-br ${accentClasses[accentColor].split(" ")[0]} border border-border/50 animate-float opacity-0 animate-scale-in`}
            style={{ animationDelay: "0.3s" }}
          >
            <div className={`${accentClasses[accentColor].split(" ").slice(1).join(" ")}`}>
              {icon}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
