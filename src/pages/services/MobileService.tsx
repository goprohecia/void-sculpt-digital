import { Layout } from "@/components/Layout";
import { ServiceHero } from "@/components/ServiceHero";
import { PricingCard } from "@/components/PricingCard";
import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-mobile.png";

const MobileService = () => {
  return (
    <Layout>
      <ServiceHero
        title="Expériences Mobiles Next-Gen"
        subtitle="Des applications natives et cross-platform fluides, conçues pour engager vos utilisateurs."
        image={heroImage}
        accentColor="green"
        badge="Applications Mobiles"
      />

      {/* Pricing Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Tarifs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Offres <span className="text-gradient-neon">Mobile</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              De l'idée à l'App Store, nous vous accompagnons à chaque étape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              tier="start"
              title="MVP App"
              subtitle="Pour tester une idée"
              price="Sur demande"
              features={[
                "Application simple iOS/Android",
                "Authentification basique",
                "3 à 5 écrans principaux",
                "Design UI moderne",
                "Publication stores",
              ]}
              upsell="Maintenance & updates 149€/mois"
              subject="Application Mobile - Offre START (MVP App)"
              index={0}
            />

            <PricingCard
              tier="pro"
              title="App Market Ready"
              subtitle="Pour une app prête marché"
              price="Sur demande"
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
              index={1}
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
              index={2}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MobileService;