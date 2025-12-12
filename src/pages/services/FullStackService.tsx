import { Layout } from "@/components/Layout";
import { ServiceHero } from "@/components/ServiceHero";
import { PricingCard } from "@/components/PricingCard";
import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-360.png";
import { ServiceScene3D } from "@/components/3d/ServiceScene3D";
import { StepsTimeline3D } from "@/components/3d/StepsTimeline3D";
import { useState } from "react";

const steps = [
  {
    title: "Digital Launch",
    description: "Petite structure",
    features: [
      "Site vitrine professionnel",
      "Mini application mobile",
      "Backoffice léger",
      "Connexion entre services",
      "Formation équipe",
    ]
  },
  {
    title: "Business Engine",
    description: "Entreprise en activité",
    features: [
      "Site PRO avec e-commerce",
      "App mobile complète",
      "Backoffice automatisé",
      "Synchronisation temps réel",
      "Analytics unifiés",
      "Support prioritaire",
    ]
  },
  {
    title: "Full Ecosystem",
    description: "Projet ambitieux / Scaleup",
    features: [
      "Site custom haute performance",
      "App scalable multiplateforme",
      "Architecture microservices",
      "IA & automatisation avancée",
      "Équipe dédiée",
      "SLA premium",
    ]
  }
];

const FullStackService = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Layout>
      {/* 3D Background Scene */}
      <ServiceScene3D 
        steps={steps} 
        accentColor="#8b5cf6" 
        serviceType="fullstack" 
      />

      <ServiceHero
        title="Domination Digitale Totale"
        subtitle="L'alliance parfaite : Site + App + Backoffice. La solution ultime pour les startups ambitieuses."
        image={heroImage}
        accentColor="gold"
        badge="Écosystème 360°"
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
            accentColor="#8b5cf6" 
            activeStep={activeStep}
            onStepChange={setActiveStep}
          />

          {/* Active Step Details */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-glass-dark/80 backdrop-blur-xl rounded-2xl p-6 border border-violet-500/20 transition-all duration-500">
              <h3 className="text-xl font-bold text-violet-400 mb-2">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
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
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">Tarifs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Offres <span className="text-gradient-neon">360°</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              L'écosystème complet pour une domination digitale sans compromis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FullStackService;
