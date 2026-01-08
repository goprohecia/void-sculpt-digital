import { Layout } from "@/components/Layout";
import { ServiceHero } from "@/components/ServiceHero";
import { PricingCard } from "@/components/PricingCard";

import { motion } from "framer-motion";
import heroImage from "@/assets/hero-web.png";
import { 
  ScrollReveal, 
  StaggerContainer,
  staggerItemVariants,
  SectionTransition,
  ParallaxBackground,
} from "@/components/animations";

const WebService = () => {
  return (
    <Layout>
      <ServiceHero
        title="Architectures Web Immersives"
        subtitle="De la vitrine épurée au E-commerce puissant. Votre présence en ligne, réinventée."
        image={heroImage}
        accentColor="blue"
        badge="Sites Web & Vitrines"
      />

      {/* Pricing Section */}
      <SectionTransition className="py-24 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.2}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <ScrollReveal variant="fadeInUp">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
                <span className="text-sm font-medium text-neon-violet">Tarifs</span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Nos Offres <span className="text-gradient-neon">Web</span></h2>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.15}>
              <p className="text-xl font-semibold text-neon-violet mb-4">À partir de 1500€</p>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choisissez la formule adaptée à vos ambitions digitales.
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
                title="Site Présence"
                subtitle="Pour être visible"
                price="Sur demande"
                features={[
                  "Site vitrine 1 à 5 pages",
                  "Design professionnel",
                  "Responsive mobile",
                  "SEO de base",
                  "Formulaire de contact",
                ]}
                upsell="Hébergement & maintenance 59€/mois"
                subject="Site Web - Offre START (Site Présence)"
                index={0}
              />
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <PricingCard
                tier="pro"
                title="Site Business / E-commerce"
                subtitle="Pour générer des leads et ventes"
                price="Sur demande"
                features={[
                  "Site complet ou boutique en ligne",
                  "Système de paiement intégré",
                  "Tunnel de vente optimisé",
                  "Analytics avancés",
                  "SEO approfondi",
                  "Formation utilisateur",
                ]}
                upsell="Hébergement avancé + support 99€/mois"
                subject="Site Web - Offre PRO (Site Business)"
                index={1}
              />
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <PricingCard
                tier="custom"
                title="Site Premium"
                subtitle="Pour marque ou projet spécifique"
                price="Sur devis"
                features={[
                  "Design sur-mesure exclusif",
                  "Fonctionnalités avancées",
                  "Intégrations personnalisées",
                  "Performance optimisée",
                  "Accompagnement stratégique",
                  "Support prioritaire",
                ]}
                upsell="Maintenance sur mesure dès 149€/mois"
                subject="Site Web - Offre SUR-MESURE (Site Premium)"
                index={2}
              />
            </motion.div>
          </StaggerContainer>
        </div>
      </SectionTransition>
    </Layout>
  );
};

export default WebService;
