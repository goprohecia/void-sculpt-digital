import { Layout } from "@/components/Layout";
import { FAQ } from "@/components/FAQ";
import {
  HeroPremium,
  ProofStrip,
  OffresSection,
  ServicesSection,
  RealisationsSection,
  MethodeSection,
  PrincipesSection,
  CTAFinal,
} from "@/components/sections";

const Index = () => {
  return (
    <Layout>
      {/* A. Hero */}
      <HeroPremium />

      {/* B. Proof Strip */}
      <ProofStrip />

      {/* C. Secteurs d'activité */}
      <ServicesSection />

      {/* D. Fonctionnalités / Modules */}
      <RealisationsSection />

      {/* E. Offres / Pricing */}
      <OffresSection />

      {/* F. Comment ça marche */}
      <MethodeSection />

      {/* G. Pourquoi MBA */}
      <PrincipesSection />

      {/* H. FAQ */}
      <FAQ />

      {/* I. CTA Final */}
      <CTAFinal />
    </Layout>
  );
};

export default Index;
