import { Layout } from "@/components/Layout";
import { ServiceHero } from "@/components/ServiceHero";
import { PricingCard } from "@/components/PricingCard";
import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-web.png";
import { ServiceScene3D } from "@/components/3d/ServiceScene3D";
import { StepsTimeline3D } from "@/components/3d/StepsTimeline3D";
import { useState } from "react";

const steps = [
  {
    title: "Site Présence",
    description: "Pour être visible",
    features: [
      "Site vitrine 1 à 5 pages",
      "Design professionnel",
      "Responsive mobile",
      "SEO de base",
      "Formulaire de contact",
    ]
  },
  {
    title: "Site Business / E-commerce",
    description: "Pour générer des leads et ventes",
    features: [
      "Site complet ou boutique en ligne",
      "Système de paiement intégré",
      "Tunnel de vente optimisé",
      "Analytics avancés",
      "SEO approfondi",
      "Formation utilisateur",
    ]
  },
  {
    title: "Site Premium",
    description: "Pour marque ou projet spécifique",
    features: [
      "Design sur-mesure exclusif",
      "Fonctionnalités avancées",
      "Intégrations personnalisées",
      "Performance optimisée",
      "Accompagnement stratégique",
      "Support prioritaire",
    ]
  }
];

const WebService = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Layout>
      {/* 3D Background Scene */}
      <ServiceScene3D 
        steps={steps} 
        accentColor="#3b82f6" 
        serviceType="web" 
      />

      <ServiceHero
        title="Architectures Web Immersives"
        subtitle="De la vitrine épurée au E-commerce puissant. Votre présence en ligne, réinventée."
        image={heroImage}
        accentColor="blue"
        badge="Sites Web & Vitrines"
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
            accentColor="#3b82f6" 
            activeStep={activeStep}
            onStepChange={setActiveStep}
          />

          {/* Active Step Details */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-glass-dark/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 transition-all duration-500">
              <h3 className="text-xl font-bold text-blue-400 mb-2">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
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
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
              <Sparkles className="h-4 w-4 text-neon-violet" />
              <span className="text-sm font-medium text-neon-violet">Tarifs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Offres <span className="text-gradient-neon">Web</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choisissez la formule adaptée à vos ambitions digitales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WebService;
