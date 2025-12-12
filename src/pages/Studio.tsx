import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Target, Users, Sparkles } from "lucide-react";
import { useParallax } from "@/hooks/use-parallax";
import { motion } from "framer-motion";
import logoHero from "@/assets/logo-hero.png";
import { 
  ScrollReveal, 
  StaggerContainer,
  staggerItemVariants,
  SectionTransition,
  ParallaxBackground,
  Hover3DCard,
  RippleButton,
  HorizontalScrollSection,
  HorizontalScrollItem,
} from "@/components/animations";

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description: "Nous repoussons constamment les limites du possible pour créer des expériences uniques.",
    color: "neon-violet",
    bg: "bg-neon-violet/10",
    iconColor: "text-neon-violet",
    border: "group-hover:border-neon-violet/50",
    shadow: "group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
  },
  {
    icon: Target,
    title: "Précision",
    description: "Chaque pixel, chaque ligne de code est pensée pour la perfection.",
    color: "emerald",
    bg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    border: "group-hover:border-emerald-500/50",
    shadow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
  },
  {
    icon: Users,
    title: "Partenariat",
    description: "Nous ne sommes pas un prestataire, mais votre partenaire de croissance digital.",
    color: "rose",
    bg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    border: "group-hover:border-rose-500/50",
    shadow: "group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    description: "Notre standard est l'excellence, notre objectif est de dépasser vos attentes.",
    color: "violet",
    bg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    border: "group-hover:border-violet-500/50",
    shadow: "group-hover:shadow-[0_0_40px_rgba(167,139,250,0.15)]",
  },
];

const timeline = [
  {
    year: "2020",
    title: "Naissance d'IMPARTIAL",
    description: "Création du studio avec une vision claire : révolutionner le digital gaming & tech.",
  },
  {
    year: "2021",
    title: "Premiers succès",
    description: "Lancement de nos premières collaborations majeures et construction de notre réputation.",
  },
  {
    year: "2022",
    title: "Expansion",
    description: "Élargissement de l'équipe et diversification des services vers le mobile et SaaS.",
  },
  {
    year: "2023",
    title: "Innovation 360°",
    description: "Lancement de notre offre écosystème complet pour accompagner les startups.",
  },
  {
    year: "2024",
    title: "Vers l'excellence",
    description: "Consolidation de notre expertise et expansion internationale.",
  },
];

const Studio = () => {
  const parallaxSlow = useParallax(0.15);
  const parallaxMedium = useParallax(0.25);

  return (
    <Layout>
      <FloatingParticles />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/10 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-bg" />
        <div 
          className="absolute top-1/4 right-1/4 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] bg-violet-600/15 rounded-full blur-[80px] md:blur-[120px] lg:blur-[150px] animate-pulse-glow"
          style={{ transform: `translateY(${parallaxSlow}px)` }}
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-[150px] md:w-[250px] lg:w-[300px] h-[150px] md:h-[250px] lg:h-[300px] bg-purple-600/10 rounded-full blur-[60px] md:blur-[100px] lg:blur-[120px] animate-pulse-glow hidden sm:block"
          style={{ transform: `translateY(${parallaxMedium}px)`, animationDelay: "1s" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal variant="fadeInUp">
              <div className="mb-6 flex justify-center">
                <div className="badge-gradient flex items-center gap-2 text-sm font-medium text-violet-300">
                  <Sparkles className="h-4 w-4" />
                  Notre histoire
                </div>
              </div>
            </ScrollReveal>
            
            <motion.div 
              className="mb-8 flex justify-center"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-neon-violet/50 blur-[60px] rounded-full scale-110 animate-pulse-glow" />
                <img
                  src={logoHero}
                  alt="IMPARTIAL"
                  className="relative w-32 h-32 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                />
              </div>
            </motion.div>
            
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
                Le Studio <span className="text-gradient-neon">IMPARTIAL</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <p className="text-xl text-muted-foreground">
                Un collectif de créatifs et de technologues passionnés, unis par une vision : 
                transformer vos idées en expériences digitales extraordinaires.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <SectionTransition className="py-24 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.2}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <ScrollReveal variant="fadeInLeft">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
                  <Sparkles className="h-4 w-4 text-neon-violet" />
                  <span className="text-sm font-medium text-neon-violet">Notre vision</span>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeInLeft" delay={0.1}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Créer l'<span className="text-gradient-neon">extraordinaire</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal variant="fadeInLeft" delay={0.2}>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Chez IMPARTIAL, nous croyons que le digital ne doit pas être un compromis. 
                  Nous fusionnons l'esthétique gaming et tech avec une approche premium pour 
                  créer des expériences qui marquent les esprits.
                </p>
              </ScrollReveal>

              <ScrollReveal variant="fadeInLeft" delay={0.3}>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Notre nom ? <span className="text-neon-violet font-medium">IMPARTIAL</span>. 
                  Parce que nous abordons chaque projet sans préjugé, avec un regard neuf et 
                  une objectivité totale pour trouver LA meilleure solution pour vous.
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal variant="fadeInRight" delay={0.2}>
              <Hover3DCard className="rounded-3xl">
                <div className="aspect-square rounded-3xl bg-glass-dark/60 backdrop-blur-xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 via-transparent to-purple-600/10" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-neon-violet/20 rounded-full blur-[80px] animate-pulse-glow" />
                  
                  <div className="text-center p-8 relative z-10">
                    <div className="text-7xl md:text-8xl font-black text-gradient-neon mb-4">
                      100%
                    </div>
                    <p className="text-xl text-muted-foreground">Engagement client</p>
                  </div>
                </div>
              </Hover3DCard>
            </ScrollReveal>
          </div>
        </div>
      </SectionTransition>

      {/* Timeline - Horizontal Scroll */}
      <HorizontalScrollSection
        title="Notre parcours"
        subtitle="Les étapes clés de notre aventure"
        badge="Timeline"
        className="bg-gradient-to-b from-transparent via-purple-600/5 to-transparent"
      >
        {timeline.map((item, index) => (
          <HorizontalScrollItem key={item.year} index={index} className="w-[350px] lg:w-[400px]">
            <Hover3DCard className="h-full rounded-2xl" rotateStrength={5}>
              <div className="h-full bg-glass-dark/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-violet via-purple-500 to-transparent" />
                
                <div className="relative z-10">
                  <div className="text-5xl font-black text-gradient-neon mb-4">{item.year}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </Hover3DCard>
          </HorizontalScrollItem>
        ))}
      </HorizontalScrollSection>

      {/* Values Section */}
      <SectionTransition className="py-24 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.2}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <ScrollReveal variant="fadeInUp">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
                <Sparkles className="h-4 w-4 text-neon-violet" />
                <span className="text-sm font-medium text-neon-violet">Nos piliers</span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos <span className="text-gradient-neon">valeurs</span></h2>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Les piliers qui guident chacune de nos créations.
              </p>
            </ScrollReveal>
          </div>

          <StaggerContainer 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            staggerDelay={0.1}
            delayStart={0.2}
          >
            {values.map((value, index) => (
              <motion.div key={value.title} variants={staggerItemVariants}>
                <Hover3DCard className="h-full rounded-2xl" rotateStrength={6}>
                  <div
                    className={`group h-full p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10 transition-all duration-500 ${value.border} ${value.shadow}`}
                  >
                    <div className={`w-14 h-14 rounded-xl ${value.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className={`h-7 w-7 ${value.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">{value.title}</h3>
                    <p className="text-muted-foreground text-sm group-hover:text-gray-300 transition-colors">{value.description}</p>
                  </div>
                </Hover3DCard>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </SectionTransition>

      {/* CTA Section */}
      <SectionTransition className="py-24 relative overflow-hidden" parallaxStrength={0.08} scaleOnScroll>
        <ParallaxBackground speed={0.3}>
          <div className="absolute inset-0 bg-gradient-to-r from-neon-violet/10 via-purple-600/10 to-blue-600/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[150px]" />
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal variant="scaleIn" duration={0.8}>
              <div className="bg-glass-dark/60 backdrop-blur-xl rounded-3xl p-12 md:p-16 text-center border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/5 via-transparent to-purple-600/5 rounded-3xl" />
                
                <div className="relative z-10">
                  <ScrollReveal variant="fadeInUp" delay={0.1}>
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
                      <Sparkles className="h-4 w-4 text-neon-violet" />
                      <span className="text-sm font-medium text-neon-violet">Rejoignez-nous</span>
                    </div>
                  </ScrollReveal>
                  
                  <ScrollReveal variant="fadeInUp" delay={0.2}>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                      Prêt à rejoindre l'<span className="text-gradient-neon">aventure</span> ?
                    </h2>
                  </ScrollReveal>

                  <ScrollReveal variant="fadeInUp" delay={0.3}>
                    <p className="text-xl text-muted-foreground mb-8">
                      Discutons de votre projet et voyons comment nous pouvons créer quelque chose d'exceptionnel ensemble.
                    </p>
                  </ScrollReveal>

                  <ScrollReveal variant="fadeInUp" delay={0.4}>
                    <Link to="/contact">
                      <RippleButton className="btn-gradient inline-flex items-center justify-center gap-3 px-10 py-5 text-white font-semibold rounded-xl text-lg">
                        Nous contacter
                        <ArrowRight className="h-5 w-5" />
                      </RippleButton>
                    </Link>
                  </ScrollReveal>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </SectionTransition>
    </Layout>
  );
};

export default Studio;
