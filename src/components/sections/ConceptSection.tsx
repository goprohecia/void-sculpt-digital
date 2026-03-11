import { motion } from "framer-motion";
import { Layers, Users, UserCheck, Briefcase, ShoppingBag } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition } from "@/components/animations";

const espaces = [
  { icon: Briefcase, label: "Espace Admin", desc: "Pilotez votre activité, gérez vos équipes et vos clients." },
  { icon: UserCheck, label: "Espace Salarié", desc: "Vos collaborateurs accèdent aux dossiers et outils assignés." },
  { icon: Users, label: "Espace Client", desc: "Vos clients suivent leurs dossiers, devis et factures." },
  { icon: ShoppingBag, label: "Espaces personnalisés", desc: "Créez des espaces sur mesure selon votre métier (Enterprise)." },
];

export function ConceptSection() {
  return (
    <section id="concept" className="bg-[#F6F5F2]">
      <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">Le concept clé</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-900">
                Des <span className="font-medium text-gradient-neon">espaces</span> et des{" "}
                <span className="font-medium text-gradient-neon">modules.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-gray-600 font-light">
                Chaque utilisateur accède à son propre espace. Vous activez uniquement les modules nécessaires à chaque rôle. Résultat : une plateforme sur mesure, sans complexité inutile.
              </p>
            </ScrollReveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16" staggerDelay={0.1} delayStart={0.3}>
            {espaces.map((e) => (
              <motion.div key={e.label} variants={staggerItemVariants}>
                <div className="group h-full p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:border-[#22c55e]/30 transition-all duration-500 text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <e.icon className="h-5 w-5 text-[#22c55e]" />
                  </div>
                  <h3 className="text-base font-medium mb-2 text-gray-900">{e.label}</h3>
                  <p className="text-sm text-gray-600">{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>

          <ScrollReveal variant="fadeInUp" delay={0.4}>
            <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-2xl border border-gray-200 bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Layers className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-gray-900">Exemple concret : un magasin de robes de mariée</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    L'administratrice gère ses clientes, ses commandes et sa facturation. Ses vendeuses accèdent aux dossiers et au calendrier. Les clientes suivent l'avancement de leur commande et signent les devis en ligne.{" "}
                    <span className="text-gray-900 font-medium">3 espaces, les modules adaptés à chacun.</span>
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </SectionTransition>
    </section>
  );
}
