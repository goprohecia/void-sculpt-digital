import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { ArrowLeft, ExternalLink, Calendar, Users, Zap, Gamepad2, Sparkles, Check, Trophy, Gift, Users2 } from "lucide-react";
import { motion } from "framer-motion";
import { 
  ScrollReveal, 
  SectionTransition,
  ParallaxBackground,
  Hover3DCard,
  RippleButton,
} from "@/components/animations";

const projectDetails = {
  title: "Guardian Of Prophecia",
  subtitle: "Plateforme gaming complète avec système de rewards et communauté",
  category: "Écosystème 360°",
  client: "Guardian Of Prophecia",
  year: "2024",
  duration: "12 semaines",
  url: "https://goprophecia.gg?inviteCode=YANNI-DZ94",
  description: `Guardian Of Prophecia est une plateforme gaming innovante qui combine communauté, rewards et expérience immersive. Le projet nécessitait un écosystème complet incluant site web, système d'invitation, gestion des récompenses et intégrations Web3.

L'objectif était de créer une expérience gaming haut de gamme qui engage les joueurs et les récompense pour leur participation active à la communauté. L'interface devait être à la fois spectaculaire et fonctionnelle, avec des animations fluides et une navigation intuitive.`,
  challenges: [
    "Créer une expérience gaming immersive et engageante",
    "Développer un système d'invitation et de rewards robuste",
    "Intégrer des fonctionnalités Web3 pour les récompenses",
    "Gérer une communauté active avec des fonctionnalités sociales",
  ],
  solutions: [
    "Interface gaming avec effets visuels premium",
    "Architecture backend scalable pour le système de points",
    "Smart contracts pour les rewards tokenisés",
    "Système de gamification avec leaderboards et achievements",
  ],
  technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Web3.js", "Socket.io", "Redis"],
  features: [
    "Système d'invitation viral",
    "Programme de rewards",
    "Leaderboards temps réel",
    "Profils utilisateurs complets",
    "Intégration Web3",
    "Chat communautaire",
  ],
  results: [
    { metric: "10K+", label: "Utilisateurs actifs" },
    { metric: "50K+", label: "Invitations générées" },
    { metric: "95%", label: "Rétention utilisateurs" },
    { metric: "4.9", label: "Note moyenne" },
  ],
  gamingFeatures: [
    { icon: Trophy, title: "Compétitions", description: "Tournois et classements pour les meilleurs joueurs" },
    { icon: Gift, title: "Rewards", description: "Système de récompenses tokenisées et exclusives" },
    { icon: Users2, title: "Communauté", description: "Espaces sociaux pour connecter les joueurs" },
  ],
};

export default function PropheciaProject() {
  return (
    <Layout>
      <FloatingParticles />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-600/15 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto px-4 relative z-10">
          {/* Back Link */}
          <ScrollReveal variant="fadeInLeft">
            <Link 
              to="/portfolio" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-emerald-400 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au portfolio
            </Link>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <ScrollReveal variant="fadeInUp">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <Gamepad2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">{projectDetails.category}</span>
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
                    <Users className="h-4 w-4 text-emerald-400" />
                    {projectDetails.client}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    {projectDetails.year}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    {projectDetails.duration}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeInUp" delay={0.4}>
                <a
                  href={projectDetails.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/30 transition-all"
                >
                  Visiter la plateforme
                  <ExternalLink className="h-4 w-4" />
                </a>
              </ScrollReveal>
            </div>

            {/* Main Image - Gaming Style */}
            <ScrollReveal variant="fadeInRight">
              <Hover3DCard className="rounded-2xl" rotateStrength={8}>
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.3)]">
                  <div className="aspect-video bg-gradient-to-br from-emerald-900/50 via-background to-cyan-900/30 flex items-center justify-center">
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Gamepad2 className="w-24 h-24 text-emerald-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-emerald-400">GUARDIAN OF PROPHECIA</h3>
                      <p className="text-muted-foreground">Gaming Platform</p>
                    </motion.div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  
                  {/* Animated border effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/50 animate-pulse" />
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
                À propos du <span className="text-emerald-400">projet</span>
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

      {/* Gaming Features */}
      <SectionTransition className="py-16 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.2}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
        </ParallaxBackground>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal variant="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              Expérience <span className="text-emerald-400">Gaming</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {projectDetails.gamingFeatures.map((feature, index) => (
              <ScrollReveal key={feature.title} variant="fadeInUp" delay={index * 0.1}>
                <Hover3DCard className="rounded-xl h-full">
                  <div className="p-8 bg-glass-dark/60 backdrop-blur-xl rounded-xl border border-white/10 hover:border-emerald-500/40 transition-all h-full text-center group">
                    <motion.div 
                      className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: 10 }}
                    >
                      <feature.icon className="h-8 w-8 text-emerald-400" />
                    </motion.div>
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
              Résultats <span className="text-emerald-400">obtenus</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {projectDetails.results.map((result, index) => (
              <ScrollReveal key={result.label} variant="scaleIn" delay={index * 0.1}>
                <Hover3DCard className="rounded-xl">
                  <div className="p-6 bg-glass-dark/60 backdrop-blur-xl rounded-xl border border-white/10 text-center hover:border-emerald-500/40 transition-all">
                    <motion.div 
                      className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                    >
                      {result.metric}
                    </motion.div>
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
                Stack <span className="text-emerald-400">technique</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fadeIn" delay={0.2}>
              <div className="flex flex-wrap justify-center gap-4">
                {projectDetails.technologies.map((tech, index) => (
                  <motion.div
                    key={tech}
                    className="px-6 py-3 bg-glass-dark/60 backdrop-blur-xl rounded-xl border border-white/10 hover:border-emerald-500/40 transition-all"
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

      {/* Features */}
      <SectionTransition className="py-16 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.2}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
        </ParallaxBackground>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal variant="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              Fonctionnalités <span className="text-emerald-400">clés</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {projectDetails.features.map((feature, index) => (
              <ScrollReveal key={feature} variant="fadeInUp" delay={index * 0.1}>
                <Hover3DCard className="rounded-xl">
                  <div className="p-6 bg-glass-dark/60 backdrop-blur-xl rounded-xl border border-white/10 hover:border-emerald-500/40 transition-all flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                </Hover3DCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionTransition>

      {/* CTA Section */}
      <SectionTransition className="py-20 relative overflow-hidden" parallaxStrength={0.08}>
        <ParallaxBackground speed={0.3}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-600/10 to-emerald-600/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[150px]" />
        </ParallaxBackground>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal variant="scaleIn" duration={0.8}>
            <div className="bg-glass-dark/60 backdrop-blur-xl rounded-3xl p-12 text-center max-w-3xl mx-auto border border-white/10">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Votre projet</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Un projet <span className="text-emerald-400">gaming</span> en vue ?
              </h2>

              <p className="text-muted-foreground mb-8">
                Créons ensemble une expérience gaming immersive et engageante.
              </p>

              <RippleButton
                onClick={() => window.location.href = "/contact"}
                className="px-8 py-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/30 transition-all"
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
