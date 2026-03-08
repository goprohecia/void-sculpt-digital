import { motion } from "framer-motion";
import { Puzzle, Users, Shield, Sparkle, TrendingUp } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "@/components/animations";

const principes = [
  {
    icon: Puzzle,
    title: "Modulaire",
    description: "Activez uniquement ce dont vous avez besoin. Pas de superflu.",
  },
  {
    icon: Users,
    title: "Multi-rôles",
    description: "Admin, salarié, client — chacun son espace et ses accès.",
  },
  {
    icon: Shield,
    title: "Sécurisé",
    description: "Données chiffrées, RLS, hébergement conforme RGPD.",
  },
  {
    icon: Sparkle,
    title: "Simple",
    description: "Interface intuitive. Prise en main immédiate, sans formation.",
  },
  {
    icon: TrendingUp,
    title: "Évolutif",
    description: "Passez de Starter à Enterprise à mesure que vous grandissez.",
  },
];

export function PrincipesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <ScrollReveal variant="fadeInUp">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Pourquoi MBA
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Ce qui fait la{" "}
              <span className="font-medium text-gradient-neon">différence</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground font-light">
              Une plateforme pensée pour simplifier votre quotidien.
            </p>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto"
          staggerDelay={0.08}
        >
          {principes.map((principe) => (
            <motion.div key={principe.title} variants={staggerItemVariants}>
              <div className="group h-full p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <principe.icon className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="text-base font-medium mb-2">{principe.title}</h3>
                <p className="text-sm text-muted-foreground">{principe.description}</p>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
