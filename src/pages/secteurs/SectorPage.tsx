import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { ScrollReveal, SectionTransition, StaggerContainer, staggerItemVariants } from "@/components/animations";

interface UseCase {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface RecommendedModule {
  icon: LucideIcon;
  name: string;
}

interface SectorPageProps {
  sectorLabel: string;
  title: ReactNode;
  subtitle: string;
  heroImage: string;
  useCases: UseCase[];
  modules: RecommendedModule[];
}

export default function SectorPage({ sectorLabel, title, subtitle, heroImage, useCases, modules }: SectorPageProps) {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[55svh] flex items-center overflow-hidden pt-24">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              <motion.p
                className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {sectorLabel}
              </motion.p>

              <motion.h1
                className="text-2xl sm:text-3xl md:text-5xl font-light mb-6 tracking-tight leading-[1.1] text-gray-900"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {title}
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 leading-relaxed font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {subtitle}
              </motion.p>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">
                <img
                  src={heroImage}
                  alt={sectorLabel}
                  className="w-full h-[240px] sm:h-[340px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </section>

      {/* Use Cases */}
      <SectionTransition className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal variant="fadeInUp">
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">Cas d'usage</p>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900">
                Ce que MBA fait pour <span className="font-medium text-[#16a34a]">vous</span>
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" staggerDelay={0.1}>
            {useCases.map((uc) => (
              <motion.div key={uc.title} variants={staggerItemVariants}>
                <div className="group p-8 rounded-2xl border border-gray-200 bg-gray-50 hover:border-gray-300 transition-all duration-500 h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <uc.icon className="h-5 w-5 text-[#22c55e]" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-gray-900">{uc.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{uc.description}</p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </SectionTransition>

      {/* Recommended Modules */}
      <SectionTransition className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal variant="fadeInUp">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">Modules</p>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900">
                Modules <span className="font-medium text-[#16a34a]">recommandés</span>
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto" staggerDelay={0.06}>
            {modules.map((mod) => (
              <motion.div key={mod.name} variants={staggerItemVariants}>
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50 hover:border-[#22c55e]/30 transition-all duration-300">
                  <mod.icon className="h-5 w-5 text-[#22c55e]" />
                  <span className="font-medium text-gray-900">{mod.name}</span>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </SectionTransition>

      {/* CTA */}
      <SectionTransition className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal variant="fadeInUp">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-900">
                Prêt à <span className="font-medium text-[#16a34a]">simplifier</span> votre gestion ?
              </h2>
              <p className="text-gray-600 mb-10 font-light">
                Demandez une démo personnalisée et découvrez MBA en action pour votre secteur.
              </p>
              <Link
                to="/contact?subject=Demande%20de%20d%C3%A9mo"
                className="group relative inline-flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-wide uppercase overflow-hidden"
              >
                <span className="absolute inset-0 bg-[#16a34a] rounded-full" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative text-white transition-colors duration-500">
                  Demander une démo
                </span>
                <ArrowRight className="relative h-4 w-4 text-white group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </SectionTransition>
    </Layout>
  );
}
