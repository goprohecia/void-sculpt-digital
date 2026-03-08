import { motion } from "framer-motion";
import { Home, Building2, Wrench, HardHat } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "@/components/animations";

const sectors = [
  {
    icon: Home,
    title: "Conciergerie & Gestion locative",
    description: "Gérez vos biens, vos locataires et vos interventions depuis un seul outil.",
  },
  {
    icon: Building2,
    title: "Agences immobilières",
    description: "Suivi des mandats, dossiers clients et facturation centralisés.",
  },
  {
    icon: Wrench,
    title: "Garages & Carrosseries",
    description: "Gestion des véhicules, devis, pièces détachées et suivi d'atelier.",
  },
  {
    icon: HardHat,
    title: "BTP & Artisans",
    description: "Chantiers, devis, factures et gestion des équipes sur le terrain.",
  },
];

export function ServicesSection() {
  return (
    <section id="secteurs" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <ScrollReveal variant="fadeInUp">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Secteurs
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Adapté à votre{" "}
              <span className="font-medium text-gradient-neon">secteur d'activité</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground font-light">
              MBA s'adapte aux besoins spécifiques de chaque métier de services.
            </p>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          staggerDelay={0.08}
        >
          {sectors.map((sector) => (
            <motion.div key={sector.title} variants={staggerItemVariants}>
              <div className="group block h-full p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <sector.icon className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">{sector.title}</h3>
                <p className="text-sm text-muted-foreground">{sector.description}</p>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
