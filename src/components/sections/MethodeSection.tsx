import { motion } from "framer-motion";
import { MessageSquare, Palette, Code, Rocket } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition } from "@/components/animations";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Discovery",
    description: "Écoute active, analyse des besoins et définition de la stratégie.",
    deliverable: "Cahier des charges"
  },
  {
    icon: Palette,
    number: "02",
    title: "Design",
    description: "Création des maquettes UI/UX et validation du design system.",
    deliverable: "Maquettes Figma"
  },
  {
    icon: Code,
    number: "03",
    title: "Développement",
    description: "Code propre, tests rigoureux et itérations continues.",
    deliverable: "Version beta"
  },
  {
    icon: Rocket,
    number: "04",
    title: "Lancement",
    description: "Déploiement, optimisation et suivi des performances.",
    deliverable: "Produit live"
  }
];

export function MethodeSection() {
  return (
    <section id="methode" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <ScrollReveal variant="fadeInUp">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Méthode
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Notre <span className="font-medium text-gradient-neon">processus</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground font-light">
              Une méthodologie éprouvée pour des résultats exceptionnels.
            </p>
          </ScrollReveal>
        </div>

        {/* Steps Grid */}
        <StaggerContainer 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto" 
          staggerDelay={0.1}
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={staggerItemVariants}>
              <div className="group h-full p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500">
                {/* Number */}
                <div className="text-3xl font-light text-gradient-neon mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="h-4 w-4 text-violet-400" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                
                {/* Deliverable */}
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-muted-foreground">Livrable</p>
                  <p className="text-sm font-medium text-violet-400">{step.deliverable}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
