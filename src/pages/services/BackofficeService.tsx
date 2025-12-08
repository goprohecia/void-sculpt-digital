import { Layout } from "@/components/Layout";
import { ServiceHero } from "@/components/ServiceHero";
import { PricingCard } from "@/components/PricingCard";
import { Server } from "lucide-react";

const BackofficeService = () => {
  return (
    <Layout>
      <ServiceHero
        title="Le Cerveau de Votre Opération"
        subtitle="Dashboards puissants et automatisations pour piloter votre activité avec précision."
        icon={<Server className="w-32 h-32 lg:w-40 lg:h-40" strokeWidth={1} />}
        accentColor="red"
      />

      {/* Pricing Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Offres Backoffice</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des outils sur mesure pour optimiser vos opérations quotidiennes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              tier="start"
              title="Admin Pilot"
              subtitle="Gestion simple"
              price="2 000 – 4 000 €"
              features={[
                "Dashboard simple et intuitif",
                "Gestion utilisateurs",
                "CRUD de base",
                "Export de données",
                "Interface responsive",
              ]}
              upsell="Hébergement & support 79€/mois"
              subject="Backoffice - Offre START (Admin Pilot)"
            />

            <PricingCard
              tier="pro"
              title="SaaS Operator"
              subtitle="Automatisation"
              price="5 000 – 12 000 €"
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
            />

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
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BackofficeService;
