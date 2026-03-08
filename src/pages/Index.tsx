import { Layout } from "@/components/Layout";
import { FAQ } from "@/components/FAQ";
import {
  HeroPremium,
  ProofStrip,
  ConceptSection,
  OffresSection,
  ServicesSection,
  RealisationsSection,
  MethodeSection,
  CiblesSection,
  ArgumentsSection,
  CTAFinal,
} from "@/components/sections";

const Index = () => {
  return (
    <Layout>
      <HeroPremium />
      <ProofStrip />
      <ConceptSection />
      <ServicesSection />
      <RealisationsSection />
      <OffresSection />
      <CiblesSection />
      <MethodeSection />
      <ArgumentsSection />
      <FAQ />
      <CTAFinal />
    </Layout>
  );
};

export default Index;
