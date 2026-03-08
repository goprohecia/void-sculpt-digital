import { motion } from "framer-motion";
import { Layers, Users, UserCheck, Briefcase, ShoppingBag } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition, ParallaxBackground } from "@/components/animations";

const espaces = [
  { icon: Briefcase, label: "Espace Admin", desc: "Pilotez votre activité, gérez vos équipes et vos clients." },
  { icon: UserCheck, label: "Espace Salarié", desc: "Vos collaborateurs accèdent aux dossiers et outils assignés." },
  { icon: Users, label: "Espace Client", desc: "Vos clients suivent leurs dossiers, devis et factures." },
  { icon: ShoppingBag, label: "Espaces personnalisés", desc: "Créez des espaces sur mesure selon votre métier (Enterprise)." },
];

export function ConceptSection() {
  return (
    <section id="concept">
      <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.15}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        </ParallaxBackground>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Le concept clé</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-light mb-6">
                Des <span className="font-medium text-gradient-neon">espaces</span> et des{" "}
                <span className="font-medium text-gradient-neon">modules.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-muted-foreground font-light">
                Chaque utilisateur accède à son propre espace. Vous activez uniquement les modules nécessaires à chaque rôle. Résultat : une plateforme sur mesure, sans complexité inutile.
              </p>
            </ScrollReveal>
          </div>

          {/* Espaces grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16" staggerDelay={0.1} delayStart={0.3}>
            {espaces.map((e) => (
              <motion.div key={e.label} variants={staggerItemVariants}>
                <div className="group h-full p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-neon-violet/20 transition-all duration-500 text-center">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <e.icon className="h-5 w-5 text-neon-violet" />
                  </div>
                  <h3 className="text-base font-medium mb-2">{e.label}</h3>
                  <p className="text-sm text-muted-foreground">{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>

          {/* Exemple concret */}
          <ScrollReveal variant="fadeInUp" delay={0.4}>
            <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Layers className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Exemple concret : un magasin de robes de mariée</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    L'administratrice gère ses clientes, ses commandes et sa facturation. Ses vendeuses accèdent aux dossiers et au calendrier. Les clientes suivent l'avancement de leur commande et signent les devis en ligne.{" "}
                    <span className="text-foreground font-medium">3 espaces, les modules adaptés à chacun.</span>
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
