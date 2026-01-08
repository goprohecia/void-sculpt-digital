import { Layout } from "@/components/Layout";
import { ServiceHero } from "@/components/ServiceHero";
import { PricingCard } from "@/components/PricingCard";

import { motion } from "framer-motion";
import heroImage from "@/assets/hero-360.png";
import { 
  ScrollReveal, 
  StaggerContainer,
  staggerItemVariants,
  SectionTransition,
  ParallaxBackground,
} from "@/components/animations";

const FullStackService = () => {
  return (
    <Layout>
      <ServiceHero
        title="Domination Digitale Totale"
        subtitle="L'alliance parfaite : Site + App + Backoffice. La solution ultime pour les startups ambitieuses."
        image={heroImage}
        accentColor="gold"
        badge="Écosystème 360°"
      />

      {/* Pricing Section */}
      <SectionTransition className="py-24 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.2}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <ScrollReveal variant="fadeInUp">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30">
                <span className="text-sm font-medium text-violet-400">Tarifs</span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Offres <span className="text-gradient-neon">360°</span></h2>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                L'écosystème complet pour une domination digitale sans compromis.
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
                title="Digital Launch"
                subtitle="Petite structure"
                price="Sur demande"
                features={[
                  "Site vitrine professionnel",
                  "Mini application mobile",
                  "Backoffice léger",
                  "Connexion entre services",
                  "Formation équipe",
                ]}
                upsell="Pack Maintenance 360 – 149€/mois"
                subject="360° - Offre START (Digital Launch)"
                index={0}
              />
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <PricingCard
                tier="pro"
                title="Business Engine"
                subtitle="Entreprise en activité"
                price="Sur demande"
                features={[
                  "Site PRO avec e-commerce",
                  "App mobile complète",
                  "Backoffice automatisé",
                  "Synchronisation temps réel",
                  "Analytics unifiés",
                  "Support prioritaire",
                ]}
                upsell="Pack Croissance – 249€/mois"
                subject="360° - Offre PRO (Business Engine)"
                index={1}
              />
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <PricingCard
                tier="custom"
                title="Full Ecosystem"
                subtitle="Projet ambitieux / Scaleup"
                price="Sur devis"
                features={[
                  "Site custom haute performance",
                  "App scalable multiplateforme",
                  "Architecture microservices",
                  "IA & automatisation avancée",
                  "Équipe dédiée",
                  "SLA premium",
                ]}
                upsell="Contrat d'accompagnement sur devis"
                subject="360° - Offre SUR-MESURE (Full Ecosystem)"
                index={2}
              />
            </motion.div>
          </StaggerContainer>
        </div>
      </SectionTransition>
    </Layout>
  );
};

export default FullStackService;
