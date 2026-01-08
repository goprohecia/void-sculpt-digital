import { motion } from "framer-motion";
import { Target, Palette, Code, Rocket } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition, ParallaxBackground } from "@/components/animations";

const steps = [
  {
    icon: Target,
    number: "01",
    title: "Cadrage",
    description: "Objectifs, scope et planning définis ensemble.",
    deliverable: "Brief validé + roadmap",
    color: "neon-violet",
  },
  {
    icon: Palette,
    number: "02",
    title: "Direction artistique",
    description: "Maquettes haute-fidélité et prototypes interactifs.",
    deliverable: "Design system + maquettes",
    color: "neon-blue",
  },
  {
    icon: Code,
    number: "03",
    title: "Build",
    description: "Développement technique et intégrations.",
    deliverable: "Produit fonctionnel",
    color: "neon-green",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Finitions",
    description: "Performance, QA et mise en production.",
    deliverable: "Produit live + documentation",
    color: "tier-custom",
  },
];

const colorClasses = {
  "neon-violet": {
    bg: "bg-neon-violet/10",
    border: "border-neon-violet/30",
    text: "text-neon-violet",
    glow: "group-hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]",
  },
  "neon-blue": {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]",
  },
  "neon-green": {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]",
  },
  "tier-custom": {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]",
  },
};

export function MethodeSection() {
  return (
    <section id="methode">
    <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
      <ParallaxBackground speed={0.15}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" />
      </ParallaxBackground>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <ScrollReveal variant="fadeInUp">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-sm font-medium text-emerald-400">Notre méthode</span>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              Une méthode studio.{" "}
              <span className="text-gradient-neon">Zéro surprise.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Un processus transparent et éprouvé pour des livrables à la hauteur de vos attentes.
            </p>
          </ScrollReveal>
        </div>

        {/* Timeline */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto" staggerDelay={0.12} delayStart={0.3}>
          {steps.map((step, index) => {
            const colors = colorClasses[step.color as keyof typeof colorClasses];
            return (
              <motion.div key={step.number} variants={staggerItemVariants}>
                <div className={`group relative h-full glass-card glass-noise rounded-2xl p-8 transition-all duration-500 hover:border-white/20 ${colors.glow}`}>
                  {/* Connection line for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-white/20 to-transparent" />
                  )}

                  {/* Number */}
                  <div className={`text-5xl font-black mb-6 ${colors.text} opacity-20`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className={`h-6 w-6 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{step.description}</p>

                  {/* Deliverable */}
                  <div className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {step.deliverable}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </SectionTransition>
    </section>
  );
}
