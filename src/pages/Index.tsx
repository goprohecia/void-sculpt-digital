import { Layout } from "@/components/Layout";
import { FAQ } from "@/components/FAQ";
import { FloatingParticles } from "@/components/FloatingParticles";
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
      {/* Floating Particles Background */}
      <FloatingParticles />

      {/* A. Hero Section - Premium */}
      <HeroPremium />

      {/* B. Proof Strip - Crédibilité */}
      <ProofStrip />

      {/* C. Offres / Packs */}
      <OffresSection />

      {/* D. Services Grid */}
      <ServicesSection />

      {/* E. Réalisations / Portfolio */}
      <RealisationsSection />

      {/* F. Méthode */}
      <MethodeSection />

      {/* G. Principes / Standards */}
      <PrincipesSection />

      {/* H. FAQ */}
      <FAQ />

      {/* I. CTA Final */}
      <CTAFinal />
    </Layout>
  );
};

export default Index;
