import { Layout } from "@/components/Layout";
import { ServiceHero } from "@/components/ServiceHero";
import { PricingCard } from "@/components/PricingCard";
import heroImage from "@/assets/hero-360.png";

const FullStackService = () => {
  return (
    <Layout>
      <ServiceHero
        title="Domination Digitale Totale"
        subtitle="L'alliance parfaite : Site + App + Backoffice. La solution ultime pour les startups ambitieuses."
        image={heroImage}
        accentColor="gold"
      />

      {/* Pricing Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Offres 360°</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              L'écosystème complet pour une domination digitale sans compromis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              tier="start"
              title="Digital Launch"
              subtitle="Petite structure"
              price="8 000 – 15 000 €"
              features={[
                "Site vitrine professionnel",
                "Mini application mobile",
                "Backoffice léger",
                "Connexion entre services",
                "Formation équipe",
              ]}
              upsell="Pack Maintenance 360 – 149€/mois"
              subject="360° - Offre START (Digital Launch)"
            />

            <PricingCard
              tier="pro"
              title="Business Engine"
              subtitle="Entreprise en activité"
              price="20 000 – 50 000 €"
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
            />

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
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FullStackService;
