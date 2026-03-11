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
      <MethodeSection />
      <ArgumentsSection />
      <FAQ />
      <CTAFinal />
    </Layout>
  );
};

export default Index;
