import { Layout } from "@/components/Layout";
import { ServiceHero } from "@/components/ServiceHero";
import { PricingCard } from "@/components/PricingCard";
import { Monitor } from "lucide-react";

const WebService = () => {
  return (
    <Layout>
      <ServiceHero
        title="Architectures Web Immersives"
        subtitle="De la vitrine épurée au E-commerce puissant. Votre présence en ligne, réinventée."
        icon={<Monitor className="w-32 h-32 lg:w-40 lg:h-40" strokeWidth={1} />}
        accentColor="blue"
      />

      {/* Pricing Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Offres Web</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choisissez la formule adaptée à vos ambitions digitales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              tier="start"
              title="Site Présence"
              subtitle="Pour être visible"
              price="1 500 – 3 000 €"
              features={[
                "Site vitrine 1 à 5 pages",
                "Design professionnel",
                "Responsive mobile",
                "SEO de base",
                "Formulaire de contact",
              ]}
              upsell="Hébergement & maintenance 59€/mois"
              subject="Site Web - Offre START (Site Présence)"
            />

            <PricingCard
              tier="pro"
              title="Site Business / E-commerce"
              subtitle="Pour générer des leads et ventes"
              price="4 000 – 8 000 €"
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
            />

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
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WebService;
