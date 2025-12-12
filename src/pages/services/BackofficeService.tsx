import { Layout } from "@/components/Layout";
import { ServiceHero } from "@/components/ServiceHero";
import { PricingCard } from "@/components/PricingCard";
import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-backoffice.png";
import { ServiceScene3D } from "@/components/3d/ServiceScene3D";
import { StepsTimeline3D } from "@/components/3d/StepsTimeline3D";
import { useState } from "react";

const steps = [
  {
    title: "Admin Pilot",
    description: "Gestion simple",
    features: [
      "Dashboard simple et intuitif",
      "Gestion utilisateurs",
      "CRUD de base",
      "Export de données",
      "Interface responsive",
    ]
  },
  {
    title: "SaaS Operator",
    description: "Automatisation",
    features: [
      "Intégrations API multiples",
      "Reporting avancé",
      "Automatisations workflows",
      "Conformité RGPD",
      "Multi-utilisateurs & rôles",
      "Notifications temps réel",
    ]
  },
  {
    title: "Enterprise Core",
    description: "PME/ETI besoins forts",
    features: [
      "Architecture microservices",
      "IA & Machine Learning",
      "Logiques métiers complexes",
      "Sécurité enterprise",
      "Scalabilité infinie",
      "SLA garanti",
    ]
  }
];

const BackofficeService = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Layout>
      {/* 3D Background Scene */}
      <ServiceScene3D 
        steps={steps} 
        accentColor="#f43f5e" 
        serviceType="backoffice" 
      />

      <ServiceHero
        title="Le Cerveau de Votre Opération"
        subtitle="Dashboards puissants et automatisations pour piloter votre activité avec précision."
        image={heroImage}
        accentColor="red"
        badge="Backoffice & SaaS"
      />

      {/* Interactive 3D Steps Timeline */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Explorez nos <span className="text-gradient-neon">formules</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Cliquez sur les formes 3D pour découvrir chaque offre
            </p>
          </div>
          
          <StepsTimeline3D 
            steps={steps} 
            accentColor="#f43f5e" 
            activeStep={activeStep}
            onStepChange={setActiveStep}
          />

          {/* Active Step Details */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-glass-dark/80 backdrop-blur-xl rounded-2xl p-6 border border-rose-500/20 transition-all duration-500">
              <h3 className="text-xl font-bold text-rose-400 mb-2">
                {steps[activeStep].title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {steps[activeStep].description}
              </p>
              <ul className="space-y-2">
                {steps[activeStep].features.map((feature, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-center gap-2 text-sm text-gray-300"
                    style={{ 
                      opacity: 0,
                      animation: 'fade-in 0.3s ease-out forwards',
                      animationDelay: `${idx * 0.1}s`
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30">
              <Sparkles className="h-4 w-4 text-rose-400" />
              <span className="text-sm font-medium text-rose-400">Tarifs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Offres <span className="text-gradient-neon">Backoffice</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des outils sur mesure pour optimiser vos opérations quotidiennes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BackofficeService;
