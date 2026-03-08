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
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              <motion.p
                className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {sectorLabel}
              </motion.p>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-light mb-6 tracking-tight leading-[1.1]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {title}
              </motion.h1>

              <motion.p
                className="text-lg text-muted-foreground leading-relaxed font-light"
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
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={heroImage}
                  alt={sectorLabel}
                  className="w-full h-[340px] object-cover"
                />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-violet-500/20 via-transparent to-violet-500/10 -z-10 blur-sm" />
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* Use Cases */}
      <SectionTransition className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal variant="fadeInUp">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Cas d'usage</p>
              <h2 className="text-3xl md:text-4xl font-light">
                Ce que MBA fait pour <span className="font-medium text-gradient-neon">vous</span>
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" staggerDelay={0.1}>
            {useCases.map((uc) => (
              <motion.div key={uc.title} variants={staggerItemVariants}>
                <div className="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500 h-full">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <uc.icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">{uc.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{uc.description}</p>
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
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Modules</p>
              <h2 className="text-3xl md:text-4xl font-light">
                Modules <span className="font-medium text-gradient-neon">recommandés</span>
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto" staggerDelay={0.06}>
            {modules.map((mod) => (
              <motion.div key={mod.name} variants={staggerItemVariants}>
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-violet-500/30 transition-all duration-300">
                  <mod.icon className="h-5 w-5 text-violet-400" />
                  <span className="font-medium">{mod.name}</span>
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
              <h2 className="text-3xl md:text-4xl font-light mb-6">
                Prêt à <span className="font-medium text-gradient-neon">simplifier</span> votre gestion ?
              </h2>
              <p className="text-muted-foreground mb-10 font-light">
                Demandez une démo personnalisée et découvrez MBA en action pour votre secteur.
              </p>
              <Link
                to="/contact?subject=Demande%20de%20d%C3%A9mo"
                className="group relative inline-flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-wide uppercase overflow-hidden"
              >
                <span className="absolute inset-0 bg-white rounded-full" />
                <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative text-background group-hover:text-white transition-colors duration-500">
                  Demander une démo
                </span>
                <ArrowRight className="relative h-4 w-4 text-background group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </SectionTransition>
    </Layout>
  );
}
