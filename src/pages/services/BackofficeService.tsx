import { Layout } from "@/components/Layout";
import { ServiceHero } from "@/components/ServiceHero";
import { PricingCard } from "@/components/PricingCard";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-backoffice.png";
import { 
  ScrollReveal, 
  StaggerContainer,
  staggerItemVariants,
  SectionTransition,
  ParallaxBackground,
} from "@/components/animations";

const BackofficeService = () => {
  return (
    <Layout>
      <ServiceHero
        title="Le Cerveau de Votre Opération"
        subtitle="Dashboards puissants et automatisations pour piloter votre activité avec précision."
        image={heroImage}
        accentColor="red"
        badge="Backoffice & SaaS"
      />

      {/* Pricing Section */}
      <SectionTransition className="py-24 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.2}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <ScrollReveal variant="fadeInUp">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30">
                <Sparkles className="h-4 w-4 text-rose-400" />
                <span className="text-sm font-medium text-rose-400">Tarifs</span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Offres <span className="text-gradient-neon">Backoffice</span></h2>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Des outils sur mesure pour optimiser vos opérations quotidiennes.
              </p>
            </ScrollReveal>
          </div>

          <StaggerContainer 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            staggerDelay={0.15}
            delayStart={0.2}
          >
            <motion.div variants={staggerItemVariants}>
              <PricingCard
                tier="start"
                title="Admin Pilot"
                subtitle="Gestion simple"
                price="Sur demande"
                features={[
                  "Dashboard simple et intuitif",
                  "Gestion utilisateurs",
                  "CRUD de base",
                  "Export de données",
                  "Interface responsive",
                ]}
                upsell="Hébergement & support 79€/mois"
                subject="Backoffice - Offre START (Admin Pilot)"
                index={0}
              />
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <PricingCard
                tier="pro"
                title="SaaS Operator"
                subtitle="Automatisation"
                price="Sur demande"
                features={[
                  "Intégrations API multiples",
                  "Reporting avancé",
                  "Automatisations workflows",
                  "Conformité RGPD",
                  "Multi-utilisateurs & rôles",
                  "Notifications temps réel",
                ]}
                upsell="Support prioritaire 129€/mois"
                subject="Backoffice - Offre PRO (SaaS Operator)"
                index={1}
              />
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <PricingCard
                tier="custom"
                title="Enterprise Core"
                subtitle="PME/ETI besoins forts"
                price="Sur devis"
                features={[
                  "Architecture microservices",
                  "IA & Machine Learning",
                  "Logiques métiers complexes",
                  "Sécurité enterprise",
                  "Scalabilité infinie",
                  "SLA garanti",
                ]}
                upsell="TMA complète sur devis"
                subject="Backoffice - Offre SUR-MESURE (Enterprise Core)"
                index={2}
              />
            </motion.div>
          </StaggerContainer>
        </div>
      </SectionTransition>
    </Layout>
  );
};

export default BackofficeService;
