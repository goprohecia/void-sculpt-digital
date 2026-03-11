import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition } from "@/components/animations";

const comparisons = [
  { problem: "Abonnements multiples (CRM + factu + support + ...)", solution: "Tout-en-un à partir de 105€/mois" },
  { problem: "Jongler entre 5+ outils différents", solution: "Une seule plateforme modulaire" },
  { problem: "Logiciels génériques, pas adaptés à votre métier", solution: "Modules activables selon votre secteur" },
  { problem: "Pas d'espace client dédié", solution: "Espace client intégré avec suivi en temps réel" },
  { problem: "Facturation séparée et non connectée", solution: "Devis → factures → relances automatisées" },
  { problem: "Paiement en ligne complexe à mettre en place", solution: "Stripe Connect intégré nativement" },
];

export function ArgumentsSection() {
  return (
    <section id="arguments" className="bg-white">
      <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">Pourquoi MBA</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-900">
                Arrêtez de <span className="font-medium text-gradient-neon">bricoler.</span>
              </h2>
            </ScrollReveal>
          </div>

          <StaggerContainer className="max-w-4xl mx-auto space-y-3" staggerDelay={0.08} delayStart={0.2}>
            <div className="hidden sm:grid grid-cols-2 gap-4 px-4 pb-2">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Le problème</p>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">La solution MBA</p>
            </div>
            {comparisons.map((row, i) => (
              <motion.div key={i} variants={staggerItemVariants}>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:border-[#22c55e]/30 transition-all">
                  <div className="flex items-start gap-3">
                    <X className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600">{row.problem}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-900">{row.solution}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </SectionTransition>
    </section>
  );
}
