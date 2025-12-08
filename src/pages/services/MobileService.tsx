import { Layout } from "@/components/Layout";
import { ServiceHero } from "@/components/ServiceHero";
import { PricingCard } from "@/components/PricingCard";
import { Smartphone } from "lucide-react";

const MobileService = () => {
  return (
    <Layout>
      <ServiceHero
        title="Expériences Mobiles Next-Gen"
        subtitle="Des applications natives et cross-platform fluides, conçues pour engager vos utilisateurs."
        icon={<Smartphone className="w-32 h-32 lg:w-40 lg:h-40" strokeWidth={1} />}
        accentColor="green"
      />

      {/* Pricing Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Offres Mobile</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              De l'idée à l'App Store, nous vous accompagnons à chaque étape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              tier="start"
              title="MVP App"
              subtitle="Pour tester une idée"
              price="10 000 – 20 000 €"
              features={[
                "Application simple iOS/Android",
                "Authentification basique",
                "3 à 5 écrans principaux",
                "Design UI moderne",
                "Publication stores",
              ]}
              upsell="Maintenance & updates 149€/mois"
              subject="Application Mobile - Offre START (MVP App)"
            />

            <PricingCard
              tier="pro"
              title="App Market Ready"
              subtitle="Pour une app prête marché"
              price="20 000 – 50 000 €"
              features={[
                "App complète iOS & Android",
                "Notifications push",
                "Fonctions temps réel",
                "Social login",
                "Analytics intégrés",
                "Tests utilisateurs",
              ]}
              upsell="Maintenance + Monitoring 249€/mois"
              subject="Application Mobile - Offre PRO (App Market Ready)"
            />

            <PricingCard
              tier="custom"
              title="Écosystème Mobile"
              subtitle="Projet complexe / Scaleup"
              price="Sur devis"
              features={[
                "Architecture scalable",
                "Sécurité renforcée",
                "Intégrations avancées",
                "Backend sur-mesure",
                "Performance optimale",
                "Support dédié",
              ]}
              upsell="Infogérance complète sur devis"
              subject="Application Mobile - Offre SUR-MESURE (Écosystème Mobile)"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MobileService;
