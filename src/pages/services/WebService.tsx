import { Layout } from "@/components/Layout";
import { ServiceHero } from "@/components/ServiceHero";
import { PricingCard } from "@/components/PricingCard";
import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-web.png";

const WebService = () => {
  return (
    <Layout>
      <ServiceHero
        title="Architectures web immersives"
        subtitle="De la vitrine épurée au e-commerce puissant. Votre présence en ligne, réinventée."
        image={heroImage}
        accentColor="blue"
        badge="Sites web & vitrines"
      />

      {/* Pricing Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
              <Sparkles className="h-4 w-4 text-neon-violet" />
              <span className="text-sm font-medium text-neon-violet">Tarifs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos offres <span className="text-gradient-neon">web</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choisissez la formule adaptée à vos ambitions digitales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              tier="start"
              title="Site présence"
              subtitle="Pour être visible"
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

            <PricingCard
              tier="pro"
              title="Site business / e-commerce"
              subtitle="Pour générer des leads et ventes"
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

            <PricingCard
              tier="custom"
              title="Site premium"
              subtitle="Pour marque ou projet spécifique"
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
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WebService;