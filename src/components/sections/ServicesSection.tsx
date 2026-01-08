import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Smartphone, Server, Palette, Wand2, Settings, ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition, ParallaxBackground } from "@/components/animations";

const services = [
  {
    icon: Globe,
    title: "Sites web immersifs",
    description: "Expériences web qui captivent et convertissent.",
    href: "/services/web",
    color: "neon-violet",
  },
  {
    icon: Smartphone,
    title: "Applications mobiles",
    description: "Apps natives et cross-platform performantes.",
    href: "/services/mobile",
    color: "neon-green",
  },
  {
    icon: Server,
    title: "SaaS & Backoffice",
    description: "Dashboards puissants et automatisations.",
    href: "/services/backoffice",
    color: "neon-blue",
  },
  {
    icon: Palette,
    title: "UI/UX & Design system",
    description: "Identité visuelle cohérente et scalable.",
    href: "/services/web",
    color: "tier-custom",
  },
  {
    icon: Wand2,
    title: "Motion & interactions",
    description: "Animations qui subliment l'expérience.",
    href: "/services/web",
    color: "neon-violet",
  },
  {
    icon: Settings,
    title: "Maintenance & évolutions",
    description: "Suivi technique et améliorations continues.",
    href: "/contact",
    color: "neon-green",
  },
];

const colorClasses = {
  "neon-violet": {
    bg: "bg-neon-violet/10",
    icon: "text-neon-violet",
    border: "group-hover:border-neon-violet/50",
    shadow: "group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
    glow: "group-hover:bg-neon-violet/15",
  },
  "neon-green": {
    bg: "bg-emerald-500/10",
    icon: "text-emerald-400",
    border: "group-hover:border-emerald-500/50",
    shadow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    glow: "group-hover:bg-emerald-500/15",
  },
  "neon-blue": {
    bg: "bg-blue-500/10",
    icon: "text-blue-400",
    border: "group-hover:border-blue-500/50",
    shadow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
    glow: "group-hover:bg-blue-500/15",
  },
  "tier-custom": {
    bg: "bg-amber-500/10",
    icon: "text-amber-400",
    border: "group-hover:border-amber-500/50",
    shadow: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]",
    glow: "group-hover:bg-amber-500/15",
  },
};

export function ServicesSection() {
  return (
    <section id="services">
    <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
      <ParallaxBackground speed={0.2}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
      </ParallaxBackground>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <ScrollReveal variant="fadeInUp">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
              <span className="text-sm font-medium text-neon-violet">Services</span>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              Ce qu'on construit,{" "}
              <span className="text-gradient-neon">précisément.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Des solutions digitales sur-mesure pour propulser votre activité.
            </p>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto" staggerDelay={0.1} delayStart={0.25}>
          {services.map((service) => {
            const colors = colorClasses[service.color as keyof typeof colorClasses];
            return (
              <motion.div key={service.title} variants={staggerItemVariants}>
                <Link
                  to={service.href}
                  className={`group relative block p-8 rounded-2xl glass-card glass-noise transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 ${colors.border} ${colors.shadow}`}
                >
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.glow}`} />

                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className={`h-7 w-7 ${colors.icon}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm group-hover:text-foreground/70 transition-colors">
                      {service.description}
                    </p>
                    <span className={`inline-flex items-center gap-1.5 mt-4 text-sm font-medium ${colors.icon} group-hover:gap-3 transition-all duration-300`}>
                      Découvrir
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </SectionTransition>
    </section>
  );
}
