import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import { FAQ } from "@/components/FAQ";
import { FloatingParticles } from "@/components/FloatingParticles";
import TypeWriter from "@/components/TypeWriter";
import { ArrowRight, Globe, Smartphone, Server, Layers, Sparkles } from "lucide-react";
import { useParallax } from "@/hooks/use-parallax";
import logoHero from "@/assets/logo-hero.png";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition, ParallaxBackground } from "@/components/animations";
const services = [{
  icon: Globe,
  title: "Sites Web & Vitrines",
  description: "Architectures web immersives, du site vitrine au e-commerce puissant.",
  href: "/services/web",
  color: "neon-violet"
}, {
  icon: Smartphone,
  title: "Applications Mobiles",
  description: "Apps natives et cross-platform fluides pour engager vos utilisateurs.",
  href: "/services/mobile",
  color: "neon-green"
}, {
  icon: Server,
  title: "Backoffice & SaaS",
  description: "Dashboards puissants et automatisations pour piloter votre activité.",
  href: "/services/backoffice",
  color: "neon-red"
}, {
  icon: Layers,
  title: "Écosystème 360°",
  description: "L'alliance parfaite : Site + App + Backoffice. La solution ultime.",
  href: "/services/360",
  color: "tier-custom"
}];
const Index = () => {
  const parallaxSlow = useParallax(0.15);
  const parallaxMedium = useParallax(0.25);
  const parallaxFast = useParallax(0.35);
  return <Layout>
    {/* Floating Particles Background */}
    <FloatingParticles />

    {/* Hero Section */}
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/10 via-transparent to-neon-blue/5" />
      <div className="absolute inset-0 grid-bg" />
      
      {/* Glowing Orbs with Parallax - smaller on mobile */}
      <div className="absolute top-1/4 left-1/4 w-[250px] md:w-[400px] lg:w-[500px] h-[250px] md:h-[400px] lg:h-[500px] bg-violet-600/20 rounded-full blur-[100px] md:blur-[150px] lg:blur-[180px] animate-pulse-glow" style={{
        transform: `translateY(${parallaxSlow}px)`
      }} />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] bg-blue-600/15 rounded-full blur-[80px] md:blur-[120px] lg:blur-[150px] animate-pulse-glow hidden sm:block" style={{
        transform: `translateY(${parallaxMedium}px)`,
        animationDelay: "1s"
      }} />
      <div className="absolute top-1/2 right-1/3 w-[150px] md:w-[250px] lg:w-[300px] h-[150px] md:h-[250px] lg:h-[300px] bg-purple-500/10 rounded-full blur-[60px] md:blur-[100px] lg:blur-[120px] hidden md:block" style={{
        transform: `translateY(${parallaxFast}px)`
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div className="mb-4 flex justify-center" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1]
          }}>
            <div className="badge-gradient flex items-center gap-2 text-sm font-medium text-violet-300">
              <Sparkles className="h-4 w-4" />
              Studio Digital Gaming & Tech
            </div>
          </motion.div>

          {/* Logo */}
          <motion.div className="mb-4 flex justify-center" initial={{
            opacity: 0,
            scale: 0.8,
            rotate: -10
          }} animate={{
            opacity: 1,
            scale: 1,
            rotate: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1]
          }} style={{
            opacity: Math.max(0, 1 - Math.abs(parallaxSlow) * 0.008)
          }}>
            <div className="relative group cursor-pointer transition-transform duration-100" style={{
              transform: `translateY(${parallaxSlow * -0.5}px) scale(${1 - Math.abs(parallaxSlow) * 0.001}) rotate(${parallaxSlow * 0.02}deg)`
            }}>
              <div className="absolute inset-0 bg-neon-violet/60 blur-[80px] rounded-full animate-logo-glow-entrance transition-all duration-500 group-hover:bg-neon-violet/80 group-hover:blur-[100px] group-hover:scale-[1.5]" style={{
                opacity: Math.max(0, 1 - Math.abs(parallaxSlow) * 0.006)
              }} />
              <div className="absolute inset-0 bg-violet-500/40 blur-[50px] rounded-full animate-logo-glow-entrance transition-all duration-500 group-hover:bg-violet-500/60 group-hover:blur-[70px]" style={{
                animationDelay: "0.3s",
                opacity: Math.max(0, 1 - Math.abs(parallaxSlow) * 0.006)
              }} />
              <img src={logoHero} alt="Impartial Logo" className="relative h-32 md:h-40 lg:h-48 w-auto drop-shadow-[0_0_50px_rgba(139,92,246,0.7)] drop-shadow-[0_0_100px_rgba(139,92,246,0.4)] animate-logo-entrance transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_80px_rgba(139,92,246,0.9)] group-hover:rotate-[5deg]" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 tracking-tight" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1]
          }}>
            <span className="text-logo-gradient">IMPARTIAL</span>
          </motion.h1>

          <motion.p className="text-lg sm:text-xl md:text-2xl font-medium text-white mb-3 tracking-wide min-h-[1.75rem] md:min-h-[2rem]" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.6,
            delay: 0.5
          }}>
            <TypeWriter text="Créateurs d'expériences digitales" delay={40} startDelay={800} />
          </motion.p>

          <motion.p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed min-h-[3rem] md:min-h-[3.5rem] px-2 sm:px-0" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.6,
            delay: 0.6
          }}>
            <TypeWriter text="Nous transformons vos idées en solutions digitales performantes : sites web, applications mobiles et écosystèmes complets." delay={25} startDelay={2200} />
          </motion.p>

          {/* CTAs */}
          <motion.div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4 sm:px-0" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.8,
            ease: [0.25, 0.1, 0.25, 1]
          }}>
            <Link to="/contact" className="w-full sm:w-auto btn-gradient inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 text-white font-semibold rounded-xl text-sm md:text-base">
              Démarrer un projet
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
            <Link to="/portfolio" className="w-full sm:w-auto glass-button inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 font-semibold text-sm md:text-base hover:border-primary/50">
              Voir nos réalisations
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - hidden on small screens */}
      <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block" initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 1.2
      }}>
        
      </motion.div>
    </section>

    {/* Services Section */}
    <SectionTransition className="py-16 md:py-24 relative" parallaxStrength={0.05}>
      {/* Background glow */}
      <ParallaxBackground speed={0.2}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
      </ParallaxBackground>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <div className="inline-flex items-center gap-2 mb-4 px-3 md:px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-neon-violet" />
              <span className="text-xs md:text-sm font-medium text-neon-violet">Services Premium</span>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">Nos expertises</h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              Des solutions digitales complètes pour propulser votre business vers de nouveaux sommets.
            </p>
          </ScrollReveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" staggerDelay={0.1} delayStart={0.2}>
          {services.map((service, index) => {
            const colorClasses = {
              'neon-violet': {
                bg: 'bg-neon-violet/10',
                icon: 'text-neon-violet',
                border: 'group-hover:border-neon-violet/50',
                shadow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]',
                glow: 'group-hover:bg-neon-violet/20'
              },
              'neon-green': {
                bg: 'bg-emerald-500/10',
                icon: 'text-emerald-400',
                border: 'group-hover:border-emerald-500/50',
                shadow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]',
                glow: 'group-hover:bg-emerald-500/20'
              },
              'neon-red': {
                bg: 'bg-rose-500/10',
                icon: 'text-rose-400',
                border: 'group-hover:border-rose-500/50',
                shadow: 'group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]',
                glow: 'group-hover:bg-rose-500/20'
              },
              'tier-custom': {
                bg: 'bg-gradient-to-br from-neon-violet/10 to-blue-500/10',
                icon: 'text-violet-400',
                border: 'group-hover:border-violet-500/50',
                shadow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]',
                glow: 'group-hover:bg-gradient-to-br group-hover:from-neon-violet/20 group-hover:to-blue-500/20'
              }
            };
            const colors = colorClasses[service.color as keyof typeof colorClasses];
              return <motion.div key={service.href} variants={staggerItemVariants}>
                <Link to={service.href} className={`group relative block p-6 md:p-8 rounded-xl md:rounded-2xl glass-card transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 ${colors.border} ${colors.shadow}`}>
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.glow}`} />
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl ${colors.bg} flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className={`h-6 w-6 md:h-7 md:w-7 ${colors.icon}`} />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 group-hover:text-white transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4 group-hover:text-gray-300 transition-colors">{service.description}</p>
                    <span className={`inline-flex items-center gap-1 text-xs md:text-sm font-medium ${colors.icon} group-hover:gap-3 transition-all duration-300`}>
                      Explorer
                      <ArrowRight className="h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>;
          })}
        </StaggerContainer>
      </div>
    </SectionTransition>

    {/* Portfolio Showcase Section */}
    <PortfolioShowcase />

    {/* FAQ Section */}
    <FAQ />

    {/* CTA Section */}
    <SectionTransition className="py-16 md:py-24 relative overflow-hidden" parallaxStrength={0.08} scaleOnScroll>
      {/* Background Effects */}
      <ParallaxBackground speed={0.3}>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-violet/10 via-purple-600/10 to-blue-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[500px] lg:h-[600px] bg-violet-600/15 rounded-full blur-[100px] md:blur-[150px] lg:blur-[180px]" />
      </ParallaxBackground>
      <div className="absolute top-0 right-0 w-[150px] md:w-[250px] lg:w-[300px] h-[150px] md:h-[250px] lg:h-[300px] bg-purple-500/10 rounded-full blur-[60px] md:blur-[80px] lg:blur-[100px] hidden sm:block" />
      <div className="absolute bottom-0 left-0 w-[150px] md:w-[250px] lg:w-[300px] h-[150px] md:h-[250px] lg:h-[300px] bg-blue-500/10 rounded-full blur-[60px] md:blur-[80px] lg:blur-[100px] hidden sm:block" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Glassmorphism Card */}
          <ScrollReveal variant="scaleIn" duration={0.8}>
            <div className="glass-ultra text-center relative overflow-hidden p-8 md:p-12 lg:p-16">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 via-transparent to-purple-600/10 rounded-[inherit]" />
              
              <div className="relative z-10">
                <ScrollReveal variant="fadeInUp" delay={0.1}>
                  <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
                    <Sparkles className="h-4 w-4 text-neon-violet" />
                    <span className="text-sm font-medium text-neon-violet">Démarrer un projet</span>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal variant="fadeInUp" delay={0.2}>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    Prêt à <span className="text-gradient-neon">révolutionner</span> votre présence digitale ?
                  </h2>
                </ScrollReveal>
                
                <ScrollReveal variant="fadeInUp" delay={0.3}>
                  <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                    Discutons de votre projet et créons ensemble quelque chose d'extraordinaire.
                  </p>
                </ScrollReveal>
                
                <ScrollReveal variant="fadeInUp" delay={0.4}>
                  <Link to="/contact" className="btn-gradient inline-flex items-center justify-center gap-3 px-10 py-5 text-white font-semibold rounded-xl text-lg">
                    Commencer maintenant
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SectionTransition>
  </Layout>;
};
export default Index;