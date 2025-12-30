import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { ArrowLeft, ExternalLink, Calendar, Users, Zap, Server, Sparkles, Check, Shield, Database, LineChart } from "lucide-react";
import { motion } from "framer-motion";
import { 
  ScrollReveal, 
  SectionTransition,
  ParallaxBackground,
  Hover3DCard,
  RippleButton,
} from "@/components/animations";

import altarysImg from "@/assets/portfolio/altarys-logo.png";

const projectDetails = {
  title: "Altarys Group",
  subtitle: "Plateforme DeFi et RWA avec dashboard administratif complet",
  category: "Backoffice",
  client: "Altarys Group",
  year: "2024",
  duration: "8 semaines",
  url: "https://altarys-group.fr/",
  description: `Altarys Group accompagne les professionnels de la finance dans leur transition vers l'écosystème DeFi et les actifs tokenisés (RWA). Le projet nécessitait une plateforme complète combinant un site vitrine informatif et un dashboard de gestion avancé.

L'interface a été conçue pour simplifier des concepts financiers complexes tout en maintenant un niveau de professionnalisme adapté au secteur. Le dashboard offre une vue claire des opérations et permet une gestion fluide des différents services proposés.`,
  challenges: [
    "Vulgariser des concepts DeFi complexes pour un public traditionnel",
    "Créer un dashboard intuitif pour la gestion multi-services",
    "Assurer la sécurité des données financières sensibles",
    "Intégrer des visualisations de données en temps réel",
  ],
  solutions: [
    "Design épuré avec hiérarchie visuelle claire",
    "Architecture modulaire avec composants réutilisables",
    "Authentification sécurisée et gestion des rôles",
    "Graphiques interactifs avec mises à jour live",
  ],
  technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Chart.js", "Framer Motion"],
  features: [
    "Dashboard administratif complet",
    "Gestion multi-utilisateurs",
    "Visualisation de données avancée",
    "Système de notifications",
    "Rapports automatisés",
    "Interface responsive",
  ],
  results: [
    { metric: "+85%", label: "Efficacité opérationnelle" },
    { metric: "50%", label: "Réduction temps admin" },
    { metric: "99.9%", label: "Uptime garanti" },
    { metric: "A+", label: "Score sécurité" },
  ],
  dashboardFeatures: [
    { icon: Database, title: "Base de données", description: "Gestion centralisée des données clients et transactions" },
    { icon: LineChart, title: "Analytics", description: "Tableaux de bord avec métriques en temps réel" },
    { icon: Shield, title: "Sécurité", description: "Authentification 2FA et chiffrement bout-en-bout" },
  ],
};

export default function AltarysProject() {
  return (
    <Layout>
      <FloatingParticles />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse-glow" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Back Link */}
          <ScrollReveal variant="fadeInLeft">
            <Link 
              to="/portfolio" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-blue-400 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au portfolio
            </Link>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <ScrollReveal variant="fadeInUp">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
                  <Server className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">{projectDetails.category}</span>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeInUp" delay={0.1}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
                  {projectDetails.title}
                </h1>
              </ScrollReveal>

              <ScrollReveal variant="fadeInUp" delay={0.2}>
                <p className="text-xl text-muted-foreground mb-6">
                  {projectDetails.subtitle}
                </p>
              </ScrollReveal>

              <ScrollReveal variant="fadeInUp" delay={0.3}>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-blue-400" />
                    {projectDetails.client}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    {projectDetails.year}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-blue-400" />
                    {projectDetails.duration}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeInUp" delay={0.4}>
                <a
                  href={projectDetails.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-500/50 text-blue-400 font-semibold rounded-xl hover:bg-blue-500/30 transition-all"
                >
                  Visiter le site
                  <ExternalLink className="h-4 w-4" />
                </a>
              </ScrollReveal>
            </div>

            {/* Main Image */}
            <ScrollReveal variant="fadeInRight">
              <Hover3DCard className="rounded-2xl" rotateStrength={5}>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                  <img
                    src={altarysImg}
                    alt={projectDetails.title}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>
              </Hover3DCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <SectionTransition className="py-16 relative" parallaxStrength={0.05}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <h2 className="text-3xl font-bold mb-6">
                À propos du <span className="text-blue-400">projet</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <p className="text-lg text-muted-foreground whitespace-pre-line leading-relaxed">
                {projectDetails.description}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </SectionTransition>

      {/* Dashboard Features */}
      <SectionTransition className="py-16 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.2}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        </ParallaxBackground>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal variant="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              Fonctionnalités <span className="text-blue-400">Backoffice</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {projectDetails.dashboardFeatures.map((feature, index) => (
              <ScrollReveal key={feature.title} variant="fadeInUp" delay={index * 0.1}>
                <Hover3DCard className="rounded-xl h-full">
                  <div className="p-8 bg-glass-dark/60 backdrop-blur-xl rounded-xl border border-white/10 hover:border-blue-500/40 transition-all h-full text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Hover3DCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionTransition>

      {/* Results Section */}
      <SectionTransition className="py-16 relative" parallaxStrength={0.05}>
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal variant="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              Résultats <span className="text-blue-400">obtenus</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {projectDetails.results.map((result, index) => (
              <ScrollReveal key={result.label} variant="scaleIn" delay={index * 0.1}>
                <Hover3DCard className="rounded-xl">
                  <div className="p-6 bg-glass-dark/60 backdrop-blur-xl rounded-xl border border-white/10 text-center hover:border-blue-500/40 transition-all">
                    <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                      {result.metric}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.label}
                    </div>
                  </div>
                </Hover3DCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionTransition>

      {/* Challenges & Solutions */}
      <SectionTransition className="py-16 relative" parallaxStrength={0.05}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Challenges */}
            <ScrollReveal variant="fadeInLeft">
              <Hover3DCard className="rounded-2xl h-full">
                <div className="p-8 bg-glass-dark/60 backdrop-blur-xl rounded-2xl border border-white/10 h-full">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-rose-400" />
                    </div>
                    Défis
                  </h3>
                  <ul className="space-y-4">
                    {projectDetails.challenges.map((challenge, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-rose-400">{index + 1}</span>
                        </div>
                        <span className="text-muted-foreground">{challenge}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Hover3DCard>
            </ScrollReveal>

            {/* Solutions */}
            <ScrollReveal variant="fadeInRight">
              <Hover3DCard className="rounded-2xl h-full">
                <div className="p-8 bg-glass-dark/60 backdrop-blur-xl rounded-2xl border border-white/10 h-full">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Check className="h-5 w-5 text-emerald-400" />
                    </div>
                    Solutions
                  </h3>
                  <ul className="space-y-4">
                    {projectDetails.solutions.map((solution, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-emerald-400" />
                        </div>
                        <span className="text-muted-foreground">{solution}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Hover3DCard>
            </ScrollReveal>
          </div>
        </div>
      </SectionTransition>

      {/* Technologies */}
      <SectionTransition className="py-16 relative" parallaxStrength={0.05}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal variant="fadeInUp" className="text-center mb-8">
              <h2 className="text-3xl font-bold">
                Technologies <span className="text-blue-400">utilisées</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fadeIn" delay={0.2}>
              <div className="flex flex-wrap justify-center gap-4">
                {projectDetails.technologies.map((tech, index) => (
                  <motion.div
                    key={tech}
                    className="px-6 py-3 bg-glass-dark/60 backdrop-blur-xl rounded-xl border border-white/10 hover:border-blue-500/40 transition-all"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                  >
                    <span className="font-medium">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </SectionTransition>

      {/* CTA Section */}
      <SectionTransition className="py-20 relative overflow-hidden" parallaxStrength={0.08}>
        <ParallaxBackground speed={0.3}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-600/10 to-blue-600/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[150px]" />
        </ParallaxBackground>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal variant="scaleIn" duration={0.8}>
            <div className="bg-glass-dark/60 backdrop-blur-xl rounded-3xl p-12 text-center max-w-3xl mx-auto border border-white/10">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Votre projet</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Besoin d'un <span className="text-blue-400">backoffice</span> sur mesure ?
              </h2>

              <p className="text-muted-foreground mb-8">
                Créons ensemble le dashboard parfait pour gérer votre activité.
              </p>

              <RippleButton
                onClick={() => window.location.href = "/contact"}
                className="px-8 py-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 font-semibold rounded-xl hover:bg-blue-500/30 transition-all"
              >
                Démarrer un projet
              </RippleButton>
            </div>
          </ScrollReveal>
        </div>
      </SectionTransition>
    </Layout>
  );
}
